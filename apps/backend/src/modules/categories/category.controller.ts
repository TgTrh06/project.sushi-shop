import { NextFunction, Request, Response } from "express";
import CategoryService from "./category.service";
import { ResponseHandler } from "../../utils/common/response.utils";

const categoryService = new CategoryService();

export default class CategoryController {
  static async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const newCategory = await categoryService.createCategory(req.body);
      return ResponseHandler.created(
        res,
        newCategory,
        "Category created successfully.",
      );
    } catch (error) {
      next(error);
    }
  }

  static async getAllCategories(_req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await categoryService.getAllCategories();
      return ResponseHandler.success(
        res,
        categories,
        "Categories retrieved successfully.",
      );
    } catch (error) {
      next(error);
    }
  }
}
