import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { addSubcategoriesToCategory, updateSubcategory, deleteSubcategory, getSubcategoriesByCategoryId } from '../services/subCategoryService';
import { failResponse, successResponse } from '../utils/response';
import { StatusCode } from '../utils/StatusCodes';
import { Messages } from '../utils/constants';

export const fetchSubcategoriesByCategory = async (req: Request, res: Response): Promise<void> => {
    const { categoryId } = req.params;
    try {
        const subcategories = await getSubcategoriesByCategoryId(categoryId);
        if (subcategories.length === 0) {
            throw new Error(Messages.Get_SubCategory_Not_Found);
        }
        res.status(200).json(subcategories);
    } catch (error: unknown) {
        if (error instanceof Error) {
            if (error.message === Messages.Get_SubCategory_Not_Found) {
                res.status(404).json({ error: Messages.Get_SubCategory_Not_Found });
            } else {
                res.status(500).json({ error: error.message });
            }
        } else {
            res.status(500).json({ error: Messages.Unexpected_Error });
        }
    }
};

// Add multiple subcategories to a category
export const addSubcategories = async (req: Request, res: Response): Promise<void> => {
    const { categoryId } = req.params;
    const subcategories = req.body.subcategories;
    try {
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            res.status(400).json({ error: Messages.Invalid_Category_ID });
            return;
        }
        const updatedCategory = await addSubcategoriesToCategory(categoryId, subcategories);
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ error: Messages.Failed_To_Add_SubCategories });
    }
};

export const editSubcategory = async (req: Request, res: Response): Promise<void> => {
    const { subcategoryId } = req.params;
    const { name, description } = req.body;
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(subcategoryId)) {
        res.status(400).json({ error: Messages.Invalid_Category_ID });
        return;
    }
    // Check if the required fields are present
    if (!name || !description) {
        res.status(400).json({ error: Messages.Name_And_Description_Required });
        return;
    }
    try {
        const updatedSubcategory = await updateSubcategory(subcategoryId, { name, description });
        res.status(200).json(updatedSubcategory);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : Messages.Unexpected_Error });
    }
};

// Delete a subcategory from a category
export const removeSubcategory = async (req: Request, res: Response): Promise<void> => {
    const { categoryId, subcategoryId } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(categoryId) || !mongoose.Types.ObjectId.isValid(subcategoryId)) {
            res.status(400).json({ error: Messages.Invalid_Category_ID });
            return;
        }
        const updatedCategory = await deleteSubcategory(categoryId, subcategoryId);
        res.status(200).json(updatedCategory);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: Messages.Unexpected_Error });
        }
    }
};
