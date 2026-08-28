import { HARD_VIOLATION_CODES, MATCH_STATUS, REASON_CODES } from '../constants/matchReasonCodes.js';
import { findSkuMaster } from './masterResolutionService.js';
import grnRepository from '../repositories/grnRepository.js';
import invoiceRepository from '../repositories/invoiceRepository.js';
import purchaseOrderRepository from '../repositories/purchaseOrderRepository.js';

const MRP_TOLERANCE = 0.01;

const normalizeItemCode = (itemCode) => itemCode.trim().toLowerCase();

// An item's skuMaster ref reflects resolution *at upload time*. A SkuMaster
// record created afterward must still be picked up on the next match read
// (spec: "a recomputed match should pick it up"), so unresolved items get a
// fresh lookup here rather than trusting the stored (possibly stale) null.
const resolveEffectiveSkuMaster = (item) => (item.skuMaster ? Promise.resolve(item.skuMaster) : findSkuMaster(item.itemCode));

const itemKeyFor = (skuMaster, item) =>
  skuMaster ? String(skuMaster._id) : `raw:${normalizeItemCode(item.itemCode)}`;

const getOrCreateEntry = (map, key, skuMaster, item) => {
  if (!map.has(key)) {
    map.set(key, {
      key,
      skuMaster,
      itemCode: item.itemCode,
      description: item.description,
      poQuantity: 0,
      grnQuantity: 0,
      invoiceQuantity: 0,
      inPo: false,
      unitRates: [],
      grnMrps: [],
      invoiceMrps: [],
      reasons: new Set()
    });
  }
  return map.get(key);
};

const hasDuplicateNumbers = (docs, numberField) => {
  const seen = new Set();
  for (const doc of docs) {
    if (seen.has(doc[numberField])) return true;
    seen.add(doc[numberField]);
  }
  return false;
};

export const computeMatchResult = async (poNumber) => {
  const [pos, grns, invoices] = await Promise.all([
    purchaseOrderRepository.getAllByPoNumber(poNumber),
    grnRepository.getAllByPoNumber(poNumber),
    invoiceRepository.getAllByPoNumber(poNumber)
  ]);

  const referencePo = pos[0] ?? null;
  const overallReasons = new Set();
  const itemsMap = new Map();

  if (pos.length > 1) overallReasons.add(REASON_CODES.DUPLICATE_PO);
  if (hasDuplicateNumbers(grns, 'grnNumber') || hasDuplicateNumbers(invoices, 'invoiceNumber')) {
    overallReasons.add(REASON_CODES.DUPLICATE_DOCUMENT);
  }
  if (referencePo && invoices.some((invoice) => invoice.invoiceDate > referencePo.poDate)) {
    overallReasons.add(REASON_CODES.INVOICE_DATE_AFTER_PO_DATE);
  }

  if (referencePo) {
    for (const item of referencePo.items) {
      const skuMaster = await resolveEffectiveSkuMaster(item);
      const entry = getOrCreateEntry(itemsMap, itemKeyFor(skuMaster, item), skuMaster, item);
      entry.poQuantity += item.quantity;
      entry.inPo = true;
      if (!skuMaster) entry.reasons.add(REASON_CODES.UNMAPPED_MASTER_SKU);
    }
  }

  for (const grn of grns) {
    for (const item of grn.items) {
      const skuMaster = await resolveEffectiveSkuMaster(item);
      const entry = getOrCreateEntry(itemsMap, itemKeyFor(skuMaster, item), skuMaster, item);
      entry.grnQuantity += item.receivedQuantity;
      if (item.mrp != null) entry.grnMrps.push(item.mrp);
      if (!skuMaster) entry.reasons.add(REASON_CODES.UNMAPPED_MASTER_SKU);
    }
  }

  for (const invoice of invoices) {
    for (const item of invoice.items) {
      const skuMaster = await resolveEffectiveSkuMaster(item);
      const entry = getOrCreateEntry(itemsMap, itemKeyFor(skuMaster, item), skuMaster, item);
      entry.invoiceQuantity += item.quantity;
      if (item.unitRate != null) entry.unitRates.push(item.unitRate);
      if (item.mrp != null) entry.invoiceMrps.push(item.mrp);
      if (!skuMaster) entry.reasons.add(REASON_CODES.UNMAPPED_MASTER_SKU);
    }
  }

  let fullyReconciled = true;

  for (const entry of itemsMap.values()) {
    if (referencePo && !entry.inPo) {
      entry.reasons.add(REASON_CODES.ITEM_MISSING_IN_PO);
    }

    if (entry.inPo) {
      if (grns.length > 0 && entry.grnQuantity > entry.poQuantity) {
        entry.reasons.add(REASON_CODES.GRN_QTY_EXCEEDS_PO_QTY);
      }
      if (invoices.length > 0 && entry.invoiceQuantity > entry.poQuantity) {
        entry.reasons.add(REASON_CODES.INVOICE_QTY_EXCEEDS_PO_QTY);
      }
      if (entry.grnQuantity !== entry.poQuantity || entry.invoiceQuantity !== entry.poQuantity) {
        fullyReconciled = false;
      }
    }

    if (grns.length > 0 && invoices.length > 0 && entry.invoiceQuantity > entry.grnQuantity) {
      entry.reasons.add(REASON_CODES.INVOICE_QTY_EXCEEDS_GRN_QTY);
    }

    const sku = entry.skuMaster;
    if (sku) {
      if (sku.agreedRate > 0) {
        const tolerance = sku.priceTolerance > 0 ? sku.priceTolerance : 0;
        const mismatched = entry.unitRates.some(
          (rate) => Math.abs(rate - sku.agreedRate) / sku.agreedRate > tolerance
        );
        if (mismatched) entry.reasons.add(REASON_CODES.PRICE_MISMATCH);
      }
      if (sku.mrp > 0) {
        const mismatched = [...entry.grnMrps, ...entry.invoiceMrps].some(
          (mrp) => Math.abs(mrp - sku.mrp) / sku.mrp > MRP_TOLERANCE
        );
        if (mismatched) entry.reasons.add(REASON_CODES.MRP_MISMATCH);
      }
    }

    for (const reason of entry.reasons) overallReasons.add(reason);
  }

  const items = Array.from(itemsMap.values()).map((entry) => ({
    key: entry.key,
    skuMaster: entry.skuMaster,
    itemCode: entry.itemCode,
    description: entry.description,
    poQuantity: entry.poQuantity,
    grnQuantity: entry.grnQuantity,
    invoiceQuantity: entry.invoiceQuantity,
    reasons: Array.from(entry.reasons)
  }));

  const insufficientDocuments = !referencePo || grns.length === 0 || invoices.length === 0;
  const hasHardViolation = Array.from(overallReasons).some((reason) => HARD_VIOLATION_CODES.has(reason));

  let status;
  if (insufficientDocuments) {
    status = MATCH_STATUS.INSUFFICIENT_DOCUMENTS;
  } else if (hasHardViolation) {
    status = MATCH_STATUS.MISMATCH;
  } else if (overallReasons.size > 0 || !fullyReconciled) {
    status = MATCH_STATUS.PARTIALLY_MATCHED;
  } else {
    status = MATCH_STATUS.MATCHED;
  }

  return {
    poNumber,
    status,
    reasons: Array.from(overallReasons),
    linkedDocuments: { pos, grns, invoices },
    items
  };
};
