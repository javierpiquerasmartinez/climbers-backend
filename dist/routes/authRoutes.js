import { Router } from 'express';
import { loginWithGoogle } from '../controllers/authController.js';
const router = Router();
router.post('/google', loginWithGoogle);
export default router;
