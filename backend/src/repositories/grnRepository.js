import mongoose from 'mongoose';

import Grn from '../schemas/grn.js';
import crudRepository from './crudRepository.js';

const grnRepository = {
  ...crudRepository(Grn),
  getById: (id) =>
    mongoose.isValidObjectId(id) ? Grn.findById(id).populate('items.skuMaster') : Promise.resolve(null),
  countByPoAndGrnNumber: (poNumber, grnNumber) => Grn.countDocuments({ poNumber, grnNumber }),
  getAllByPoNumber: (poNumber) =>
    Grn.find({ poNumber }).sort({ createdAt: 1 }).populate('items.skuMaster')
};

export default grnRepository;
