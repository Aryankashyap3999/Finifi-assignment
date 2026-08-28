import { z } from 'zod';

import { DOCUMENT_TYPES } from '../constants/documentTypes.js';

export const documentUploadSchema = z.object({
  documentType: z.enum(DOCUMENT_TYPES)
});
