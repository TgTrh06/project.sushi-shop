import { NextFunction, Request, Response } from "express";
import * as service from "../services/product.service";

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await service.createProduct(req.body);
    res.status(201).json({ message: "Product created successfully.", product });
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await service.getAllProducts();
    res.status(200).json({ message: "Products retrieved successfully.", products });
  } catch (error) {
    next(error);
  } 
};

export const getProductsByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await service.getProductsByCategory(req.params.categoryId);
    res.status(200).json({ message: "Products retrieved successfully.", products });
  } catch (error) {
    next(error);
  }
};

export const editProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await service.editProduct(req.params.id, req.body);
    res.status(200).json({ message: "Product edited successfully.", product });
  } catch (error) {
    next(error);
  }
};