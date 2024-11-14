import Product, { ProductDocument } from '../models/product';

// Create new products (handling multiple products)
export const createProducts = async (productData: any[]): Promise<ProductDocument[]> => {
  try {
    const products = await Promise.all(
      productData.map(async (data) => {
        const product = new Product(data);
        console.log("Products data", product);
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
    console.log("Fetched products:", products);
    return products;
  } catch (error) {
    console.error("Error fetching products:", (error as Error).message);
    throw new Error((error as Error).message);
  }
};

// Get product by ID
export const getProductById = async (id: string): Promise<ProductDocument | null> => {
  try {
    console.log(`Fetching product with ID: ${id}`);
    const product = await Product.findById(id);
    console.log("Fetched product:", product);
    return product;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, (error as Error).message);
    throw new Error((error as Error).message);
  }
};

// Update a product
export const updateProduct = async (id: string, data: any): Promise<ProductDocument | null> => {
  try {
    console.log(`Updating product with ID: ${id} with data:`, data);
    const updatedProduct = await Product.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    console.log("Updated product:", updatedProduct);
    return updatedProduct;
  } catch (error) {
    console.error(`Error updating product with ID ${id}:`, (error as Error).message);
    throw new Error((error as Error).message);
  }
};

// Delete a product
export const deleteProduct = async (id: string): Promise<ProductDocument | null> => {
  try {
    console.log(`Deleting product with ID: ${id}`);
    const deletedProduct = await Product.findByIdAndDelete(id);
    console.log("Deleted product:", deletedProduct);
    return deletedProduct;
  } catch (error) {
    console.error(`Error deleting product with ID ${id}:`, (error as Error).message);
    throw new Error((error as Error).message);
  }
};

// Get products by category ID
export const getProductsByCategory = async (categoryId: string): Promise<ProductDocument[]> => {
  try {
    console.log(`Fetching products with category ID: ${categoryId}`);
    const products = await Product.find({ category: categoryId }).exec();
    console.log("Fetched products by category:", products);
    return products;
  } catch (error) {
    console.error(`Error fetching products by category ID ${categoryId}:`, (error as Error).message);
    throw new Error((error as Error).message);
  }
};
export default Product;