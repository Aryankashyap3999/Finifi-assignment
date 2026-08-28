import { StatusCodes } from 'http-status-codes';

import {
  getDocumentByIdService,
  getDocumentFileService,
  listDocumentsService,
  uploadDocumentService
} from '../services/documentService.js';
import {
  customErrorResponse,
  internalErrorResponse,
  successResponse
} from '../utils/commons/responseObject.js';

export const uploadDocument = async (req, res) => {
  try {
    const result = await uploadDocumentService({
      documentType: req.body.documentType,
      file: req.file
    });
    return res
      .status(StatusCodes.CREATED)
      .json(successResponse(result, 'Document uploaded and processed successfully'));
  } catch (error) {
    console.log('Document controller error', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const getDocumentById = async (req, res) => {
  try {
    const result = await getDocumentByIdService(req.params.id);
    return res
      .status(StatusCodes.OK)
      .json(successResponse(result, 'Document fetched successfully'));
  } catch (error) {
    console.log('Document controller error', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const getDocumentFile = async (req, res) => {
  try {
    const { filePath, fileMimeType } = await getDocumentFileService(req.params.id);
    if (fileMimeType) {
      res.setHeader('Content-Type', fileMimeType);
    }
    return res.sendFile(filePath);
  } catch (error) {
    console.log('Document controller error', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const listDocuments = async (req, res) => {
  try {
    const documents = await listDocumentsService({
      type: req.query.type,
      poNumber: req.query.poNumber
    });
    return res
      .status(StatusCodes.OK)
      .json(successResponse(documents, 'Documents fetched successfully'));
  } catch (error) {
    console.log('Document controller error', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};
