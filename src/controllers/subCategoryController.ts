import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { addSubcategoriesToCategory, updateSubcategory, deleteSubcategory, getAllSubcategoryService } from '../services/subCategoryService';
import { failResponse, successResponse, errorResponse } from '../utils/response';
import { StatusCode } from '../utils/StatusCodes';
import { Messages } from '../utils/constants';

export const addSubcategories = async (req: Request, res: Response): Promise<void> => {
    const { categoryId } = req.params;
    const subcategories = req.body.subcategories;
    try {
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            failResponse(res, Messages.Invalid_Category_ID, StatusCode.Bad_Request);
            return;
        }
        const updatedCategory = await addSubcategoriesToCategory(categoryId, subcategories);
        successResponse(res, updatedCategory, Messages.SubCategories_Added, StatusCode.OK);
    } catch (error) {
        errorResponse(res, (error as Error).message || Messages.Failed_To_Add_SubCategories, StatusCode.Internal_Server_Error);
    }
};

export const editSubcategory = async (req: Request, res: Response): Promise<void> => {
    const { subcategoryId } = req.params;
    const { name, description } = req.body;
    if (!mongoose.Types.ObjectId.isValid(subcategoryId)) {
        failResponse(res, Messages.Invalid_Category_ID, StatusCode.Bad_Request);
        return;
    }
    if (!name || !description) {
        failResponse(res, Messages.Name_And_Description_Required, StatusCode.Bad_Request);
        return;
    }
    try {
        const updatedSubcategory = await updateSubcategory(subcategoryId, { name, description });
        successResponse(res, updatedSubcategory, Messages.SubCategory_Updated, StatusCode.OK);
    } catch (error) {
        errorResponse(res, (error as Error).message);
    }
};

export const removeSubcategory = async (req: Request, res: Response): Promise<void> => {
    const { categoryId, subcategoryId } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(categoryId) || !mongoose.Types.ObjectId.isValid(subcategoryId)) {
            failResponse(res, Messages.Invalid_Category_ID, StatusCode.Bad_Request);
            return;
        }
        const updatedCategory = await deleteSubcategory(categoryId, subcategoryId);
        successResponse(res, updatedCategory, Messages.SubCategory_Deleted, StatusCode.OK);
    } catch (error) {
        errorResponse(res, (error as Error).message);
    }
};

export const getAllSubcategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await getAllSubcategoryService()
        successResponse(res, data, Messages.SubCategory_Deleted, StatusCode.OK);
    } catch (error) {
        console.log('error', error)
        errorResponse(res, (error as Error).message);
    }
};
