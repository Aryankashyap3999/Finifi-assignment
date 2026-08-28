import mongoose from 'mongoose';

const skuMasterSchema = new mongoose.Schema(
  {
    skuErpCode: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true },
    eanCode: { type: String, trim: true, index: true },
    hsnCode: { type: String, trim: true },
    uom: { type: String, trim: true },
    agreedRate: { type: Number },
    mrp: { type: Number },
    priceTolerance: { type: Number, default: 0.05 }
  },
  { timestamps: true }
);

const SkuMaster = mongoose.model('SkuMaster', skuMasterSchema);
export default SkuMaster;
