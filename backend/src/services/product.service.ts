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

export const editProduct = async (
  productId: any,
  data: Partial<IProduct>,
): Promise<IProduct | null> => {
  return await ProductModel.findByIdAndUpdate(productId, data, { new: true });
};