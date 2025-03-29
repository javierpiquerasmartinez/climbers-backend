import { Router } from 'express';
import { sendMessage, getConversation } from '../controllers/messageController';
import { verifyGoogleToken } from '../middlewares/verifyGoogleToken';

const router = Router();

router.post('/', verifyGoogleToken, sendMessage);
router.get('/', , verifyGoogleToken, getConversation);

export default router;
