import mongoose from 'mongoose';

const matchAuditStepSchema = new mongoose.Schema(
  {
    step: { type: String, required: true },
    status: { type: String, required: true },
    message: { type: String },
    at: { type: Date, default: Date.now }
  },
  { _id: false }
);

const matchAuditSchema = new mongoose.Schema(
  {
    poNumber: { type: String, required: true, unique: true, trim: true },
    steps: [matchAuditStepSchema]
  },
  { timestamps: true }
);

const MatchAudit = mongoose.model('MatchAudit', matchAuditSchema);
export default MatchAudit;
