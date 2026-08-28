import Invoice from '../schemas/invoice.js';
import crudRepository from './crudRepository.js';

const invoiceRepository = {
  ...crudRepository(Invoice),
  countByPoAndInvoiceNumber: (poNumber, invoiceNumber) =>
    Invoice.countDocuments({ poNumber, invoiceNumber }),
  getAllByPoNumber: (poNumber) =>
    Invoice.find({ poNumber }).sort({ createdAt: 1 }).populate('items.skuMaster')
};

export default invoiceRepository;
