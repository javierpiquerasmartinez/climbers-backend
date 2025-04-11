import { Router } from 'express';
import { catchAsync } from '../utils/catchAsync.js';
import { getClimbingLevels } from '../controllers/paramsController.js';

const router = Router();

router.get('/climbinglevels/', catchAsync(getClimbingLevels));

export default router;
