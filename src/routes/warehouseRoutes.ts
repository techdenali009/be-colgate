// routes/warehouse.ts
import express from 'express';
import { body } from 'express-validator';
import * as warehouseController from '../controllers/warehouseController';

const router = express.Router();

router.post(
  '/',
  [
    body('name').isString().trim().notEmpty(),
    body('location.street').isString().trim().notEmpty(),
    body('location.city').isString().trim().notEmpty(),
    body('location.state').isString().trim().notEmpty(),
    body('location.zipcode').isString().trim().notEmpty(),
    body('location.country').isString().trim().notEmpty(),
  ],
  warehouseController.createWarehouse
);

router.get('/', warehouseController.getAllWarehouses);

router.get('/:id', warehouseController.getWarehouseById);

router.put(
  '/:id',
  [
    body('name').optional().isString().trim().notEmpty(),
    body('location.street').optional().isString().trim().notEmpty(),
    body('location.city').optional().isString().trim().notEmpty(),
    body('location.state').optional().isString().trim().notEmpty(),
    body('location.zipcode').optional().isString().trim().notEmpty(),
    body('location.country').optional().isString().trim().notEmpty(),
  ],
  warehouseController.updateWarehouse
);

router.delete('/:id', warehouseController.deleteWarehouse);

export default router;
