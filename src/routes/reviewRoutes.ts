import { Router } from 'express';
import { createReview, getReviewsForUser, getAverageRatingForUser } from '../controllers/reviewController';
import { verifyGoogleToken } from '../middlewares/verifyGoogleToken';

const router = Router();

router.post('/', verifyGoogleToken, createReview);
router.get('/:id', verifyGoogleToken, getReviewsForUser);
router.get('/:id/average', verifyGoogleToken, getAverageRatingForUser);

export default router;
