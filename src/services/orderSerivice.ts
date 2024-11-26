import mongoose, { ObjectId } from 'mongoose';

import { Messages } from '../utils/constants';
import { IOrder } from '../models/interfaces';
import Orders from '../models/Orders';
import Product from '../models/product';

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
        return savedOrder;
    } catch (error) {
        throw new Error((error as Error).message);
    }
};

export const GetAllOrders = async() => {
    try {
       return await Orders.find();
    } catch (err) {
        console.log('err', err)
    }
}

