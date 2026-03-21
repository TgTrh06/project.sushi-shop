import { NextFunction, Request, Response } from "express";
import CategoryService from "./category.service";
import { ResponseHandler } from "../../core/utils/common/response.utils";

const categoryService = new CategoryService();

export const createCategory = async (
  req: Request, 
  res: Response,
  next: NextFunction
) => {
  try {
    const newCategory = await categoryService.createCategory(req.body);
    return ResponseHandler.created(res, newCategory, "Category created successfully.");
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
    const categories = await categoryService.getAllCategories();
    return ResponseHandler.success(res, categories, "Categories retrieved successfully.");
  } catch (error) {
    next(error);
  }
};