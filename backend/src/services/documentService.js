import { StatusCodes } from 'http-status-codes';

import grnRepository from '../repositories/grnRepository.js';
import invoiceRepository from '../repositories/invoiceRepository.js';
import matchAuditRepository from '../repositories/matchAuditRepository.js';
import purchaseOrderRepository from '../repositories/purchaseOrderRepository.js';
import { getExtractionSchemaForType } from '../validators/documentExtractionSchema.js';
import ClientError from '../utils/errors/clientError.js';
import { extractStructuredData, getPromptForDocumentType } from './extraction/index.js';
import { resolveSkuMaster } from './masterResolutionService.js';

const DOCUMENT_TYPE_HANDLERS = {
  po: {
    label: 'Purchase Order',
    numberField: 'poNumber',
    repository: purchaseOrderRepository,
    checkDuplicate: async (data) => {
      const count = await purchaseOrderRepository.countByPoNumber(data.poNumber);
      return count > 1 ? 'duplicate_po' : null;
    }
  },
  grn: {
    label: 'GRN',
    numberField: 'grnNumber',
    repository: grnRepository,
    checkDuplicate: async (data) => {
      const count = await grnRepository.countByPoAndGrnNumber(data.poNumber, data.grnNumber);
      return count > 1 ? 'duplicate_document' : null;
    }
  },
  invoice: {
    label: 'Invoice',
    numberField: 'invoiceNumber',
    repository: invoiceRepository,
    checkDuplicate: async (data) => {
      const count = await invoiceRepository.countByPoAndInvoiceNumber(data.poNumber, data.invoiceNumber);
      return count > 1 ? 'duplicate_document' : null;
    }
  }
};

const ALL_TYPES = Object.keys(DOCUMENT_TYPE_HANDLERS);

const resolveItems = (items) =>
  Promise.all(
    items.map(async (item) => ({
      ...item,
      skuMaster: await resolveSkuMaster(item.itemCode)
    }))
  );

const parseWithRetry = async (documentType, file) => {
  const prompt = getPromptForDocumentType(documentType);
  const extractionSchema = getExtractionSchemaForType(documentType);

  let lastError;
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const raw = await extractStructuredData(file.path, file.mimetype, prompt);
      return { raw, validated: extractionSchema.parse(raw) };
    } catch (error) {
      lastError = error;
      console.log(`AI extraction attempt ${attempt} for ${documentType} failed`, error);
    }
  }

  throw new ClientError({
    explanation: lastError?.message,
    message: `Failed to extract structured data from the ${documentType} document after retry`,
    statusCode: StatusCodes.UNPROCESSABLE_ENTITY
  });
};

export const uploadDocumentService = async ({ documentType, file }) => {
  const typeConfig = DOCUMENT_TYPE_HANDLERS[documentType];

  const { raw, validated } = await parseWithRetry(documentType, file);
  const items = await resolveItems(validated.items);

  const saved = await typeConfig.repository.create({
    ...validated,
    items,
    rawParsed: raw,
    filePath: file.path,
    originalFileName: file.originalname,
    fileMimeType: file.mimetype
  });

  const duplicateReasonCode = await typeConfig.checkDuplicate(validated);

  await matchAuditRepository.appendStep(validated.poNumber, {
    step: 'upload',
    status: duplicateReasonCode || 'success',
    message: duplicateReasonCode
      ? `Duplicate ${typeConfig.label} detected for PO ${validated.poNumber}`
      : `${typeConfig.label} ${validated[typeConfig.numberField]} uploaded and stored`
  });

  return { document: saved, documentType, duplicate: duplicateReasonCode };
};

const notFoundError = () =>
  new ClientError({
    explanation: 'Invalid data sent from the client',
    message: 'Document not found',
    statusCode: StatusCodes.NOT_FOUND
  });

export const getDocumentByIdService = async (id) => {
  for (const type of ALL_TYPES) {
    const doc = await DOCUMENT_TYPE_HANDLERS[type].repository.getById(id);
    if (doc) return { document: doc, documentType: type };
  }
  throw notFoundError();
};

export const getDocumentFileService = async (id) => {
  const { document } = await getDocumentByIdService(id);
  return { filePath: document.filePath, fileMimeType: document.fileMimeType };
};

export const listDocumentsService = async ({ type, poNumber }) => {
  const filter = poNumber ? { poNumber } : {};
  const typesToQuery = type ? [type] : ALL_TYPES;

  const results = await Promise.all(
    typesToQuery.map(async (t) => {
      const docs = await DOCUMENT_TYPE_HANDLERS[t].repository.getAll(filter);
      return docs.map((document) => ({ document, documentType: t }));
    })
  );

  return results.flat();
};
