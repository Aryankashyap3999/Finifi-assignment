import { StatusCodes } from 'http-status-codes';

import {
  createSkuMasterService,
  deleteSkuMasterService,
  getAllSkuMastersService,
  getSkuMasterByIdService,
  updateSkuMasterService
} from '../services/skuMasterService.js';
import {
  customErrorResponse,
  internalErrorResponse,
  successResponse
} from '../utils/commons/responseObject.js';

export const createSkuMaster = async (req, res) => {
  try {
    const sku = await createSkuMasterService(req.body);
    return res
      .status(StatusCodes.CREATED)
      .json(successResponse(sku, 'SKU master created successfully'));
  } catch (error) {
    console.log('SkuMaster controller error', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const getAllSkuMasters = async (req, res) => {
  try {
    const skus = await getAllSkuMastersService();
    return res
      .status(StatusCodes.OK)
      .json(successResponse(skus, 'SKU masters fetched successfully'));
  } catch (error) {
    console.log('SkuMaster controller error', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const getSkuMasterById = async (req, res) => {
  try {
    const sku = await getSkuMasterByIdService(req.params.id);
    return res
      .status(StatusCodes.OK)
      .json(successResponse(sku, 'SKU master fetched successfully'));
  } catch (error) {
    console.log('SkuMaster controller error', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const updateSkuMaster = async (req, res) => {
  try {
    const sku = await updateSkuMasterService(req.params.id, req.body);
    return res
      .status(StatusCodes.OK)
      .json(successResponse(sku, 'SKU master updated successfully'));
  } catch (error) {
    console.log('SkuMaster controller error', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const deleteSkuMaster = async (req, res) => {
  try {
    await deleteSkuMasterService(req.params.id);
    return res
      .status(StatusCodes.OK)
      .json(successResponse({}, 'SKU master deleted successfully'));
  } catch (error) {
    console.log('SkuMaster controller error', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};
