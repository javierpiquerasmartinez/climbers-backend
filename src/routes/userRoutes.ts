import { Router } from 'express';
import { createUser, updateUser, getUsersWithFilters, getUserConversations, getUserProfile, getCurrentUser, deleteUser } from '../controllers/userController';
import { verifyGoogleToken } from '../middlewares/verifyGoogleToken';

const router = Router();

router.post('/', verifyGoogleToken, createUser);
router.patch('/:id', verifyGoogleToken, updateUser);
router.get('/', verifyGoogleToken, getUsersWithFilters);
router.get('/:id/conversations', verifyGoogleToken, getUserConversations);
router.get('/me', verifyGoogleToken, getCurrentUser);
router.get('/:id', verifyGoogleToken, getUserProfile);
router.delete('/:id', verifyGoogleToken, deleteUser);


export default router;
