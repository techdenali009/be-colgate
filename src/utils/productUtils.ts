import { Request } from 'express';
import { FilterQuery,SortOrder } from 'mongoose';
import { ProductDocument } from '../models/product';

// Function to build the filter object
export const buildFilter = (query: Request['query']): FilterQuery<ProductDocument> => {
  const { category, subcategory, name, minPrice, maxPrice } = query;
  const filter: FilterQuery<ProductDocument> = {};
  // Filter by multiple categories
  if (category) {
    filter.category = { $in: Array.isArray(category) ? category : [category] };
  }
  // Filter by subcategory
  if (subcategory) {
    filter.subCategories = { $in: Array.isArray(subcategory) ? subcategory : [subcategory] };
  }
  // Search by product name
  if (name) {
    filter.name = { $regex: name, $options: 'i' };
  }
  // Filter by price range
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseFloat(minPrice as string);
    if (maxPrice) filter.price.$lte = parseFloat(maxPrice as string);
  }
  return filter;
};

// Function to get sorting options
export const getSortOption = (sortBy: string | undefined): { [key: string]: SortOrder } => {
    switch (sortBy) {
      case 'priceLowToHigh':
        return { price: 1 };
      case 'priceHighToLow':
        return { price: -1 };
      case 'nameAToZ':
        return { name: 1 };
      case 'nameZToA':
        return { name: -1 };
      default:
        return { createdAt: -1 }; // Default sorting by newest
    }
  };

// Function for pagination
export const getPagination = (page: number, limit: number) => {
  const pageNum = parseInt(page as unknown as string, 10) || 1;
  const limitNum = parseInt(limit as unknown as string, 10) || 10;
  const skip = (pageNum - 1) * limitNum;
  return { pageNum, limitNum, skip };
};
