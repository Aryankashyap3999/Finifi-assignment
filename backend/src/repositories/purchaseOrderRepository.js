import mongoose from 'mongoose';

import PurchaseOrder from '../schemas/purchaseOrder.js';
import crudRepository from './crudRepository.js';

const purchaseOrderRepository = {
  ...crudRepository(PurchaseOrder),
  // Overrides crudRepository's getById so the resolved SKU info is available
  // to any single-document read (e.g. the per-document item grid), matching
  // what getAllByPoNumber already does for the match engine.
  getById: (id) =>
    mongoose.isValidObjectId(id)
      ? PurchaseOrder.findById(id).populate('items.skuMaster')
      : Promise.resolve(null),
  countByPoNumber: (poNumber) => PurchaseOrder.countDocuments({ poNumber }),
  getAllByPoNumber: (poNumber) =>
    PurchaseOrder.find({ poNumber }).sort({ createdAt: 1 }).populate('items.skuMaster')
};

export default purchaseOrderRepository;
