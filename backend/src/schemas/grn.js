import mongoose from 'mongoose';

import { documentFileFields } from './shared/documentFileFields.js';
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
    rawParsed: { type: mongoose.Schema.Types.Mixed },
    ...documentFileFields
  },
  { timestamps: true }
);

// Not unique: a repeat grnNumber under the same poNumber is a valid, storable
// duplicate_document case (spec: "store it anyway, don't overwrite"). This index
// exists purely to make the duplication-count lookup fast.
grnSchema.index({ poNumber: 1, grnNumber: 1 });

const Grn = mongoose.model('Grn', grnSchema);
export default Grn;
