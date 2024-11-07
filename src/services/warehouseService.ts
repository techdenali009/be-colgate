// services/warehouseService.ts
import Warehouse from '../models/Warehouse';

export const createWarehouse = async (data: any) => {
  const warehouse = new Warehouse(data);
  return await warehouse.save();
};

export const getAllWarehouses = async () => {
  return await Warehouse.find();
};

export const getWarehouseById = async (id: string) => {
  return await Warehouse.findById(id);
};

export const updateWarehouse = async (id: string, data: any) => {
  const warehouse = await Warehouse.findById(id);
  if (!warehouse) return null;
  // Update name if provided
  warehouse.name = data.name || warehouse.name;
  // Merge location fields if provided
  if (data.location) {
    warehouse.location = { ...warehouse.location, ...data.location };
  }

  // Update or add products as provided
  if (data.products) {
    warehouse.products = data.products.map((product: any) => ({
      product_id: product.product_id,
      quantity: product.quantity,
      last_updated: product.last_updated || new Date(),
    }));
  }

  warehouse.updatedAt = new Date();
  return await warehouse.save();
};

export const deleteWarehouse = async (id: string) => {
  return await Warehouse.findByIdAndDelete(id);
};
