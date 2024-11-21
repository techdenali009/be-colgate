import express from 'express';
import { addSubcategories, editSubcategory, getAllSubcategory, removeSubcategory } from '../controllers/subCategoryController';

const router = express.Router();


router.get('/', getAllSubcategory)
// Add multiple subcategories to a category
router.post('/:categoryId/subcategories', addSubcategories);
// Update a subcategory
router.put('/subcategories/:subcategoryId', editSubcategory);
// Delete a subcategory from a category
router.delete('/:categoryId/subcategories/:subcategoryId', removeSubcategory);

export default router;
