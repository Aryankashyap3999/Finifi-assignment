import { StatusCodes } from 'http-status-codes';

export default class ValidationError extends Error {
  constructor(data, message) {
    super(message);
    this.name = 'ValidationError';
    this.explanation = data.error;
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}
