import { Router } from 'express';
import { createOrder, getAllorders, getOrdersById } from '../controllers/orderController';
import { validateOrder } from '../middlewares/orderValidations';


const router = Router();

// Category routes
router.post('/Create', validateOrder, createOrder); // Create category
// router.get('/', getAllCategories); // Get all categories
router.get('/:id', getOrdersById); // Get a category by ID
router.get('/all', getAllorders)
// router.put('/:id', updateCategory); // Update category
// router.delete('/:id', deleteCategory); // Delete category

export default router;