import { Router } from 'express';
import { createUser, updateUser, getUsersWithFilters, getUserConversations, getUserProfile, getCurrentUser, deleteUser, updateAvatar } from '../controllers/userController.js';
import { verifyGoogleToken } from '../middlewares/verifyGoogleToken.js';
import { upload } from '../middlewares/upload.js';
import { validate, validateParams } from '../middlewares/validate.js';
import { createUserSchema, updateUserSchema, userConversationsSchema, userFiltersSchema } from '../validators/userSchema.js';

const router = Router();

router.post('/', verifyGoogleToken, validate(createUserSchema), createUser);
router.patch('/:id', verifyGoogleToken, validate(updateUserSchema), updateUser);
router.get('/', verifyGoogleToken, validate(userFiltersSchema), getUsersWithFilters);
router.get('/:id/conversations', verifyGoogleToken, validateParams(userConversationsSchema), getUserConversations);
router.get('/me', verifyGoogleToken, getCurrentUser);
router.get('/:id', verifyGoogleToken, getUserProfile);
router.delete('/:id', verifyGoogleToken, deleteUser);
router.post('/:id/avatar', verifyGoogleToken, upload.single('avatar'), updateAvatar);

export default router;
