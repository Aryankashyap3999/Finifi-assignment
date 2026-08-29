export const MATCH_STATUS_LABELS = {
  matched: 'Matched',
  partially_matched: 'Partially Matched',
  mismatch: 'Mismatch',
  insufficient_documents: 'Insufficient Documents'
};

export const MATCH_STATUS_VARIANTS = {
  matched: 'success',
  partially_matched: 'warning',
  mismatch: 'danger',
  insufficient_documents: 'neutral'
};

export const REASON_LABELS = {
  grn_qty_exceeds_po_qty: 'GRN Qty Exceeds PO Qty',
  invoice_qty_exceeds_grn_qty: 'Invoice Qty Exceeds GRN Qty',
  invoice_qty_exceeds_po_qty: 'Invoice Qty Exceeds PO Qty',
  invoice_date_after_po_date: 'Invoice Date After PO Date',
  duplicate_po: 'Duplicate PO',
  duplicate_document: 'Duplicate Document',
  item_missing_in_po: 'Item Missing in PO',
  price_mismatch: 'Price Mismatch',
  mrp_mismatch: 'MRP Mismatch',
  unmapped_master_sku: 'Unmapped SKU'
};
