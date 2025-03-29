import { Router } from 'express';
import { createReview, getReviewsForUser } from '../controllers/reviewController';

const router = Router();

router.post('/', createReview);
router.get('/:id', getReviewsForUser);

export default router;
