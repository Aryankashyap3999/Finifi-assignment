import MatchAudit from '../schemas/matchAudit.js';

const matchAuditRepository = {
  appendStep: (poNumber, step) =>
    MatchAudit.findOneAndUpdate(
      { poNumber },
      { $push: { steps: step } },
      { upsert: true, returnDocument: 'after' }
    ),
  getByPoNumber: (poNumber) => MatchAudit.findOne({ poNumber })
};

export default matchAuditRepository;
