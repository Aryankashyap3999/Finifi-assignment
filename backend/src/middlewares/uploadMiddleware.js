import fs from 'fs';
import path from 'path';

import { StatusCodes } from 'http-status-codes';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

import { customErrorResponse } from '../utils/commons/responseObject.js';
import ClientError from '../utils/errors/clientError.js';

const UPLOAD_DIR = path.resolve('uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED_MIME_TYPES = ['application/pdf', 'image/png', 'image/jpeg'];

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => cb(null, `${uuidv4()}${path.extname(file.originalname)}`)
  }),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(new Error('Only PDF, PNG, and JPEG files are supported'));
    }
    cb(null, true);
  }
}).single('file');

export const uploadDocumentFile = (req, res, next) => {
  upload(req, res, (error) => {
    if (error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          customErrorResponse(
            new ClientError({
              explanation: error.message,
              message: 'File upload failed',
              statusCode: StatusCodes.BAD_REQUEST
            })
          )
        );
    }
    if (!req.file) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          customErrorResponse(
            new ClientError({
              explanation: 'No file was attached to the request',
              message: 'File is required',
              statusCode: StatusCodes.BAD_REQUEST
            })
          )
        );
    }
    next();
  });
};
