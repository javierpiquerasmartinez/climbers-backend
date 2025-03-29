import { Router } from 'express';
import { createUser, updateUser, getUsersWithFilters, getUserConversations, getUserProfile, getCurrentUser } from '../controllers/userController';
import { verifyGoogleToken } from '../middlewares/verifyGoogleToken';

const router = Router();

router.post('/', verifyGoogleToken, createUser);
router.patch('/:id', verifyGoogleToken, updateUser);
router.get('/', verifyGoogleToken, getUsersWithFilters);
router.get('/:id/conversations', verifyGoogleToken, getUserConversations);
router.get('/:id', verifyGoogleToken, getUserProfile);
router.get('/me', verifyGoogleToken, getCurrentUser);


export default router;
