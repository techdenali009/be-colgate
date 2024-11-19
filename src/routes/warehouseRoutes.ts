// routes/warehouse.ts
import express from 'express';
import { body } from 'express-validator';
import * as warehouseController from '../controllers/warehouseController';

const router = express.Router();

router.post(
  '/',
  [
    // Validate whether data is an array or a single object
    body().custom(value => {
      if (Array.isArray(value)) {
        // Validate each item in the array (multiple warehouses)
        value.forEach(item => {
          body('name').isString().trim().notEmpty().run(item);
          body('location.street').isString().trim().notEmpty().run(item);
          body('location.city').isString().trim().notEmpty().run(item);
          body('location.state').isString().trim().notEmpty().run(item);
          body('location.zipcode').isString().trim().notEmpty().run(item);
          body('location.country').isString().trim().notEmpty().run(item);
        });
      } else {
        // Validate a single warehouse
        body('name').isString().trim().notEmpty().run(value);
        body('location.street').isString().trim().notEmpty().run(value);
        body('location.city').isString().trim().notEmpty().run(value);
        body('location.state').isString().trim().notEmpty().run(value);
        body('location.zipcode').isString().trim().notEmpty().run(value);
        body('location.country').isString().trim().notEmpty().run(value);
      }
      return true; // Validation passed
    })
  ],
  warehouseController.createWarehouse
);


router.get('/', warehouseController.getAllWarehouses);

router.get('/:id', warehouseController.getWarehouseById);

router.put(
  '/:id',
  [
    body('name').optional().isString().trim().notEmpty(),
    // Location validation (make sure each field is validated)
    body('location').optional().isObject(),
    body('location.street').optional().isString().trim().notEmpty(),
    body('location.city').optional().isString().trim().notEmpty(),
    body('location.state').optional().isString().trim().notEmpty(),
    body('location.zipcode').optional().isString().trim().notEmpty(),
    body('location.country').optional().isString().trim().notEmpty(),
    // Products validation
    body('products').optional().isArray(),
    body('products.*.product_id').optional().isMongoId(),
    body('products.*.quantity').optional().isInt({ min: 0 }),
    body('products.*.last_updated').optional().isDate(),
  ],
  warehouseController.updateWarehouse
);

router.delete('/:id', warehouseController.deleteWarehouse);

router.delete('/:warehouseId/products/:productId', warehouseController.deleteWarehouseProduct);

export default router;
