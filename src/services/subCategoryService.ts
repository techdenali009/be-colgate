import mongoose from 'mongoose';
import Category, { CategoryDocument } from '../models/Category';
import Subcategory, { Subcategory as SubcategoryDocument } from '../models/subCategory';


export const addSubcategoriesToCategory = async (categoryId: string, subcategories: { name: string; description: string }[]): Promise<CategoryDocument> => {
    const category = await Category.findById(categoryId);
    if (!category) throw new Error('Category not found');

    // Create subcategories in the Subcategory collection
    const createdSubcategories = await Subcategory.insertMany(subcategories) as SubcategoryDocument[];

    // Extract the IDs of the newly created subcategories
    const subcategoryIds = createdSubcategories.map(sub => sub._id as mongoose.Types.ObjectId);

    // Add the subcategory IDs to the category
    category.subcategories.push(...subcategoryIds);
    await category.save();

    return category;
};

export const updateSubcategory = async (subcategoryId: string, updatedData: { name: string; description: string }): Promise<SubcategoryDocument> => {
    const subcategory = await Subcategory.findById(subcategoryId);
    if (!subcategory) throw new Error('Subcategory not found');
    // Update subcategory fields
    subcategory.name = updatedData.name;
    subcategory.description = updatedData.description;
    await subcategory.save();
    return subcategory;
};

export const deleteSubcategory = async (categoryId: string, subcategoryId: string): Promise<CategoryDocument> => {
    const category = await Category.findById(categoryId);
    if (!category) throw new Error('Category not found');

    // Remove the subcategory ID from the category
    category.subcategories = category.subcategories.filter(
        subId => subId.toString() !== subcategoryId
    );

    await category.save();
    // Optionally, delete the subcategory document from the Subcategory collection
    await Subcategory.findByIdAndDelete(subcategoryId);

    return category;
};
