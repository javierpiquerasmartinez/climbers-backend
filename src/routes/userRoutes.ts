import { Router } from 'express';
import { getAllUsers, createUser, updateUser, getUsersWithFilters } from '../controllers/userController.js';

const router = Router();

router.post('/', createUser);
router.patch('/:id', updateUser);
router.get('/', getUsersWithFilters);

export default router;
