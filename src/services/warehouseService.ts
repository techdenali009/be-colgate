// services/warehouseService.ts
import Warehouse from '../models/Warehouse';

export const createWarehouse = async (data: any) => {
  console.log('Data received in service:', data);

  if (Array.isArray(data)) {
    console.log('Processing multiple warehouses');
    const warehouses = await Promise.all(
      data.map(async (item) => {
        const warehouse = new Warehouse(item);
        return await warehouse.save();
      })
    );
    return warehouses; // Return array of created warehouses
  } else {
    console.log('Processing single warehouse');
    const warehouse = new Warehouse(data);
    return await warehouse.save();
  }
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


export const updateWarehouse = async (id: string, data: any, productId?: string) => {
  const warehouse = await Warehouse.findById(id);
  if (!warehouse) return null;
  if (data.products) {
    for (const updatedProduct of data.products) {
      const actualProductId = updatedProduct.product_id || productId;

      if (!actualProductId) {
        throw new Error('Product ID is required for each product');
      }
      // First try to update the product if it exists
      const updateResult = await Warehouse.updateOne(
        {
          _id: id,
          "products.product_id": actualProductId,
        },
        {
          $set: {
            "products.$.quantity": updatedProduct.quantity,
            "products.$.last_updated": updatedProduct.last_updated || new Date(),
          },
        }
      );
      // If the product does not exist, add it as a new product entry
      if (updateResult.modifiedCount === 0) {
        await Warehouse.updateOne(
          { _id: id },
          {
            $push: {
              products: {
                product_id: actualProductId,
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



export const deleteWarehouseById = async (warehouseId: string) => {
  return await Warehouse.findByIdAndDelete(warehouseId);
};

export const deleteProductFromWarehouse = async (warehouseId: string, productId: string) => {
  // Pull the product with the given product_id from the products array
  return await Warehouse.findByIdAndUpdate(
    warehouseId,
    { $pull: { products: { _id: productId } } },  // Pull the product by its product_id
    { new: true }  // Return the updated warehouse after modification
  );
};
