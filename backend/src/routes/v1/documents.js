import express from 'express';

import {
  getDocumentById,
  getDocumentFile,
  listDocuments,
  uploadDocument
} from '../../controllers/documentController.js';
import { uploadDocumentFile } from '../../middlewares/uploadMiddleware.js';
import { documentUploadSchema } from '../../validators/documentUploadSchema.js';
import { validate } from '../../validators/zodValidator.js';

const router = express.Router();

router.post('/upload', uploadDocumentFile, validate(documentUploadSchema), uploadDocument);
router.get('/:id/file', getDocumentFile);
router.get('/:id', getDocumentById);
router.get('/', listDocuments);

export default router;
