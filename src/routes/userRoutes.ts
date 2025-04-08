import { Router } from 'express';
import { createUser, updateUser, getUsersWithFilters, getUserConversations, getUserProfile, getCurrentUser, deleteUser, updateAvatar } from '../controllers/userController.js';
import { verifyGoogleToken } from '../middlewares/verifyGoogleToken.js';
import { upload } from '../middlewares/upload.js';
import { validateBody, validateParams } from '../middlewares/validate.js';
import { createUserSchema, updateUserSchema, userConversationsRequestSchema, userFiltersSchema, userProfileRequestSchema } from '../validators/userSchema.js';

const router = Router();

router.post('/', verifyGoogleToken, validateBody(createUserSchema), createUser);
router.patch('/:id', verifyGoogleToken, validateBody(updateUserSchema), updateUser);
router.get('/', verifyGoogleToken, validateBody(userFiltersSchema), getUsersWithFilters);
router.get('/:id/conversations', verifyGoogleToken, validateParams(userConversationsRequestSchema), getUserConversations);
router.get('/me', verifyGoogleToken, getCurrentUser);
router.get('/:id', verifyGoogleToken, validateParams(userProfileRequestSchema), getUserProfile);
router.delete('/:id', verifyGoogleToken, deleteUser);
router.post('/:id/avatar', verifyGoogleToken, upload.single('avatar'), updateAvatar);

export default router;
