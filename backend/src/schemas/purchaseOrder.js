import mongoose from 'mongoose';

import { documentFileFields } from './shared/documentFileFields.js';
import { itemBaseFields } from './shared/itemBaseFields.js';

const poItemSchema = new mongoose.Schema(
  {
    ...itemBaseFields,
    quantity: { type: Number, required: true }
  }
);

const purchaseOrderSchema = new mongoose.Schema(
  {
    poNumber: { type: String, required: true, trim: true, index: true },
    poDate: { type: Date, required: true },
    vendorName: { type: String, required: true },
    items: [poItemSchema],
    rawParsed: { type: mongoose.Schema.Types.Mixed },
    ...documentFileFields
  },
  { timestamps: true }
);

const PurchaseOrder = mongoose.model('PurchaseOrder', purchaseOrderSchema);
export default PurchaseOrder;
