import { body } from 'express-validator';

export const validateOrder = [
    body('userId').notEmpty().withMessage('userId is required'),
    body('products').notEmpty().withMessage('Products are required'),
    body('shippingAddress').notEmpty().withMessage('shipping Address is required'),
    body('billingAddress').notEmpty().withMessage('billing Address is required'),
    body('paymentInfo').notEmpty().withMessage('paymentInfo is required'),
    body('totalAmount').notEmpty().isNumeric().withMessage('totalAmount is required'),
    body('taxAmount').notEmpty().isNumeric().withMessage('taxAmount is required'),
    body('shippingCost').notEmpty().isNumeric().withMessage('shippingCost is required')
];

