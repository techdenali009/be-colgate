// services/warehouseService.ts
import Warehouse from '../models/Warehouse';

export const createWarehouse = async (data: any) => {
  const warehouse = new Warehouse(data);
  return await warehouse.save();
};

export const getAllWarehouses = async () => {
  return await Warehouse.find();
};

export const getWarehousesByFilter = async (filter: any) => {
  return await Warehouse.find(filter);
};

export const getWarehouseById = async (id: string) => {
  return await Warehouse.findById(id);
};

export const updateWarehouse = async (id: string, data: any, queryParams: any) => {
  const warehouse = await Warehouse.findById(id);
  if (!warehouse) return null;

  // Use queryParams to filter data (if necessary)
  // For example, let's log the query params for now
  console.log('Query Params:', queryParams);

  // Update the name if provided
  warehouse.name = data.name || warehouse.name;

  // Merge location fields if provided
  if (data.location) {
    warehouse.location = { ...warehouse.location, ...data.location };
  }

  // Update or add products without removing other products
  if (data.products) {
    // Go through each product in the update data and update it in the warehouse
    data.products.forEach((updatedProduct: any) => {
      const existingProduct = warehouse.products.find(
        (product) => product.product_id === updatedProduct.product_id
      );

      if (existingProduct) {
        // If product exists, update the relevant fields
        existingProduct.quantity = updatedProduct.quantity || existingProduct.quantity;
        existingProduct.last_updated = updatedProduct.last_updated || existingProduct.last_updated;
      } else {
        // If product does not exist, add it to the products array
        warehouse.products.push({
          product_id: updatedProduct.product_id,
          quantity: updatedProduct.quantity,
          last_updated: updatedProduct.last_updated || new Date(),
        });
      }
    });
  }

  // Update the `updatedAt` timestamp
  warehouse.updatedAt = new Date();

  // Save and return the updated warehouse
  return await warehouse.save();
};

export const deleteWarehouse = async (id: string) => {
  return await Warehouse.findByIdAndDelete(id);
};
