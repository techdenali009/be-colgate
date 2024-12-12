import mongoose, { ObjectId } from 'mongoose';

import { Messages } from '../utils/constants';
import { IOrder } from '../models/interfaces';
import Orders from '../models/Orders';
import Product from '../models/product';
import { buildPaginationQuery } from '../utils/appFunctions';

// Order Selectde Fields
const selectedFields = `shippingAddress 
billingAddress paymentInfo userId 
products orderStatus totalAmount 
taxAmount shippingCost comments estimatedDelivery 
createdAt updatedAt discount orderId`;


export const createOrderService = async (order: IOrder): Promise<IOrder> => {
    try {
        const { products, totalAmount, taxAmount, shippingCost } = order;
        let verifiedTotal = 0;
        let allProducts = [];
        for (const item of products) {
            if (!mongoose.Types.ObjectId.isValid(`${item.product}`)) {
                throw new Error('Invalid product');
            }
            const product = await Product.findById(item.product).exec();
            if (!product) throw new Error('Invalid product');
            verifiedTotal += product.price * item.quantity;
            item.priceSnapshot = product.price;
            allProducts.push(item)
        }

        if (taxAmount) {
            verifiedTotal += taxAmount;
        }

        if (shippingCost) {
            verifiedTotal += shippingCost;
        }

        console.log("verifiedTotal !== totalAmount", verifiedTotal, totalAmount);
        if (verifiedTotal !== totalAmount) {
            throw new Error(Messages.Order_Total_Mismatch);
        }

        order.products = allProducts;
        const newOrder = new Orders(order);
        newOrder.createdBy = order.userId as ObjectId;
        newOrder.updatedBy = order.userId as ObjectId;
        const savedOrder = await newOrder.save();
        const totalOrders = await Orders.countDocuments();
        const date = new Date();
        const year = date.getFullYear();
        savedOrder.orderId = `ORD${year}${totalOrders + 1}`;
        const orderObj = await savedOrder.save();
        return orderObj;
    } catch (error) {
        throw new Error((error as Error).message);
    }
};

export const getAllOrdersService = async (query: any, params: any = {}) => {
    try {
        const { skip, limit, page } = buildPaginationQuery(query)
        const { orderStatus, orderId } = query;
        const { userId } = params;
        let searchFilter: any = {
            $and: [
                { isActive: true },
                (orderStatus && { orderStatus }),
                (userId && { userId }),
                (orderId && { orderId: { $regex: orderId, $options: 'i' } })
            ].filter((option) => !!option),

        };
        console.log('orderId', searchFilter);
        const totalRecords = await Orders.countDocuments(searchFilter);
        const totalPages = Math.ceil(totalRecords / limit);
        const hasMore = page < totalPages;


        const orders = await Orders.find(searchFilter)
            .populate('userId', 'name email firstName lastName address')
            .populate({
                path: 'products.product',
                select: 'name price description images',
            })
            .populate({
                path: 'comments.userId',
                select: 'firstName lastName',
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select(selectedFields)
            .exec();

        return {
            orders,
            meta: {
                totalRecords,
                totalPages,
                currentPage: page,
                limit,
                hasMore,
            }
        };
    } catch (err) {
        console.log('err', err)
        throw new Error((err as Error).message);
    }
}


export const getOrdersByIdService = async (orderId: string) => {
    try {
        return await Orders.findById(orderId).select(selectedFields)
           .populate('userId', 'name email firstName lastName address')
            .populate({
                path: 'products.product',
                select: 'name price description images',
            })
            .populate({
                path: 'comments.userId',
                select: 'firstName lastName',
            }).exec();
    } catch (err) {
        throw new Error((err as Error).message);
    }
}

export const updateOrderByIdService = async (orderId: string, order: IOrder) => {
    try {
        return await Orders.findByIdAndUpdate(
            orderId,
            order,
            { new: true, runValidators: true } // Return the updated document and run schema validation
        );
    } catch (err) {
        throw new Error((err as Error).message);
    }


}