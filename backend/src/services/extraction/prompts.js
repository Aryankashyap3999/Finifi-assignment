const commonInstruction =
  'You are an information-extraction engine for procurement documents. Read the attached ' +
  'document carefully and return ONLY a single valid JSON object — no markdown formatting, ' +
  'no code fences, no commentary, no trailing text. All dates must be ISO 8601 strings ' +
  '(YYYY-MM-DD). All quantities and monetary amounts must be plain numbers, not strings. ' +
  'If a field is not present on the document, omit it rather than guessing. ' +
  'Document/PO/GRN/Invoice numbers must be copied EXACTLY as printed, character for character — ' +
  'never reformat, abbreviate, autocomplete, or substitute a different number found elsewhere on ' +
  'the page (e.g. a GSTIN, phone/contact number, HSN code, or unrelated reference code) — those ' +
  'are different fields and must never be used as the document number. If uncertain which number ' +
  'is correct, re-read the label immediately preceding it (e.g. "PO No", "Invoice No", "GRN No") ' +
  'before answering.';

const PROMPTS = {
  po: `${commonInstruction}

Document type: Purchase Order (PO)
Return JSON matching this exact shape:
{
  "poNumber": string,
  "poDate": string,
  "vendorName": string,
  "items": [
    { "itemCode": string, "description": string, "quantity": number }
  ]
}`,

  grn: `${commonInstruction}

Document type: Goods Receipt Note (GRN)
Return JSON matching this exact shape:
{
  "grnNumber": string,
  "poNumber": string,
  "grnDate": string,
  "items": [
    { "itemCode": string, "description": string, "receivedQuantity": number, "mrp": number }
  ]
}`,

  invoice: `${commonInstruction}

Document type: Invoice
Return JSON matching this exact shape:
{
  "invoiceNumber": string,
  "poNumber": string,
  "invoiceDate": string,
  "items": [
    { "itemCode": string, "description": string, "quantity": number, "unitRate": number, "mrp": number }
  ]
}`
};

export const getPromptForDocumentType = (documentType) => PROMPTS[documentType];
