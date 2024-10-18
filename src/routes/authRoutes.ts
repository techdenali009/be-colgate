import { Router } from 'express';
import { loginUser } from '../controllers/authController';

const router = Router();

// Define routes
router.post('/login', loginUser);

export default router;