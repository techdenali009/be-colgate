import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Product, * as productService from '../services/productService';
import  { buildFilter, getSortOption, getPagination } from '../utils/productUtils';

// Create new products (handling multiple products)
export const createProducts = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  try {
    const products = await productService.createProducts(req.body);
    res.status(201).json(products);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Controller function to get all products
export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sortBy, page, limit } = req.query;
    // Build filter, sort, and pagination
    const filter = buildFilter(req.query);
    console.log("Product Utils",filter);
    const sortOption = getSortOption(sortBy as string);
    const { pageNum, limitNum, skip } = getPagination(Number(page), Number(limit));

    // Query database with filtering, sorting, and pagination
    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);
      console.log("products d",products)
    // Get total count for pagination
    const totalCount = await Product.countDocuments(filter);
    const hasMore = skip + products.length < totalCount;
    console.log("Has More",hasMore)

    res.status(200).json({
      products,
      totalCount,
      hasMore,
      currentPage: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
    });
  } catch (error) {
    console.error("Error fetching products:", (error as Error).message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get product by ID
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Update a product
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Delete a product
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await productService.deleteProduct(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.status(204).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Get products by category ID
export const getProductsByCategory = async (req: Request, res: Response): Promise<void> => {
  const { categoryId } = req.params;

  try {
    const products = await productService.getProductsByCategory(categoryId);
    if (!products.length) {
      res.status(404).json({ message: 'No products found for this category' });
      return;
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
