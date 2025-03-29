import { Router } from 'express';
import { getAllUsers, createUser, updateUser } from '../controllers/userController.js';

const router = Router();

router.get('/', getAllUsers);
router.post('/', createUser);
router.patch('/:id', updateUser);

export default router;
