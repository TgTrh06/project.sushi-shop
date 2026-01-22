import { CategoryModel, ICategory } from "../models/category.model";

export const createCategory = async (
  data: Partial<ICategory>,
): Promise<ICategory> => {
  return await CategoryModel.create(data);
};

export const getAllCategories = async (): Promise<ICategory[]> => {
  return await CategoryModel.find();
};