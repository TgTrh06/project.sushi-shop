import type { NextFunction, Request, Response } from "express";
import { HttpResponse } from "@/core/http/response";
import { Pagination } from "@/core/http/pagination";
import type { CreateReviewUseCase, ListProductReviewsUseCase, ListAdminReviewsUseCase, DeleteReviewUseCase } from "../../application/use-cases/review.use-cases";

export class ReviewController {
  constructor(private readonly create: CreateReviewUseCase, private readonly productReviews: ListProductReviewsUseCase, private readonly adminReviews: ListAdminReviewsUseCase, private readonly remove: DeleteReviewUseCase) {}
  getProduct = async (req: Request, res: Response, next: NextFunction) => { try { const { page, limit } = Pagination.parse(req.query as Record<string, unknown>, 50); return HttpResponse.success(res, await this.productReviews.paginated(String(req.params.id), page, limit), "Reviews retrieved successfully."); } catch (e) { next(e); } };
  getAll = async (req: Request, res: Response, next: NextFunction) => { try { const { page, limit } = Pagination.parse(req.query as Record<string, unknown>); const sortOrder = req.query.sortOrder === "asc" ? "asc" : "desc"; return HttpResponse.success(res, await this.adminReviews.execute(page, limit, req.query.email as string | undefined, req.query.date as string | undefined, sortOrder), "Reviews retrieved successfully."); } catch (e) { next(e); } };
  createHandler = async (req: Request, res: Response, next: NextFunction) => { try { return HttpResponse.created(res, await this.create.execute({ ...req.body, userId: req.user!.id }), "Review added successfully."); } catch (e) { next(e); } };
  deleteHandler = async (req: Request, res: Response, next: NextFunction) => { try { return HttpResponse.success(res, await this.remove.execute(String(req.params.id), req.user!.id, req.user!.role === "admin"), "Review deleted successfully."); } catch (e) { next(e); } };
}
