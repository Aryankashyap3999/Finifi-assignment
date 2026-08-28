import express from 'express';

import {
  createSkuMaster,
  deleteSkuMaster,
  getAllSkuMasters,
  getSkuMasterById,
  updateSkuMaster
} from '../../controllers/skuMasterController.js';
import {
  createSkuMasterSchema,
  updateSkuMasterSchema
} from '../../validators/skuMasterSchema.js';
import { validate } from '../../validators/zodValidator.js';

const router = express.Router();

router.post('/', validate(createSkuMasterSchema), createSkuMaster);
router.get('/', getAllSkuMasters);
router.get('/:id', getSkuMasterById);
router.patch('/:id', validate(updateSkuMasterSchema), updateSkuMaster);
router.delete('/:id', deleteSkuMaster);

export default router;
