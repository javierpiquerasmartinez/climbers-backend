import { Router } from 'express';
import { sendMessage, getConversation } from '../controllers/messageController.js';
import { verifyGoogleToken } from '../middlewares/verifyGoogleToken.js';
const router = Router();
router.post('/', verifyGoogleToken, sendMessage);
router.get('/', verifyGoogleToken, getConversation);
export default router;
