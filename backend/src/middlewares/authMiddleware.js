import { StatusCodes } from 'http-status-codes';

import { verifyJWT } from '../utils/commons/authUtil.js';
import { customErrorResponse } from '../utils/commons/responseObject.js';
import ClientError from '../utils/errors/clientError.js';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(
        customErrorResponse(
          new ClientError({
            explanation: 'Missing or malformed Authorization header',
            message: 'Authentication required',
            statusCode: StatusCodes.UNAUTHORIZED
          })
        )
      );
  }

  try {
    req.user = verifyJWT(token);
    next();
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(
        customErrorResponse(
          new ClientError({
            explanation: 'Invalid or expired token',
            message: 'Authentication required',
            statusCode: StatusCodes.UNAUTHORIZED
          })
        )
      );
  }
};
