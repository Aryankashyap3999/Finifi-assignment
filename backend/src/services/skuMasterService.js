import { StatusCodes } from 'http-status-codes';

import skuMasterRepository from '../repositories/skuMasterRepository.js';
import ClientError from '../utils/errors/clientError.js';
import { rethrowAsValidationError } from '../utils/errors/mongoErrorHandler.js';

const notFoundError = () =>
  new ClientError({
    explanation: 'Invalid data sent from the client',
    message: 'SKU master not found',
    statusCode: StatusCodes.NOT_FOUND
  });

export const createSkuMasterService = async (data) => {
  try {
    return await skuMasterRepository.create(data);
  } catch (error) {
    console.log('SkuMaster service error', error);
    rethrowAsValidationError(error, 'A SKU master with the same ERP code already exists');
  }
};

export const getAllSkuMastersService = async () => {
  return skuMasterRepository.getAll();
};

export const getSkuMasterByIdService = async (id) => {
  const sku = await skuMasterRepository.getById(id);
  if (!sku) {
    throw notFoundError();
  }
  return sku;
};

export const updateSkuMasterService = async (id, data) => {
  try {
    const updated = await skuMasterRepository.update(id, data);
    if (!updated) {
      throw notFoundError();
    }
    return updated;
  } catch (error) {
    console.log('SkuMaster service error', error);
    rethrowAsValidationError(error, 'A SKU master with the same ERP code already exists');
  }
};

export const deleteSkuMasterService = async (id) => {
  const deleted = await skuMasterRepository.delete(id);
  if (!deleted) {
    throw notFoundError();
  }
  return deleted;
};
