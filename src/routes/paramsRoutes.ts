import { Router } from 'express';
import { catchAsync } from '../utils/catchAsync.js';
import { getAllParams, getClimbingLevels, getClimbingStyles, getEquipment, getLanguages } from '../controllers/paramsController.js';

const router = Router();

router.get('/', catchAsync(getAllParams));
router.get('/climbinglevels/', catchAsync(getClimbingLevels));
router.get('/climbingstyles/', catchAsync(getClimbingStyles));
router.get('/languages/', catchAsync(getLanguages));
router.get('/equipment/', catchAsync(getEquipment));

export default router;
