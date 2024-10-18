import { Router } from 'express';
import { createUser, deleteUser, getUsers, updateUser } from '../controllers/userController';
import { auth } from '../middlewares/authMiddleware';

const router = Router();

// Define routes
router.get('/', getUsers);
router.post('/create', createUser);
router.delete('/:id', deleteUser)
router.put('/:id', updateUser);

export default router;