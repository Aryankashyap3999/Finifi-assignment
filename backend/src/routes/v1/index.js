import express from 'express';
import { authenticate } from '../../middlewares/authMiddleware.js';
import documentRouter from './documents.js';
import skuMasterRouter from './skuMaster.js';
import userRouter from './users.js'

const router = express.Router();

router.use('/users', userRouter);
router.use('/masters/sku', authenticate, skuMasterRouter);
router.use('/documents', authenticate, documentRouter);

export default router;