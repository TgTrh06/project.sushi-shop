import { Request, Response } from "express";
import * as service from "../services/product.service";

export const createProduct = async (
  req: Request,
  res: Response,
) => {
  try {
    const product = await service.createProduct(req.body);
    res.status(201).json({ message: "Product created successfully.", product });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getAllProducts = async (
  _req: Request,
  res: Response,
) => {
  try {
    const products = await service.getAllProducts();
    res.status(200).json({ message: "Products retrieved successfully.", products });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  } 
};

export const getProductsByCategory = async (
  req: Request,
  res: Response,
) => {
  try {
    const products = await service.getProductsByCategory(req.params.categoryId);
    res.status(200).json({ message: "Products retrieved successfully.", products });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};