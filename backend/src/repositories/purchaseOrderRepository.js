import PurchaseOrder from '../schemas/purchaseOrder.js';
import crudRepository from './crudRepository.js';

const purchaseOrderRepository = {
  ...crudRepository(PurchaseOrder),
  countByPoNumber: (poNumber) => PurchaseOrder.countDocuments({ poNumber }),
  getAllByPoNumber: (poNumber) =>
    PurchaseOrder.find({ poNumber }).sort({ createdAt: 1 }).populate('items.skuMaster')
};

export default purchaseOrderRepository;
