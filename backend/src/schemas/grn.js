import mongoose from 'mongoose';

import { itemBaseFields } from './shared/itemBaseFields.js';

const grnItemSchema = new mongoose.Schema(
  {
    ...itemBaseFields,
    receivedQuantity: { type: Number, required: true },
    mrp: { type: Number }
  }
);

const grnSchema = new mongoose.Schema(
  {
    grnNumber: { type: String, required: true, trim: true },
    poNumber: { type: String, required: true, trim: true },
    grnDate: { type: Date, required: true },
    items: [grnItemSchema],
    rawParsed: { type: mongoose.Schema.Types.Mixed }
  },
  { timestamps: true }
);

grnSchema.index({ poNumber: 1, grnNumber: 1 }, { unique: true });

const Grn = mongoose.model('Grn', grnSchema);
export default Grn;
