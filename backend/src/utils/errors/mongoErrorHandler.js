import ValidationError from './validationError.js';

// Newer Mongoose versions wrap the raw MongoServerError in a MongooseError,
// with the original (code: 11000, etc.) moved to `.cause` instead of staying
// on the top-level error — check both shapes so this survives either version.
const isDuplicateKeyError = (error) => error.code === 11000 || error.cause?.code === 11000;

export const rethrowAsValidationError = (error, duplicateMessage) => {
  if (error.name === 'ValidationError') {
    throw new ValidationError({ error: error.errors }, error.message);
  }
  if (isDuplicateKeyError(error)) {
    throw new ValidationError({ error: [duplicateMessage] }, duplicateMessage);
  }
  throw error;
};
