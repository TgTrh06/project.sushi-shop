import { CategoryModel } from "../models/category/category.model";
import { Category } from "../models/category/category.types";

export const createCategory = async (
  data: Partial<Category>,
): Promise<Category> => {
  return await CategoryModel.create(data);
};

export const getAllCategories = async (): Promise<Category[]> => {
  return await CategoryModel.find();
};