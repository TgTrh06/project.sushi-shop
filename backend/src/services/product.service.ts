import { ProductModel } from "../models/product/product.model";
import { ProductEntity } from "../models/product/product.types";

export const createProduct = async (
  data: Partial<ProductEntity>,
): Promise<ProductEntity> => {
  return await ProductModel.create(data);
};

export const getAllProducts = async (): Promise<ProductEntity[]> => {
  return await ProductModel.find().populate("category", "name");
};

export const getProductsByCategory = async (
  categoryId: any,
): Promise<ProductEntity[]> => {
  return await ProductModel.find({ category: categoryId }).populate("category");
};

export const editProduct = async (
  productId: any,
  data: Partial<ProductEntity>,
): Promise<ProductEntity | null> => {
  return await ProductModel.findByIdAndUpdate(productId, data, { new: true });
};