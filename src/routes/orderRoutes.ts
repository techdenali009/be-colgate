import { Router } from 'express';
import { createOrder, deleteOrderById, getAllOrders, getOrderById, getOrdersByUserId, updateOrderById } from '../controllers/orderController';
import { validateOrder } from '../middlewares/orderValidations';
import { auth } from '../middlewares/authMiddleware';


const router = Router();

// Category routes
router.post('/Create', auth as any, validateOrder, createOrder); // Create category
router.get('/all', auth as any, getAllOrders)
router.get('/:userId', auth as any, getOrdersByUserId); // Get a category by ID
router.put('/update/:orderId', auth as any, updateOrderById)
router.get('/getOrderById/:orderId', auth as any, getOrderById); 
router.delete('/:orderId',auth as any, deleteOrderById)

export default router;