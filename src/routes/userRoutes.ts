import { Router } from 'express';
import { createUser, updateUser, getUsersWithFilters, getUserConversations, getUserProfile, getCurrentUser, deleteUser, updateAvatar } from '../controllers/userController.js';
import { verifyGoogleToken } from '../middlewares/verifyGoogleToken.js';
import { upload } from '../middlewares/upload.js';
import { validate } from '../middlewares/validate.js';
import { createUserSchema } from '../validators/userSchema.js';

const router = Router();

router.post('/', verifyGoogleToken, validate(createUserSchema), createUser);
router.patch('/:id', verifyGoogleToken, updateUser);
router.get('/', verifyGoogleToken, getUsersWithFilters);
router.get('/:id/conversations', verifyGoogleToken, getUserConversations);
router.get('/me', verifyGoogleToken, getCurrentUser);
router.get('/:id', verifyGoogleToken, getUserProfile);
router.delete('/:id', verifyGoogleToken, deleteUser);
router.post('/:id/avatar', verifyGoogleToken, upload.single('avatar'), updateAvatar);

export default router;
