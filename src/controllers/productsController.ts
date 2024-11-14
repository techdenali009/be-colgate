import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Product, * as productService from '../services/productService';
import { buildFilter, getSortOption, getPagination, buildProductAggregationPipeline } from '../utils/productUtils';

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

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get query parameters for sorting, pagination, and filtering
    const { sortBy, page = 1, limit = 10, ...filterQuery } = req.query;

    // Call the utility function to build the aggregation pipeline
    const pipeline = await buildProductAggregationPipeline(filterQuery, sortBy as string, Number(page), Number(limit));

    // Fetch products using aggregation
    const products = await Product.aggregate(pipeline);

    // Get total count for pagination
    const totalCount = await Product.countDocuments(await buildFilter(filterQuery));
    const hasMore = (Number(page) - 1) * Number(limit) + products.length < totalCount;

    // Respond with data
    res.status(200).json({
      products,
      totalCount,
      hasMore,
      currentPage: Number(page),
      totalPages: Math.ceil(totalCount / Number(limit)),
    });
  } catch (error) {
    console.error('Error fetching products:', (error as Error).message);
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
