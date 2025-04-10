import { Router } from 'express';
import { verifyGoogleToken } from '../middlewares/verifyGoogleToken.js';
import { addFavorite, getFavorites, removeFavorite } from '../controllers/favoriteController.js';
import { validateParams } from '../middlewares/validate.js';
import { favoriteSchema } from '../validators/favoriteSchema.js';
import { catchAsync } from '../utils/catchAsync.js';

const router = Router();

router.get('/', verifyGoogleToken, catchAsync(getFavorites));
router.post('/:favoriteId', validateParams(favoriteSchema), verifyGoogleToken, addFavorite);
router.delete('/:favoriteId', validateParams(favoriteSchema), removeFavorite);

export default router;
