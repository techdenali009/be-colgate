import { Router } from 'express';
import { addProductToFavorite, createUser, deleteUser, deleteUserAddress, getMyFavoriteProducts, getUserById, getUsers, updateUser, updateUserAddress, verifyEmail } from '../controllers/userController';
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
router.get('/favorite/:userId', auth as any, getMyFavoriteProducts);
router.put('/updateAddress/:userId', auth as any, updateUserAddress)
router.put('/deleteAddress/:userId', auth as any, deleteUserAddress)


export default router;