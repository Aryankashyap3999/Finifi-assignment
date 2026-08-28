import { StatusCodes } from 'http-status-codes';

export default class ClientError extends Error {
  constructor({ explanation, message, statusCode = StatusCodes.BAD_REQUEST }) {
    super(message);
    this.name = 'ClientError';
    this.explanation = explanation;
    this.statusCode = statusCode;
  }
}
