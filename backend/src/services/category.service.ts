import { CategoryModel } from "../models/category/category.model";
import { ICategory } from "../models/category/category.types";

export const createCategory = async (
  data: Partial<ICategory>,
): Promise<ICategory> => {
  return await CategoryModel.create(data);
};

export const getAllCategories = async (): Promise<ICategory[]> => {
  return await CategoryModel.find();
};