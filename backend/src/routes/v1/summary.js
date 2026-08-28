import express from 'express';

import { getSummary } from '../../controllers/matchController.js';

const router = express.Router();

router.get('/:poNumber', getSummary);

export default router;
