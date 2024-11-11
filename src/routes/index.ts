import { Router } from 'express';
import userRoutes from './userRoutes';
import authRoutes from './authRoutes'
import categoryRoutes from './categoryRoutes';
import productRoutes from './productRoutes';
import WarehouseRoutes from './warehouseRoutes';
import { auth } from '../middlewares/authMiddleware';

const router = Router();

// Define user Routes
router.use('/users', auth as any, userRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes); 
router.use('/warehouse',WarehouseRoutes)
router.use('/', authRoutes);

export default router; 