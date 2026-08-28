import mongoose from 'mongoose';

import { documentFileFields } from './shared/documentFileFields.js';
import { itemBaseFields } from './shared/itemBaseFields.js';

const invoiceItemSchema = new mongoose.Schema(
  {
    ...itemBaseFields,
    quantity: { type: Number, required: true },
    unitRate: { type: Number },
    mrp: { type: Number }
  }
);

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, trim: true },
    poNumber: { type: String, required: true, trim: true },
    invoiceDate: { type: Date, required: true },
    items: [invoiceItemSchema],
    rawParsed: { type: mongoose.Schema.Types.Mixed },
    ...documentFileFields
  },
  { timestamps: true }
);

// Not unique — see grn.js for why: duplicates must be storable, not rejected.
invoiceSchema.index({ poNumber: 1, invoiceNumber: 1 });

const Invoice = mongoose.model('Invoice', invoiceSchema);
export default Invoice;
