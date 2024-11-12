import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { addSubcategoriesToCategory, updateSubcategory, deleteSubcategory } from '../services/subCategoryService';

// Add multiple subcategories to a category
export const addSubcategories = async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    const subcategories = req.body.subcategories;

    try {
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({ error: 'Invalid Category ID' });
        }

        const updatedCategory = await addSubcategoriesToCategory(categoryId, subcategories);
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add subcategories' });
    }
};

export const editSubcategory = async (req: Request, res: Response) => {
    const { subcategoryId } = req.params;
    const updatedData = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(subcategoryId)) {
            return res.status(400).json({ error: 'Invalid Subcategory ID' });
        }

        const updatedSubcategory = await updateSubcategory(subcategoryId, updatedData);
        res.status(200).json(updatedSubcategory);
    } catch (error) {
        // Narrow the type of error to `Error`
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            // Fallback in case the error is not an instance of Error
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
};


// Delete a subcategory from a category
export const removeSubcategory = async (req: Request, res: Response) => {
    const { categoryId, subcategoryId } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(categoryId) || !mongoose.Types.ObjectId.isValid(subcategoryId)) {
            return res.status(400).json({ error: 'Invalid IDs provided' });
        }

        const updatedCategory = await deleteSubcategory(categoryId, subcategoryId);
        res.status(200).json(updatedCategory);
    } catch (error) {
        // Narrow the type of error to `Error`
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            // Fallback in case the error is not an instance of Error
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
};
