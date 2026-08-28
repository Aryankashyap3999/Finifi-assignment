import { StatusCodes } from 'http-status-codes';

import { computeMatchResult } from '../services/matchEngine.js';
import { getSummaryService } from '../services/summaryService.js';
import {
  customErrorResponse,
  internalErrorResponse,
  successResponse
} from '../utils/commons/responseObject.js';

export const getMatchResult = async (req, res) => {
  try {
    const result = await computeMatchResult(req.params.poNumber);
    return res
      .status(StatusCodes.OK)
      .json(successResponse(result, 'Match result computed successfully'));
  } catch (error) {
    console.log('Match controller error', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const getSummary = async (req, res) => {
  try {
    const result = await getSummaryService(req.params.poNumber);
    return res
      .status(StatusCodes.OK)
      .json(successResponse(result, 'Summary computed successfully'));
  } catch (error) {
    console.log('Match controller error', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};
