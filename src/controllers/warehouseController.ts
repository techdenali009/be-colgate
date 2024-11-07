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
  const { name, status, location, isActive, product_id } = req.query;
  // Build filter object based on query params
  const filter: any = {};
  if (name) {
    filter.name = { $regex: name, $options: 'i' }; // Case-insensitive search
  }
  if (status) {
    filter.status = status;
  }
  if (isActive) {
    filter.isActive = isActive === 'true'; // Convert 'true' or 'false' string to boolean
  }
  if (location) {
    // Filter by location fields (street, city, state, zipcode, country)
    const locationFilter: any = {};
    const locationFields = ['street', 'city', 'state', 'zipcode', 'country'];
    locationFields.forEach((field) => {
      if (req.query[field]) {
        locationFilter[field] = { $regex: req.query[field], $options: 'i' }; // Case-insensitive
      }
    });
    if (Object.keys(locationFilter).length > 0) {
      filter.location = locationFilter;
    }
  }
  if (product_id) {
    filter['products.product_id'] = product_id; // Filter by product_id within products array
  }
  try {
    const warehouses = await warehouseService.getWarehousesByFilter(filter);
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
  const updateData = req.body;
  try {
    // If query params are provided, pass them along to the service for filtering
    const warehouse = await warehouseService.updateWarehouse(req.params.id, updateData);
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
