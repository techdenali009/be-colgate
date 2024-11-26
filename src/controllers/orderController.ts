import { Request, Response } from 'express';
import { failResponse, successResponse, errorResponse } from '../utils/response';
import { StatusCode } from '../utils/StatusCodes';
import { Messages } from '../utils/constants';
import { validationResult } from 'express-validator';
import { createOrderService, GetAllOrders } from '../services/orderSerivice';
import mongoose from 'mongoose';

export const createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req?.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            failResponse(res, errors.array(), StatusCode.Bad_Request);
            return;
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            failResponse(res, Messages.User_Not_Available, StatusCode.Bad_Request);
            return;
        }

        const orderCreated = await createOrderService(req?.body);
        successResponse(res, orderCreated, Messages.OrderCreated, StatusCode.OK);
    } catch (error) {
        console.log('Error', error)
        errorResponse(res, (error as Error).message || Messages.OrderCreating_Error, StatusCode.Bad_Request);
    }
};

export const getOrdersById = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        failResponse(res, Messages.User_Not_Available, StatusCode.Bad_Request);
        return;
    }

    // 
}

export const getAllorders = async (req: Request, res: Response): Promise<void> => {
    // const { userId } = req.params;
    // if (!mongoose.Types.ObjectId.isValid(userId)) {
    //     failResponse(res, Messages.User_Not_Available, StatusCode.Bad_Request);
    //     return;
    // }
    const allOrders = await GetAllOrders()
    successResponse(res, allOrders,'', StatusCode.OK);
    // 
}
// GetAllOrders
// export const editSubcategory = async (req: Request, res: Response): Promise<void> => {
//     const { subcategoryId } = req.params;
//     const { name, description } = req.body;
//     if (!mongoose.Types.ObjectId.isValid(subcategoryId)) {
//         failResponse(res, Messages.Invalid_Category_ID, StatusCode.Bad_Request);
//         return;
//     }
//     if (!name || !description) {
//         failResponse(res, Messages.Name_And_Description_Required, StatusCode.Bad_Request);
//         return;
//     }
//     try {
//         const updatedSubcategory = await updateSubcategory(subcategoryId, { name, description });
//         successResponse(res, updatedSubcategory, Messages.SubCategory_Updated, StatusCode.OK);
//     } catch (error) {
//         errorResponse(res, (error as Error).message);
//     }
// };

// export const removeSubcategory = async (req: Request, res: Response): Promise<void> => {
//     const { categoryId, subcategoryId } = req.params;
//     try {
//         if (!mongoose.Types.ObjectId.isValid(categoryId) || !mongoose.Types.ObjectId.isValid(subcategoryId)) {
//             failResponse(res, Messages.Invalid_Category_ID, StatusCode.Bad_Request);
//             return;
//         }
//         const updatedCategory = await deleteSubcategory(categoryId, subcategoryId);
//         successResponse(res, updatedCategory, Messages.SubCategory_Deleted, StatusCode.OK);
//     } catch (error) {
//         errorResponse(res, (error as Error).message);
//     }
// };

// export const getAllSubcategory = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const data = await getAllSubcategoryService()
//         successResponse(res, data, Messages.SubCategory_Deleted, StatusCode.OK);
//     } catch (error) {
//         console.log('error', error)
//         errorResponse(res, (error as Error).message);
//     }
// };
