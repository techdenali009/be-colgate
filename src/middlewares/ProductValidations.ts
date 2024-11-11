import { body } from 'express-validator';
// Validation rules

export const productValidationRules = [
  body().isArray().withMessage('Expected an array of products'),
  body('*.name').isString().trim().notEmpty().withMessage('Name is required'),
  body('*.description').isString().trim().notEmpty().withMessage('Description is required'),
  body('*.price').isNumeric().notEmpty().withMessage('Price is required and should be numeric'),
  body('*.category').isMongoId().withMessage('Category must be a valid ObjectId'),
  body('*.inventoryLocations')
    .isArray()
    .withMessage('Inventory locations must be an array')
    .custom((locations) => {
      if (!locations.length) {
        throw new Error('Inventory locations cannot be empty');
      }
      return true;
    }),
  body('*.shipping')
    .isObject()
    .withMessage('Shipping information is required')
    .custom((shipping) => {
      if (!shipping.weight) {
        throw new Error('Shipping weight is required');
      }
      return true;
    }),
];
