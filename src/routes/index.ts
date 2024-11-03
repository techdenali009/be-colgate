import { Router } from 'express';
import userRoutes from './userRoutes';
import authRoutes from './authRoutes'
import { auth } from '../middlewares/authMiddleware';
import categoryRoutes from './categoryRoutes';
import productRoutes from './productRoutes';
import warehouseRoutes from './warehouseRoutes';

const router = Router();

// Define user Routes
router.use('/users', userRoutes);
router.use('/categorys', categoryRoutes);
router.use('/productsdata', productRoutes);
router.use('/warehouse', warehouseRoutes);

router.use('/', authRoutes);

export default router;