// services/productService.ts
import Product, { ProductDocument }  from '../models/product';

// Create new products (handling multiple products)
export const createProducts = async (productData: any[]): Promise<ProductDocument[]> => {
  try {
    const products = await Promise.all(
      productData.map(async (data) => {
        const product = new Product(data);
        await product.save();
        return product;
      })
    );
    return products;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

// Get all products
export const getAllProducts = async (): Promise<ProductDocument[]> => {
  try {
    return await Product.find();
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

// Get product by ID
export const getProductById = async (id: string): Promise<ProductDocument | null> => {
  try {
    return await Product.findById(id);
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

// Update a product
export const updateProduct = async (id: string, data: any): Promise<ProductDocument | null> => {
  try {
    return await Product.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

// Delete a product
export const deleteProduct = async (id: string): Promise<ProductDocument | null> => {
  try {
    return await Product.findByIdAndDelete(id);
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

// Get products by category ID
export const getProductsByCategory = async (categoryId: string): Promise<ProductDocument[]> => {
  try {
    return await Product.find({ category: categoryId }).exec();
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
