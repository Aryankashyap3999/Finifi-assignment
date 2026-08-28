import Grn from '../schemas/grn.js';
import crudRepository from './crudRepository.js';

const grnRepository = {
  ...crudRepository(Grn),
  countByPoAndGrnNumber: (poNumber, grnNumber) => Grn.countDocuments({ poNumber, grnNumber })
};

export default grnRepository;
