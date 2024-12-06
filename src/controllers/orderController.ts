import { Request, Response } from 'express';
import { failResponse, successResponse, errorResponse } from '../utils/response';
import { StatusCode } from '../utils/StatusCodes';
import { allowedOrderStatus, Messages, orderAllowedUpdates, validOrderSequence } from '../utils/constants';
import { validationResult } from 'express-validator';
import { createOrderService, getAllOrdersService, getOrdersByIdService, updateOrderByIdService } from '../services/orderSerivice';
import mongoose from 'mongoose';
import { IOrder, OrderStatus } from '../models/interfaces';

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
        successResponse(res, { orderId: orderCreated._id }, Messages.OrderCreated, StatusCode.OK);
    } catch (error) {
        console.log('Error', error)
        errorResponse(res, (error as Error).message || Messages.OrderCreating_Error, StatusCode.Bad_Request);
    }
};

export const getOrdersByUserId = async (req: Request, res: Response): Promise<void> => {
    try {
        const allOrders = await getAllOrdersService(req?.query, req?.params);
        successResponse(res, allOrders, '', StatusCode.OK);
    } catch (err) {
        errorResponse(res, (err as Error).message, StatusCode.Bad_Request);
    }
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        failResponse(res, Messages.User_Not_Available, StatusCode.Bad_Request);
        return;
    }
}

export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const allOrders = await getAllOrdersService(req.query);
        successResponse(res, allOrders, '', StatusCode.OK);
    } catch (err) {
        errorResponse(res, (err as Error).message, StatusCode.Bad_Request);
    }
}

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { orderId } = req.params;
        const order: any = await getOrdersByIdService(orderId);
        successResponse(res, { order }, '', StatusCode.OK);
    } catch (err) {
        errorResponse(res, (err as Error).message, StatusCode.Bad_Request);
    }
}

export const updateOrderById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { orderId } = req.params;
        const updateOrder = req.body;
        const order: any = await getOrdersByIdService(orderId);

        if (!order) {
            failResponse(res, Messages.Order_Not_Found, StatusCode.Bad_Request);
            return
        }

        let newOrder: any = {}

        Object.keys(updateOrder).forEach((key) => {
            if (orderAllowedUpdates.includes(key)) {
                newOrder[key as any] = updateOrder[key];
            }
        });

        if (newOrder?.orderStatus) {
            if (!allowedOrderStatus.includes(newOrder.orderStatus)) {
                failResponse(res, Messages.Invalid_Order_Status, StatusCode.Bad_Request);
                return
            }

            if (updateOrder.orderStatus === OrderStatus.Delivered && order.orderStatus === OrderStatus.Cancelled) {
                failResponse(res, Messages.Order_Cannot_Delivered, StatusCode.Bad_Request);
                return
            }

            if (updateOrder.orderStatus === OrderStatus.Cancelled && order.orderStatus === OrderStatus.Delivered) {
                failResponse(res, Messages.Order_Cannot_Cancel, StatusCode.Bad_Request);
                return
            }

            const currentStatusIndex = validOrderSequence.indexOf(order.orderStatus);
            const newStatusIndex = validOrderSequence.indexOf(updateOrder.orderStatus);
            console.log('currentStatusIndex', currentStatusIndex, newStatusIndex, order.orderStatus, updateOrder.orderStatus, !(newStatusIndex === currentStatusIndex + 1), newStatusIndex <= currentStatusIndex)
            if ((updateOrder.orderStatus !== OrderStatus.Cancelled) && (newStatusIndex <= currentStatusIndex || !(newStatusIndex === currentStatusIndex + 1))) {
                console.log('Order Squence Wrong!...');
                failResponse(res, Messages.Order_Status_Skipped, StatusCode.Bad_Request);
                return
            }
        }
        if (newOrder?.comments?.length > 0) {
            const hasValidNotes = newOrder?.comments?.every(
                (comment: { userId: string, message: string }) => comment?.userId && comment?.message);
            if (!hasValidNotes) {
                failResponse(res, Messages.Order_Comments_Required, StatusCode.Bad_Request);
                return
            }
            newOrder.comments = [...newOrder.comments, ...(order?.comments || [])]
        }

        if (newOrder?.estimatedDelivery) {
            const parsedDate1 = new Date(newOrder?.estimatedDelivery);
            const parsedDate2 = new Date(order?.estimatedDelivery);
            if (parsedDate1 <= parsedDate2 ) {
                failResponse(res, Messages.Order_Estimate_Date_Error, StatusCode.Bad_Request);
                return;
              }
        }

        const updatedOrder = await updateOrderByIdService(orderId, newOrder)
        successResponse(res, updateOrder, Messages.OrderUpdated, StatusCode.OK);
    } catch (err) {
        errorResponse(res, (err as Error).message, StatusCode.Bad_Request);
    }
}

export const deleteOrderById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { orderId } = req.params;
        const order: any = await updateOrderByIdService(orderId, { isActive: false } as IOrder);
        successResponse(res, { orderId }, Messages.Order_Deleted, StatusCode.OK);
    } catch (err) {
        errorResponse(res, (err as Error).message, StatusCode.Bad_Request);
    }
}

