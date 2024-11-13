import Category, { CategoryDocument } from '../models/Category';
import Product, { ProductDocument } from '../models/product';

// Create Category - returns an array of CategoryDocument
export const createCategory = async (data: any): Promise<CategoryDocument[]> => {
  if (Array.isArray(data)) {
    const docs = await Category.insertMany(data);
    return docs.map((doc) => doc.toObject() as CategoryDocument); // Correctly returning an array of documents
  } else {
    const doc = await new Category(data).save();
    return [doc.toObject() as CategoryDocument]; // Still returning an array even for a single document
  }
};

// Get all categories along with subcategory details (name and description)
export const getAllCategories = async (): Promise<CategoryDocument[]> => {
  console.log('getAllCategories called');
  try {
    // Fetch categories and populate the subcategories field with name and description
    const categories = await Category.find()
      .populate('subcategories', 'name description') // Populating subcategories with 'name' and 'description'
      .lean<CategoryDocument[]>()
      .exec();
    
    console.log('Fetched categories:', categories);
    return categories; // Return array of CategoryDocuments with populated subcategories
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Error fetching categories');
  }
};

// Get Category By ID - returns a single CategoryDocument or null
export const getCategoryById = async (id: string): Promise<CategoryDocument | null> => {
  console.log('getCategoryById called with id:', id);
  try {
    const category = await Category.findById(id).lean<CategoryDocument>().exec();
    console.log('Fetched category:', category);
    return category; // Return single CategoryDocument or null
  } catch (error) {
    console.error('Error fetching category by ID:', error);
    throw new Error(`Error fetching category by ID`);
  }
};

// Get Products By Category - returns an array of ProductDocument
export const getProductsByCategory = async (categoryId: string): Promise<ProductDocument[]> => {
  console.log('getProductsByCategory called with categoryId:', categoryId);
  try {
    const products = await Product.find({ category: categoryId }).lean<ProductDocument[]>().exec();
    console.log('Fetched products for category:', products);
    return products; // Return array of ProductDocuments
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw new Error(`Error fetching products by category`);
  }
};

// Update Category - returns the updated CategoryDocument or null
export const updateCategory = async (id: string, data: any): Promise<CategoryDocument | null> => {
  console.log('updateCategory called with id:', id, 'and data:', data);
  try {
    const updatedDoc = await Category.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .lean<CategoryDocument>()
      .exec(); // Execute and ensure typing
    console.log('Updated category:', updatedDoc);
    return updatedDoc; // Return updated CategoryDocument or null
  } catch (error) {
    console.error('Error updating category:', error);
    throw new Error(`Error updating category`);
  }
};

// Delete Category - returns the deleted CategoryDocument or null
export const deleteCategory = async (id: string): Promise<CategoryDocument | null> => {
  console.log('deleteCategory called with id:', id);
  try {
    const deletedDoc = await Category.findByIdAndDelete(id).lean<CategoryDocument>().exec(); // Execute and ensure typing
    console.log('Deleted category:', deletedDoc);
    return deletedDoc; // Return deleted CategoryDocument or null
  } catch (error) {
    console.error('Error deleting category:', error);
    throw new Error(`Error deleting category`);
  }
};
