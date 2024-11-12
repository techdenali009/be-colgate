import { Router } from 'express';
import {
  createCategories,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getCategoryById,
  getProductsByCategory,
} from '../controllers/categoryController';
import { validateCategory } from '../middlewares/CategoryValidation';
import subcategoryRouter from './subCategoryRoutes';

const router = Router();

// Category routes
router.post('/', validateCategory, createCategories); // Create category
router.get('/', getAllCategories); // Get all categories
router.get('/:id', getCategoryById); // Get a category by ID
router.get('/products/:id', getProductsByCategory); // Get products by category ID
router.put('/:id', updateCategory); // Update category
router.delete('/:id', deleteCategory); // Delete category

// Subcategory routes
router.use('/', subcategoryRouter);
export default router;
