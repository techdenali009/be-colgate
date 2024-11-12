import express, { Request, Response } from 'express';
import { addSubcategories, editSubcategory, removeSubcategory } from '../controllers/subCategoryController';

const router = express.Router();

// Route to add multiple subcategories to a category
router.post('/:categoryId/subcategories', async (req: Request, res: Response) => {
    try {
        await addSubcategories(req, res);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add subcategories' });
    }
});

// Route to update a subcategory
router.put('/subcategories/:subcategoryId', async (req: Request, res: Response) => {
    try {
        await editSubcategory(req, res);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update subcategory' });
    }
});

// Route to delete a subcategory from a category
router.delete('/:categoryId/subcategories/:subcategoryId', async (req: Request, res: Response) => {
    try {
        await removeSubcategory(req, res);
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete subcategory' });
    }
});

export default router;
