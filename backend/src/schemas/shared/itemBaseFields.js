import mongoose from 'mongoose';

export const itemBaseFields = {
  itemCode: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  skuMaster: { type: mongoose.Schema.Types.ObjectId, ref: 'SkuMaster', default: null }
};
