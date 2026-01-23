import { NextFunction, Request, Response } from "express";
import * as service from "../services/category.service";

export const createCategory = async (
  req: Request, 
  res: Response,
  next: NextFunction
) => {
  try {
    const newCategory = await service.createCategory(req.body);
    res.status(201).json({
      message: "Category created successfully.",
      category: newCategory,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCategories = async (
  _req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const categories = await service.getAllCategories();
    res.status(200).json({
      message: "Categories retrieved successfully.",
      categories,
    });
  } catch (error) {
    next(error);
  }
};