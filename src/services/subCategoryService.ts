import mongoose from 'mongoose';
import Category, { CategoryDocument } from '../models/Category';
import Subcategory, { Subcategory as SubcategoryDocument } from '../models/subCategory';
import { Messages } from '../utils/constants';

export const getSubcategoriesByCategoryId = async (categoryId: string): Promise<SubcategoryDocument[]> => {
    try {
        // Validate if the categoryId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            throw new Error(Messages.Category_Not_Found);
        }
        // Fetch subcategories for the given categoryId
        const subcategories = await Subcategory.find({ category: categoryId }).exec();
        // Check if subcategories exist
        if (!subcategories || subcategories.length === 0) {
            throw new Error(Messages.Get_SubCategory_Not_Found);
        }
        return subcategories;
    } catch (error) {
        throw new Error((error as Error).message);
    }
};

export const addSubcategoriesToCategory = async (categoryId: string,subcategories: { name: string; description: string }[]): Promise<CategoryDocument> => {
    try {
        // Check if the category exists
        const category = await Category.findById(categoryId);
        if (!category) throw new Error(Messages.Category_Not_Found);
        // Create subcategories in the Subcategory collection
        const createdSubcategories = await Subcategory.insertMany(subcategories) as SubcategoryDocument[];
        // Extract the IDs of the newly created subcategories
        const subcategoryIds = createdSubcategories.map(sub => sub._id as mongoose.Types.ObjectId);
        // Add the subcategory IDs to the category
        category.subcategories.push(...subcategoryIds);
        await category.save();
        return category;
    } catch (error) {
        throw new Error((error as Error).message);
    }
};

export const updateSubcategory = async (subcategoryId: string,updatedData: { name: string; description: string }): Promise<SubcategoryDocument> => {
    try {
        // Check if the subcategory exists
        const subcategory = await Subcategory.findById(subcategoryId);
        if (!subcategory) throw new Error(Messages.SubCategory_Not_Found);
        // Update subcategory fields
        subcategory.name = updatedData.name;
        subcategory.description = updatedData.description;
        await subcategory.save();
        return subcategory;
    } catch (error) {
        throw new Error((error as Error).message);
    }
};

export const deleteSubcategory = async (categoryId: string,subcategoryId: string): Promise<CategoryDocument> => {
    try {
        // Check if the category exists
        const category = await Category.findById(categoryId);
        if (!category) throw new Error(Messages.Category_Not_Found);
        // Remove the subcategory ID from the category's subcategories list
        category.subcategories = category.subcategories.filter(subId => subId.toString() !== subcategoryId);
        await category.save();
        // Optionally, delete the subcategory document
        const deletedSubcategory = await Subcategory.findByIdAndDelete(subcategoryId);
        if (!deletedSubcategory) throw new Error(Messages.SubCategory_Not_Found);
        return category;
    } catch (error) {
        throw new Error((error as Error).message);
    }
};