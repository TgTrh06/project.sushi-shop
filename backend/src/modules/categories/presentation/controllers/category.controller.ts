import type { NextFunction, Request, Response } from "express";
import { HttpResponse } from "@/core/http/response";
import { Pagination } from "@/core/http/pagination";
import type { ListCategoriesUseCase, GetCategoryBySlugUseCase, CreateCategoryUseCase, UpdateCategoryUseCase, DeleteCategoryUseCase } from "../../application/use-cases/category.use-cases";

export class CategoryController {
  constructor(private readonly list: ListCategoriesUseCase, private readonly getBySlug: GetCategoryBySlugUseCase, private readonly create: CreateCategoryUseCase, private readonly update: UpdateCategoryUseCase, private readonly remove: DeleteCategoryUseCase) {}
  getAll = async (req: Request, res: Response, next: NextFunction) => { try { const { page, limit } = Pagination.parse(req.query as Record<string, unknown>); return HttpResponse.success(res, await this.list.execute(page, limit), "Categories retrieved successfully."); } catch (e) { next(e); } };
  getOne = async (req: Request, res: Response, next: NextFunction) => { try { return HttpResponse.success(res, await this.getBySlug.execute(String(req.params.slug)), "Category retrieved successfully."); } catch (e) { next(e); } };
  createHandler = async (req: Request, res: Response, next: NextFunction) => { try { return HttpResponse.created(res, await this.create.execute(req.body), "Category created successfully."); } catch (e) { next(e); } };
  updateHandler = async (req: Request, res: Response, next: NextFunction) => { try { return HttpResponse.success(res, await this.update.execute(String(req.params.id), req.body), "Category updated successfully."); } catch (e) { next(e); } };
  deleteHandler = async (req: Request, res: Response, next: NextFunction) => { try { return HttpResponse.success(res, await this.remove.execute(String(req.params.id)), "Category deleted successfully."); } catch (e) { next(e); } };
}
