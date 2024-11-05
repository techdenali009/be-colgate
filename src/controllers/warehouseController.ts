// controllers/warehouseController.ts
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import * as warehouseService from '../services/warehouseService';

export const createWarehouse = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const warehouse = await warehouseService.createWarehouse(req.body);
    res.status(201).json(warehouse);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getAllWarehouses = async (req: Request, res: Response): Promise<void> => {
  try {
    const warehouses = await warehouseService.getAllWarehouses();
    res.status(200).json(warehouses);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getWarehouseById = async (req: Request, res: Response): Promise<void> => {
  try {
    const warehouse = await warehouseService.getWarehouseById(req.params.id);
    if (!warehouse) {
      res.status(404).json({ message: 'Warehouse not found' });
      return;
    }
    res.status(200).json(warehouse);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateWarehouse = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const warehouse = await warehouseService.updateWarehouse(req.params.id, req.body);
    if (!warehouse) {
      res.status(404).json({ message: 'Warehouse not found' });
      return;
    }
    res.status(200).json(warehouse);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteWarehouse = async (req: Request, res: Response): Promise<void> => {
  try {
    const warehouse = await warehouseService.deleteWarehouse(req.params.id);
    if (!warehouse) {
      res.status(404).json({ message: 'Warehouse not found' });
      return;
    }
    res.status(204).json({ message: 'Warehouse deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
