import { ProductModel, IProduct } from "../models/product.model";

export const createProduct = async (
  data: Partial<IProduct>,
): Promise<IProduct> => {
  return await ProductModel.create(data);
};

export const getAllProducts = async (): Promise<IProduct[]> => {
  return await ProductModel.find().populate("category", "name");
};

export const getProductsByCategory = async (
  categoryId: any,
): Promise<IProduct[]> => {
  return await ProductModel.find({ category: categoryId }).populate("category");
};