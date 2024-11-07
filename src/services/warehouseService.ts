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

export const updateWarehouse = async (id: string, data: any) => {
  const warehouse = await Warehouse.findById(id);
  if (!warehouse) return null;

  if (data.products) {
    for (const updatedProduct of data.products) {
      // Ensure the product has a valid product_id
      if (!updatedProduct.product_id) {
        throw new Error('Product ID is required for each product');
      }

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

      if (updateResult.modifiedCount === 0) {
        await Warehouse.updateOne(
          {
            _id: id,
            "products.product_id": { $ne: updatedProduct.product_id },
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
  warehouse.updatedAt = new Date();
  return await warehouse.save();
};


export const deleteWarehouse = async (id: string) => {
  return await Warehouse.findByIdAndDelete(id);
};
