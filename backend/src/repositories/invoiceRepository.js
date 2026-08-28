import Invoice from '../schemas/invoice.js';
import crudRepository from './crudRepository.js';

const invoiceRepository = {
  ...crudRepository(Invoice),
  countByPoAndInvoiceNumber: (poNumber, invoiceNumber) =>
    Invoice.countDocuments({ poNumber, invoiceNumber })
};

export default invoiceRepository;
