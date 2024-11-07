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

  // Update the warehouse name if provided
  if (data.name) {
    warehouse.name = data.name;
  }

  // Update location if provided
  if (data.location) {
    warehouse.location = { ...warehouse.location, ...data.location };
  }

  // Check if product data is provided in the request
  if (data.products) {
    // Loop through the provided products
    for (const updatedProduct of data.products) {
      // First, try to update the existing product if it exists
      const updateResult = await Warehouse.updateOne(
        {
          _id: id,
          "products.product_id": updatedProduct.product_id,
        },
        {
          $set: {
            "products.$.quantity": updatedProduct.quantity,
            "products.$.last_updated": updatedProduct.last_updated || new Date(),
          },
        }
      );

      // If the product doesn't exist, add it to the products array
      if (updateResult.modifiedCount === 0) {
        await Warehouse.updateOne(
          {
            _id: id,
            "products.product_id": { $ne: updatedProduct.product_id }, // Ensure the product does not exist
          },
          {
            $push: {
              products: {
                product_id: updatedProduct.product_id,
                quantity: updatedProduct.quantity,
                last_updated: updatedProduct.last_updated || new Date(),
              },
            },
          }
        );
      }
    }
  }

  // Update the updatedAt timestamp
  warehouse.updatedAt = new Date();

  // Save the updated warehouse
  return await warehouse.save();
};


export const deleteWarehouse = async (id: string) => {
  return await Warehouse.findByIdAndDelete(id);
};
