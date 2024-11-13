import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { addSubcategoriesToCategory, updateSubcategory, deleteSubcategory, getSubcategoriesByCategoryId } from '../services/subCategoryService';

export const fetchSubcategoriesByCategory = async (req: Request, res: Response): Promise<void> => {
    const { categoryId } = req.params;
    console.log('Fetching subcategories for category ID:', categoryId);

    try {
        const subcategories = await getSubcategoriesByCategoryId(categoryId);
        console.log('Fetched subcategories:', subcategories); // Log fetched subcategories

        if (subcategories.length === 0) {
            throw new Error('No subcategories found for this category');
        }
        res.status(200).json(subcategories);
    } catch (error: unknown) {
        console.error('Error:', error);

        if (error instanceof Error) {
            if (error.message === 'No subcategories found for this category') {
                res.status(404).json({ error: 'No subcategories found for this category' });
            } else {
                res.status(500).json({ error: error.message });
            }
        } else {
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
};

// Add multiple subcategories to a category
export const addSubcategories = async (req: Request, res: Response): Promise<void> => {
    const { categoryId } = req.params;
    const subcategories = req.body.subcategories;
    try {
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            res.status(400).json({ error: 'Invalid Category ID' });
            return;
        }
        const updatedCategory = await addSubcategoriesToCategory(categoryId, subcategories);
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add subcategories' });
    }
};

export const editSubcategory = async (req: Request, res: Response): Promise<void> => {
    const { subcategoryId } = req.params;
    const { name, description } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(subcategoryId)) {
        res.status(400).json({ error: 'Invalid Subcategory ID' });
        return;
    }

    // Check if the required fields are present
    if (!name || !description) {
        res.status(400).json({ error: 'Name and description are required' });
        return;
    }

    try {
        const updatedSubcategory = await updateSubcategory(subcategoryId, { name, description });
        res.status(200).json(updatedSubcategory);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'An unexpected error occurred' });
    }
};

// Delete a subcategory from a category
export const removeSubcategory = async (req: Request, res: Response): Promise<void> => {
    const { categoryId, subcategoryId } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(categoryId) || !mongoose.Types.ObjectId.isValid(subcategoryId)) {
            res.status(400).json({ error: 'Invalid IDs provided' });
            return;
        }
        const updatedCategory = await deleteSubcategory(categoryId, subcategoryId);
        res.status(200).json(updatedCategory);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
};
