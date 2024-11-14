import { FilterQuery } from 'mongoose';
import { ProductDocument } from '../models/product';
import Category from '../models/Category';

// Function to build the filter object
export const buildFilter = async (query: any): Promise<FilterQuery<ProductDocument>> => {
  const { category, subcategory, name, minPrice, maxPrice } = query;
  const filter: FilterQuery<ProductDocument> = {};

  // Handle multiple categories
  if (category) {
    const categoryNames = Array.isArray(category) ? category : [category];
    const categoryDocs = await Category.find({ name: { $in: categoryNames } });
    const categoryIds = categoryDocs.map((cat) => cat._id);
    filter.category = { $in: categoryIds };
  }

  // Handle subcategory filtering
  if (subcategory) {
    filter.subCategories = { $in: Array.isArray(subcategory) ? subcategory : [subcategory] };
  }

  // Search by product name using regex (case-insensitive)
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

// Function to get sort option
export const getSortOption = (sortBy: string | undefined): { [key: string]: 1 | -1 } => {
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
      return { createdAt: -1 };
  }
};

// Function for pagination
export const getPagination = (page: number, limit: number) => {
  const pageNum = parseInt(page as unknown as string, 10) || 1;
  const limitNum = parseInt(limit as unknown as string, 10) || 10;
  const skip = (pageNum - 1) * limitNum;
  return { pageNum, limitNum, skip };
};

// Aggregation pipeline builder
export const buildProductAggregationPipeline = async (
  filterQuery: any,
  sortBy: string | undefined,
  page: number,
  limit: number
) => {
  const filter = await buildFilter(filterQuery);
  const sortOption = getSortOption(sortBy);
  const { limitNum, skip } = getPagination(page, limit);

  return [
    { $match: filter }, // Apply the filters

    // Lookup to get category details
    {
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'categoryDetails',
      },
    },

    // Lookup to get subcategory details
    {
      $lookup: {
        from: 'subcategories',
        localField: 'subCategories',
        foreignField: '_id',
        as: 'subCategoryDetails',
      },
    },

    // Unwind categoryDetails to get a single category object
    { $unwind: { path: '$categoryDetails', preserveNullAndEmptyArrays: true } },

    // Project to include only required fields
    {
      $project: {
        name: 1,
        description: 1,
        price: 1,
        discount: 1,
        stock: 1,
        category: {
          name: '$categoryDetails.name',
          description: '$categoryDetails.description',
        },
        subCategories: {
          $map: {
            input: '$subCategoryDetails',
            as: 'subCategory',
            in: {
              name: '$$subCategory.name',
              description: '$$subCategory.description',
            },
          },
        },
        images:1,
      },
    },

    // Apply sorting
    { $sort: sortOption },
    // Apply pagination
    { $skip: skip },
    { $limit: limitNum },
  ];
};
