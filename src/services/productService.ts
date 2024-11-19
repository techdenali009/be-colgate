import Product, { ProductDocument } from '../models/product';

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

export const getAllProducts = async (filter: any = {},sortOptions: any = {}): Promise<ProductDocument[]> => {
  try {
    const products = await Product.find(filter).sort(sortOptions);
    return products;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

// Get product by ID
export const getProductById = async (id: string): Promise<ProductDocument | null> => {
  try {
    const product = await Product.findById(id);
    return product;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

// Update a product
export const updateProduct = async (id: string, data: any): Promise<ProductDocument | null> => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    return updatedProduct;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

// Delete a product
export const deleteProduct = async (id: string): Promise<ProductDocument | null> => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    return deletedProduct;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

// Get products by category ID
export const getProductsByCategory = async (categoryId: string): Promise<ProductDocument[]> => {
  try {
    const products = await Product.find({ category: categoryId }).exec();
    return products;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
export default Product;