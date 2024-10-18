import { Router } from 'express';
import userRoutes from './userRoutes';
import authRoutes from './authRoutes'
import { auth } from '../middlewares/authMiddleware';

const router = Router();

// Define user Routes
router.use('/users' , auth as any, userRoutes);
router.use('/', authRoutes);

export default router;