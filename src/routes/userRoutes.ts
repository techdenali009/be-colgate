import { Router } from 'express';
import { addProductToFavorite, createUser, deleteUser, getMyFavoriteProducts, getUserById, getUsers, updateUser, verifyEmail } from '../controllers/userController';
import { auth } from '../middlewares/authMiddleware';
import { getMyFavoritesService } from '../services/userService';

const router = Router();

// Define routes
router.get('/', auth as any, getUsers);
router.post('/create', createUser);
router.delete('/:id', auth as any, deleteUser)
router.put('/:id', auth as any, updateUser);
router.get('/email/verifyToken', verifyEmail);
router.get('/:id', auth as any, getUserById);
router.post('/addProductToFavorite', auth as any, addProductToFavorite)
router.get('/favorite/:userId', auth as any, getMyFavoriteProducts)


export default router;