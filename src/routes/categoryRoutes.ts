import { Router } from 'express';
import {
  createCategories,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getCategoryById,
  getProductsByCategory,
  addSubcategory,
  updateSubcategoryController,
  deleteSubcategoryController,
} from '../controllers/categoryController';
import { validateCategory } from '../middlewares/CategoryValidation';

const router = Router();

// Category routes
router.post('/', validateCategory, createCategories); // Create category
router.get('/', getAllCategories); // Get all categories
router.get('/:id', getCategoryById); // Get a category by ID
router.get('/products/:id', getProductsByCategory); // Get products by category ID
router.put('/:id', updateCategory); // Update category
router.delete('/:id', deleteCategory); // Delete category

// Subcategory routes (nested under category)
router.post('/:categoryId/subcategories', addSubcategory);
router.put('/:categoryId/subcategories/:subcategoryId', updateSubcategoryController); 
router.delete('/:categoryId/subcategories/:subcategoryId', deleteSubcategoryController);

export default router;
