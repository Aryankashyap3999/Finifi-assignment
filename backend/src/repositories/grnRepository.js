import Grn from '../schemas/grn.js';
import crudRepository from './crudRepository.js';

const grnRepository = {
  ...crudRepository(Grn),
  countByPoAndGrnNumber: (poNumber, grnNumber) => Grn.countDocuments({ poNumber, grnNumber }),
  getAllByPoNumber: (poNumber) =>
    Grn.find({ poNumber }).sort({ createdAt: 1 }).populate('items.skuMaster')
};

export default grnRepository;
