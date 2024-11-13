import express from 'express';
import { addSubcategories, editSubcategory, fetchSubcategoriesByCategory, removeSubcategory } from '../controllers/subCategoryController';

const router = express.Router();

// Add multiple subcategories to a category
router.post('/:categoryId/subcategories', addSubcategories);
// Update a subcategory
router.put('/subcategories/:subcategoryId', editSubcategory);
// Delete a subcategory from a category
router.delete('/:categoryId/subcategories/:subcategoryId', removeSubcategory);
// Route to get subcategories by category ID
router.get('/:categoryId/subcategories', fetchSubcategoriesByCategory);

export default router;
