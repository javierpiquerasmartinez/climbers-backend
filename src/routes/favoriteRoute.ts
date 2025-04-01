import { Router } from 'express';
import { verifyGoogleToken } from '../middlewares/verifyGoogleToken.js';
import { addFavorite, getFavorites, removeFavorite } from '../controllers/favoriteController.js';

const router = Router();

router.get('/', verifyGoogleToken, getFavorites);
router.post('/:favoriteId', verifyGoogleToken, addFavorite);
router.delete('/:favoriteId', removeFavorite);

export default router;
