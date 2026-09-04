import type { NextFunction, Request, Response } from "express";
import { HttpResponse } from "@/core/http/response";
import { Pagination } from "@/core/http/pagination";
import type { ListProductsUseCase, GetProductUseCase, CreateProductUseCase, UpdateProductUseCase, DeleteProductUseCase } from "../../application/use-cases/product.use-cases";

export class ProductController {
  constructor(private readonly list: ListProductsUseCase, private readonly get: GetProductUseCase, private readonly create: CreateProductUseCase, private readonly update: UpdateProductUseCase, private readonly remove: DeleteProductUseCase) {}
  getAll = async (req: Request, res: Response, next: NextFunction) => { try { const { page, limit } = Pagination.parse(req.query as Record<string, unknown>); return HttpResponse.success(res, await this.list.execute(page, limit), "Products retrieved successfully."); } catch (e) { next(e); } };
  getByCategory = async (req: Request, res: Response, next: NextFunction) => { try { const { page, limit } = Pagination.parse(req.query as Record<string, unknown>); return HttpResponse.success(res, await this.list.execute(page, limit, String(req.params.slug)), "Products retrieved successfully."); } catch (e) { next(e); } };
  getBySlug = async (req: Request, res: Response, next: NextFunction) => { try { return HttpResponse.success(res, await this.get.bySlug(String(req.params.slug)), "Product retrieved successfully."); } catch (e) { next(e); } };
  createHandler = async (req: Request, res: Response, next: NextFunction) => { try { return HttpResponse.created(res, await this.create.execute(req.body), "Product created successfully."); } catch (e) { next(e); } };
  updateHandler = async (req: Request, res: Response, next: NextFunction) => { try { return HttpResponse.success(res, await this.update.execute(String(req.params.id), req.body), "Product updated successfully."); } catch (e) { next(e); } };
  deleteHandler = async (req: Request, res: Response, next: NextFunction) => { try { return HttpResponse.success(res, await this.remove.execute(String(req.params.id)), "Product deleted successfully."); } catch (e) { next(e); } };
}
