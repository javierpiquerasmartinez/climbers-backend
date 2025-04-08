import { Router } from 'express';
import { sendMessage, getConversation } from '../controllers/messageController.js';
import { verifyGoogleToken } from '../middlewares/verifyGoogleToken.js';
import { validateBody, validateQuery } from '../middlewares/validate.js';
import { getMessagesSchema, sendMessageSchema } from '../validators/messageSchema.js';

const router = Router();

router.post('/', verifyGoogleToken, validateBody(sendMessageSchema), sendMessage);
router.get('/', verifyGoogleToken, validateQuery(getMessagesSchema), getConversation);

export default router;
