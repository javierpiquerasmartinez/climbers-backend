import { Router } from 'express';
import { createUser, updateUser, getUsersWithFilters } from '../controllers/userController';

const router = Router();

router.post('/', createUser);
router.patch('/:id', updateUser);
router.get('/', getUsersWithFilters);

export default router;
