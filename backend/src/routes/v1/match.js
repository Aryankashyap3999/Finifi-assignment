import express from 'express';

import { getMatchResult } from '../../controllers/matchController.js';

const router = express.Router();

router.get('/:poNumber', getMatchResult);

export default router;
