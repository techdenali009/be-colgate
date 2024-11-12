import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import * as categoryService from '../services/categoryService';

// Category CRUD Operations
export const createCategories = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const categories = req.body;

    if (!Array.isArray(categories)) {
      res.status(400).json({ message: 'Request body must be an array of categories.' });
      return;
    }

    // Insert categories in bulk
    const createdCategories = await categoryService.createCategory(categories);
    res.status(201).json(createdCategories);
  } catch (error) {
    console.error('Error creating categories:', error);
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getAllCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getProductsByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await categoryService.getProductsByCategory(req.params.id);
    if (products.length === 0) {
      res.status(404).json({ message: 'No products found for this category' });
      return;
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await categoryService.deleteCategory(req.params.id);
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }
    res.status(204).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const addSubcategory = async (req: Request, res: Response): Promise<void> => {
  const { categoryId, subcategories } = req.body;
  // Check if subcategories is an array
  if (!Array.isArray(subcategories)) {
    res.status(400).json({ message: 'Subcategories should be an array' });
    return;
  }

  // Ensure each subcategory has the necessary fields
  for (const subcategory of subcategories) {
    if (!subcategory.name || !subcategory.description) {
      res.status(400).json({ message: 'Each subcategory must have a name and description' });
      return;
    }
  }
  try {
    // Pass the array of subcategories to the service function
    const updatedCategory = await categoryService.addSubcategoryToCategory(categoryId, subcategories);
    res.status(201).json({
      message: 'Subcategories added successfully',
      subcategories: updatedCategory.subcategories,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Update Subcategory of Category
export const updateSubcategoryController = async (req: Request, res: Response): Promise<void> => {
  const { categoryId, subcategoryName } = req.params;
  const { newSubcategoryName, newDescription } = req.body;
  try {
    const updatedCategory = await categoryService.updateSubcategory(categoryId, subcategoryName, newSubcategoryName, newDescription);
    res.status(200).json({
      message: 'Subcategory updated successfully',
      subcategories: updatedCategory?.subcategories,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Controller to delete a subcategory
export const deleteSubcategoryController = async (req: Request, res: Response): Promise<void> => {
  const { categoryId, subcategoryId } = req.params;
  console.log(`Received request to delete subcategory: ${subcategoryId} from category: ${categoryId}`);

  try {
    const updatedCategory = await categoryService.deleteSubcategory(categoryId, subcategoryId);
    res.status(200).json({
      message: 'Subcategory deleted successfully',
      subcategories: updatedCategory.subcategories,
    });
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    res.status(500).json({ message: (error as Error).message });
  }
};
