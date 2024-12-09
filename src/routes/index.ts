import { Router } from 'express';
import userRoutes from './userRoutes';
import authRoutes from './authRoutes'
import categoryRoutes from './categoryRoutes';
import productRoutes from './productRoutes';
import WarehouseRoutes from './warehouseRoutes';
import { auth } from '../middlewares/authMiddleware';
import subCategoryRoutes  from './subCategoryRoutes'
import orderRoutes from './orderRoutes';
import { fileUpload } from '../services/fileUploadService';
import { upload } from '../fileUpload/fileUpload';

const router = Router();

// Define user Routes
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes); 
router.use('/warehouse',WarehouseRoutes);
router.use('/subcategories', subCategoryRoutes);
router.use('/order', orderRoutes);
router.use('/', authRoutes);
router.post('/fileUpload', upload.single('file'), fileUpload)

export default router; 