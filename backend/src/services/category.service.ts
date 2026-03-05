import { CategoryModel } from "../models/category/category.model";
import { CategoryEntity } from "../models/category/category.types";

export const createCategory = async (
  data: Partial<CategoryEntity>,
): Promise<CategoryEntity> => {
  return await CategoryModel.create(data);
};

export const getAllCategories = async (): Promise<CategoryEntity[]> => {
  return await CategoryModel.find();
};