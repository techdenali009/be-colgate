import { Router } from 'express';
import userRoutes from './userRoutes';
import authRoutes from './authRoutes'
import { auth } from '../middlewares/authMiddleware';
import categoryRoutes from './categoryRoutes';
import productRoutes from './productRoutes';

const router = Router();

// Define user Routes
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes); 
router.use('/', authRoutes);

export default router;