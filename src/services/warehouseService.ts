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
  return await Warehouse.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

export const deleteWarehouse = async (id: string) => {
  return await Warehouse.findByIdAndDelete(id);
};
