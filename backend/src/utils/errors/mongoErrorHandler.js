import ValidationError from './validationError.js';

export const rethrowAsValidationError = (error, duplicateMessage) => {
  if (error.name === 'ValidationError') {
    throw new ValidationError({ error: error.errors }, error.message);
  }
  if (error.name === 'MongoServerError' && error.code === 11000) {
    throw new ValidationError({ error: [duplicateMessage] }, duplicateMessage);
  }
  throw error;
};
