import { Router } from 'express';
import { createUser, updateUser, getUsersWithFilters, getUserConversations, getUserProfile, getCurrentUser, deleteUser, updateAvatar } from '../controllers/userController.js';
import { verifyGoogleToken } from '../middlewares/verifyGoogleToken.js';
import { upload } from '../middlewares/upload.js';
import { validateBody, validateParams, validateQuery } from '../middlewares/validate.js';
import { createUserSchema, updateUserSchema, userConversationsRequestSchema, userFiltersSchema, userProfileRequestSchema, deleteUserSchema, updateAvatarSchema } from '../validators/userSchema.js';
import { catchAsync } from '../utils/catchAsync.js';

const router = Router();

router.post('/', verifyGoogleToken, validateBody(createUserSchema), createUser);
router.patch('/:id', verifyGoogleToken, validateBody(updateUserSchema), updateUser);
router.get('/', verifyGoogleToken, validateQuery(userFiltersSchema), catchAsync(getUsersWithFilters));
router.get('/:id/conversations', verifyGoogleToken, validateParams(userConversationsRequestSchema), getUserConversations);
router.get('/me', verifyGoogleToken, getCurrentUser);
router.get('/:id', verifyGoogleToken, validateParams(userProfileRequestSchema), getUserProfile);
router.delete('/:id', verifyGoogleToken, validateParams(deleteUserSchema), deleteUser);
router.post('/:id/avatar', verifyGoogleToken, validateParams(updateAvatarSchema), upload.single('avatar'), updateAvatar);

export default router;
