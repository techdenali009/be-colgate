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

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get query parameters for sorting, pagination, and filtering
    const { sortBy, page = 1, limit = 10, ...filterQuery } = req.query;

    // Build filter, sort, and pagination
    const filter = await buildFilter(filterQuery); // Await the async filter function
    const sortOption = getSortOption(sortBy as string); // Utility function for sort options
    const { pageNum, limitNum, skip } = getPagination(Number(page), Number(limit)); // Utility for pagination

    // Build aggregation pipeline
    const pipeline: any[] = [
      {
        $match: filter,
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryDetails',
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'subCategories', // Use the subcategories linked to the product only
          foreignField: '_id',
          as: 'subCategoryDetails',
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          price: 1,
          discount: 1,
          stock: 1,
          category: '$categoryDetails',
          subCategories: '$subCategoryDetails', // Display only the subcategories that belong to this product
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limitNum,
      },
      {
        $sort: sortOption,
      },
    ];

    // Fetch products using aggregation
    const products = await Product.aggregate(pipeline);

    // Get total count for pagination
    const totalCount = await Product.countDocuments(filter);
    const hasMore = skip + products.length < totalCount;

    // Respond with data
    res.status(200).json({
      products,
      totalCount,
      hasMore,
      currentPage: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
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
