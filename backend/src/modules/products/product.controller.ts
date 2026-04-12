import { NextFunction, Request, Response } from "express";
import ProductService from "./product.service";
import { ResponseHandler } from "../../utils/common/response.utils";
import {
  PaginationParams,
  PaginationUtils,
} from "@/utils/common/pagination.utils";
import { CreateProductInput } from "./product.types";
import { GetByIdParams, GetBySlugParams } from "@/types/params.type";
export default class ProductController {
  constructor(private readonly productService: ProductService) {}

  create = async (
    req: Request<{}, any, CreateProductInput>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const newProduct = await this.productService.createProduct(req.body);

      return ResponseHandler.created(
        res,
        newProduct,
        "Product created successfully.",
      );
    } catch (error) {
      next(error);
    }
  };

  getAll = async (
    req: Request<{}, any, {}, PaginationParams>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { page, limit, offset } = PaginationUtils.extract(req.query);

      const products = await this.productService.getAllProducts(
        page,
        limit,
        offset,
      );

      return ResponseHandler.success(
        res,
        products,
        "Products retrieved successfully.",
      );
    } catch (error) {
      next(error);
    }
  };

  getListByCategory = async (
    req: Request<GetByIdParams, any, {}, PaginationParams>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id: categoryId } = req.params;
      const { page, limit, offset } = req.query;

      const products = await this.productService.getProductsByCategory(
        page,
        limit,
        offset,
        categoryId,
      );

      return ResponseHandler.success(
        res,
        products,
        "Products retrieved successfully.",
      );
    } catch (error) {
      next(error);
    }
  };

  getOneById = async (
    req: Request<GetByIdParams, any, {}>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;

      const result = await this.productService.getProductById(id);

      return ResponseHandler.success(
        res,
        result,
        "Product retrieved successfully.",
      );
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await this.productService.updateProduct(
        String(req.params.productId),
        req.body,
      );
      return ResponseHandler.success(
        res,
        product,
        "Product updated successfully.",
      );
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.productService.deleteProduct(
        String(req.params.productId),
      );
      return ResponseHandler.success(
        res,
        result,
        "Product deleted successfully.",
      );
    } catch (error) {
      next(error);
    }
  };
}
