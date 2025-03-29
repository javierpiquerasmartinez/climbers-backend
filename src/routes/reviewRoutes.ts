import { Router } from 'express';
import { createReview, getReviewsForUser, getAverageRatingForUser } from '../controllers/reviewController';

const router = Router();

router.post('/', createReview);
router.get('/:id', getReviewsForUser);
router.get('/:id/average', getAverageRatingForUser);

export default router;
