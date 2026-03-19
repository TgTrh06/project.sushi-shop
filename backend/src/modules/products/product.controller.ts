import { NextFunction, Request, Response } from "express";
import ProductService from "./product.service";
import { ResponseHandler } from "../../core/utils/common/response.utils";

const productService = new ProductService();

export default class ProductController {
  static async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.createProduct(req.body);
      return ResponseHandler.created(res, product, "Product created successfully.");
    } catch (error) {
      next(error);
    }
  }

  static async getAllProducts(_req: Request, res: Response, next: NextFunction) {
    try {
      const products = await productService.getAllProducts();
      return ResponseHandler.success(res, products, "Products retrieved successfully.")
    } catch (error) {
      next(error);
    }
  }

  static async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.getProductById(String(req.params.productId));
      return ResponseHandler.success(res, product, "Product retrieved successfully.");
    } catch (error) {
      next(error);      
    }
  }

  static async getProductsByCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await productService.getProductsByCategory(String(req.params.categoryId));
      return ResponseHandler.success(res, products, "Products retrieved successfully.");
    } catch (error) {
      next(error);
    }
  }

  static async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.updateProduct(
        String(req.params.productId),
        req.body,
      );
      return ResponseHandler.success(res, product, "Product updated successfully.");
    } catch (error) {
      next(error);
    }
  }

  static async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await productService.deleteProduct(String(req.params.productId));
      return ResponseHandler.success(res, result, "Product deleted successfully.");
    } catch (error) {
      next(error);
    }
  }
}