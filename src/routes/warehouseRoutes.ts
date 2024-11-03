// routes/warehouse.ts
import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Warehouse from '../models/Warehouse';

const router = express.Router();

// Create a new warehouse
router.post(
  '/',
  [
    body('name').isString().trim().notEmpty(),
    body('location').isString().trim().notEmpty(),
    body('capacity').isNumeric().notEmpty(),
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      const warehouse = new Warehouse(req.body);
      await warehouse.save();
      res.status(201).json(warehouse);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
);

// Get all warehouses
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const warehouses = await Warehouse.find();
    res.status(200).json(warehouses);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Get warehouse by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      res.status(404).json({ message: 'Warehouse not found' });
      return;
    }
    res.status(200).json(warehouse);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Update a warehouse
router.put(
  '/:id',
  [
    body('name').optional().isString().trim().notEmpty(),
    body('location').optional().isString().trim().notEmpty(),
    body('capacity').optional().isNumeric().notEmpty(),
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      const warehouse = await Warehouse.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!warehouse) {
        res.status(404).json({ message: 'Warehouse not found' });
        return;
      }
      res.status(200).json(warehouse);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
);

// Delete a warehouse
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const warehouse = await Warehouse.findByIdAndDelete(req.params.id);
    if (!warehouse) {
      res.status(404).json({ message: 'Warehouse not found' });
      return;
    }
    res.status(204).json({ message: 'Warehouse deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

export default router;
