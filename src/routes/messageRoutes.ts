import { Router } from 'express';
import { sendMessage, getConversation } from '../controllers/messageController';

const router = Router();

router.post('/', sendMessage);
router.get('/', getConversation);

export default router;
