import { NextFunction, Request, Response } from "express";
import CategoryService from "./category.service";
import { ResponseHandler } from "@/utils/common/response.utils";
import { PaginationUtils } from "@/utils/common/pagination.utils";
import { GetByIdSchema, GetBySlugSchema } from "./category.types";

export default class CategoryController {
  private categoryService = new CategoryService();
  
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newCategory = await this.categoryService.createCategory(req.body);
      
      return ResponseHandler.created(
        res,
        newCategory,
        "Category created successfully.",
      );
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit, offset } = PaginationUtils.extract(req.query);
      
      const categories = await this.categoryService.getAllCategories(page, limit, offset);
      
      return ResponseHandler.success(
        res,
        categories,
        "Categories retrieved successfully.",
      );
    } catch (error) {
      next(error);
    }
  };

  getOneBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse schema & validate through Zod
      const { slug } = GetBySlugSchema.parse(req.params);

      const result = await this.categoryService.getOneBySlug(slug);

      return ResponseHandler.success(
        res,
        result,
        "Category retrieved successfully.",
      )      
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse schema & validate through Zod
      const { id } = GetByIdSchema.parse(req.params);
      
      const updatedCategory = await this.categoryService.updateCategory(id, req.body);
      
      return ResponseHandler.success(res, updatedCategory, "Category updated successfully.");
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse schema & validate through Zod
      const { id } = GetByIdSchema.parse(req.params);

      const deletedCategory = await this.categoryService.deleteCategory(id);

      return ResponseHandler.success(res, deletedCategory, "Category updated successfully.");
    } catch (error) {
      next(error);
    }
  }
};
