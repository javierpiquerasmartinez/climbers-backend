import { Router } from 'express';
import { createReview, getReviewsForUser, getAverageRatingForUser } from '../controllers/reviewController.js';
import { verifyGoogleToken } from '../middlewares/verifyGoogleToken.js';
import { validateBody, validateParams } from '../middlewares/validate.js';
import { createReviewSchema, getUserReviewsSchema } from '../validators/reviewSchema.js';

const router = Router();

router.post('/', verifyGoogleToken, validateBody(createReviewSchema), createReview);
router.get('/:id', verifyGoogleToken, validateParams(getUserReviewsSchema), getReviewsForUser);
router.get('/:id/average', verifyGoogleToken, validateParams(getUserReviewsSchema), getAverageRatingForUser);

export default router;
