export const REASON_CODES = {
  GRN_QTY_EXCEEDS_PO_QTY: 'grn_qty_exceeds_po_qty',
  INVOICE_QTY_EXCEEDS_GRN_QTY: 'invoice_qty_exceeds_grn_qty',
  INVOICE_QTY_EXCEEDS_PO_QTY: 'invoice_qty_exceeds_po_qty',
  INVOICE_DATE_AFTER_PO_DATE: 'invoice_date_after_po_date',
  DUPLICATE_PO: 'duplicate_po',
  DUPLICATE_DOCUMENT: 'duplicate_document',
  ITEM_MISSING_IN_PO: 'item_missing_in_po',
  PRICE_MISMATCH: 'price_mismatch',
  MRP_MISMATCH: 'mrp_mismatch',
  UNMAPPED_MASTER_SKU: 'unmapped_master_sku'
};

// Hard violations push the PO straight to `mismatch`; everything else that can
// appear in `reasons` (price_mismatch, mrp_mismatch, unmapped_master_sku) is a
// soft warning and only yields `partially_matched`.
export const HARD_VIOLATION_CODES = new Set([
  REASON_CODES.GRN_QTY_EXCEEDS_PO_QTY,
  REASON_CODES.INVOICE_QTY_EXCEEDS_GRN_QTY,
  REASON_CODES.INVOICE_QTY_EXCEEDS_PO_QTY,
  REASON_CODES.INVOICE_DATE_AFTER_PO_DATE,
  REASON_CODES.DUPLICATE_PO,
  REASON_CODES.DUPLICATE_DOCUMENT,
  REASON_CODES.ITEM_MISSING_IN_PO
]);

export const MATCH_STATUS = {
  INSUFFICIENT_DOCUMENTS: 'insufficient_documents',
  MISMATCH: 'mismatch',
  PARTIALLY_MATCHED: 'partially_matched',
  MATCHED: 'matched'
};
