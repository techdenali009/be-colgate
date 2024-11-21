import { FilterQuery } from 'mongoose';
import { ProductDocument } from '../models/product';
import Category from '../models/Category';
import subCategory from '../models/subCategory';

// Function to build the filter object
export const buildFilter = async (query: any): Promise<FilterQuery<ProductDocument>> => {
  const { category, name, minPrice, maxPrice, 'skin-type': skinType, 'skin-concern': skinConcern, isPopular } = query;
  const filter: FilterQuery<ProductDocument> = {};

  console.log("category, name, minPrice, maxPrice, 'skin-type': skinType, 'skin-concern': skinConcern, isPopular :::", category, name, minPrice, maxPrice,  skinType, skinConcern, isPopular)
  // Handle filtering by categories
  // if (category) {
  //   // const categoryNames = "Products";
  //   // const categoryDocs = await Category.find({ name: { $in: categoryNames } });
  //   // const categoryIds = categoryDocs.map((cat) => cat._id);
  //   // filter.category = { $in: categoryIds };
  // }
 


  // Handle filtering by subcategories (for both skin type and skin concern)
  const subcategoryFilters: string[] = [];
  if (skinType) {
    subcategoryFilters.push(skinType);
  }

  if (skinConcern) {
    subcategoryFilters.push(skinConcern);
  }

  if(category){
    if(Array.isArray(category)){
      subcategoryFilters.push(...category)
    }else {
      subcategoryFilters.push(category)
    }
  }
 
  if (subcategoryFilters.length > 0) {
    const subcategoryDocs = await subCategory.find({ name: { $in: subcategoryFilters } });
    const subcategoryIds = subcategoryDocs.map((sub) => sub._id);
    filter.subCategories = { $in: subcategoryIds };
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

  // Is Popular 
  if(isPopular){
    filter.isPopular = (isPopular == "true");
  }
  console.log('filter', filter)
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
    { $match: filter }, // Apply the updated filters

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

    { $unwind: { path: '$categoryDetails', preserveNullAndEmptyArrays: true } },

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
        images: 1,
        dailCare: 1,
        professionalTreatment: 1,
        bySkinType: 1,
        bySkinConcern: 1,
        howToApply: 1,
        regimenInfromation: 1,
        isPopular: 1,
        productType: 1
      },
    },

    { $sort: sortOption },
    { $skip: skip },
    { $limit: limitNum },
  ];
};

