import { Router } from 'express';
import { createUser, deleteUser, getUserById, getUsers, updateUser, verifyEmail } from '../controllers/userController';
import { auth } from '../middlewares/authMiddleware';

const router = Router();

// Define routes
router.get('/', auth as any, getUsers);
router.post('/create', createUser);
router.delete('/:id', auth as any, deleteUser)
router.put('/:id', auth as any, updateUser);
router.get('/email/verifyToken', verifyEmail);
router.get('/:id', auth as any, getUserById);


export default router;