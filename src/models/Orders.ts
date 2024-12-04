import mongoose, { model } from "mongoose";
import { Status, OrderStatus, IOrder } from "./interfaces";
import { PaymentMethod, PaymentStatus } from "../utils/constants";
const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true, // Reference to the customer placing the order
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true // Reference to the product
            },
            quantity: {
                type: Number,
                required: true // Number of units of this product in the order
            },
            priceSnapshot: {
                type: Number,
                required: true // Price of the product at the time of the order
            },
        }
    ],
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
    },
    billingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
    },
    discount: {
        couponCode: {
            type: String,
            default: 'SAVE0'
        },
        amount: {
            type: Number,
            default: 0
        }
    },
    paymentInfo: {
        method: { type: String, required: true }, // e.g., 'Credit Card', 'PayPal', 'COD'
        status: { type: String, default: PaymentStatus.Pending }, // 'Pending', 'Paid', 'Failed'
        transactionId: { type: String }, // Optional, for tracking payment
    },
    orderStatus: {
        type: String,
        enum: OrderStatus,
        default: OrderStatus.Pending, // Default status when an order is created
    },
    totalAmount: {
        type: Number,
        required: true, // Total cost of the order (calculated from products)
    },
    taxAmount: {
        type: Number, // Tax calculated on the order (optional)
        default: 0,
    },
    shippingCost: {
        type: Number, // Additional shipping fee, if any
        default: 0,
    },
    notes: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }, 
        message: {
            type: String,
            default: ''
        }
    }],
    estimatedDelivery: {
        type: Date,
        default: () => {
            const currentDate = new Date();
            return new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000); // 2 days in milliseconds
        }
    },
    orderId: {
        type: String,
        default: Date.now
    },
    status: { type: String, enum: Status, default: Status.Active },
    version: { type: Number, default: 1 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', },
    isActive: { type: Boolean, default: true }
}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

export default model<IOrder>('Order', orderSchema);

