import express from 'express';
import { authenticate } from '../../middlewares/authMiddleware.js';
import skuMasterRouter from './skuMaster.js';
import userRouter from './users.js'

const router = express.Router();

router.use('/users', userRouter);
router.use('/masters/sku', authenticate, skuMasterRouter);

export default router;