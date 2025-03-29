import { Router } from 'express';
import { createUser, updateUser, getUsersWithFilters, getUserConversations } from '../controllers/userController';

const router = Router();

router.post('/', createUser);
router.patch('/:id', updateUser);
router.get('/', getUsersWithFilters);
router.get('/:id/conversations', getUserConversations);

export default router;
