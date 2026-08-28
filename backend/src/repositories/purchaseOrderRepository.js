import PurchaseOrder from '../schemas/purchaseOrder.js';
import crudRepository from './crudRepository.js';

const purchaseOrderRepository = {
  ...crudRepository(PurchaseOrder),
  countByPoNumber: (poNumber) => PurchaseOrder.countDocuments({ poNumber })
};

export default purchaseOrderRepository;
