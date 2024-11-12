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

// Get All Categories - returns an array of CategoryDocument
export const getAllCategories = async (): Promise<CategoryDocument[]> => {
  console.log('getAllCategories called');
  try {
    const categories = await Category.find().lean<CategoryDocument[]>().exec();
    console.log('Fetched categories:', categories);
    return categories; // Return array of CategoryDocuments
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error(`Error fetching categories`);
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

// Add multiple Subcategories to Category
export const addSubcategoryToCategory = async (categoryId: string, subcategories: { name: string, description: string }[]) => {
  const category = await Category.findById(categoryId);
  if (!category) throw new Error('Category not found');

  // Add all subcategories to the category
  category.subcategories.push(...subcategories);
  await category.save();
  
  return category;
};

// Update Subcategory of Category
export const updateSubcategory = async (categoryId: string, oldSubcategoryName: string, newSubcategoryName: string, newDescription: string) => {
  const category = await Category.findById(categoryId);
  if (!category) throw new Error('Category not found');

  const subcategory = category.subcategories.find(sub => sub.name === oldSubcategoryName);
  if (!subcategory) throw new Error('Subcategory not found');

  subcategory.name = newSubcategoryName;
  subcategory.description = newDescription;

  await category.save();
  return category;
};

// Delete Subcategory from Category
export const deleteSubcategory = async (categoryId: string, subcategoryName: string) => {
  const category = await Category.findById(categoryId);
  if (!category) throw new Error('Category not found');

  const subcategoryIndex = category.subcategories.findIndex(sub => sub.name === subcategoryName);
  if (subcategoryIndex === -1) throw new Error('Subcategory not found');

  category.subcategories.splice(subcategoryIndex, 1);
  await category.save();
  return category;
};