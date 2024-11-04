import { Router } from 'express';
import {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getCategoryById,
  getProductsByCategory,
} from '../controllers/categoryController';
import  { validateCategory } from '../middlewares/CategoryValidation';


const router = Router();

// Category routes
router.post('/', validateCategory, createCategory);
router.get('/', getAllCategories); // Get all categories
router.get('/:id', getCategoryById); // Get a category by ID
router.get('/products/:id', getProductsByCategory); // Get products by category ID
router.put('/:id', updateCategory); // Update a category
router.delete('/:id', deleteCategory); // Delete a category

export default router;
