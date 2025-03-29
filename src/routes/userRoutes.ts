import { Router } from 'express';
import { createUser, updateUser, getUsersWithFilters, getUserConversations, getUserProfile } from '../controllers/userController';

const router = Router();

router.post('/', createUser);
router.patch('/:id', updateUser);
router.get('/', getUsersWithFilters);
router.get('/:id/conversations', getUserConversations);
router.get('/:id', getUserProfile);

export default router;
