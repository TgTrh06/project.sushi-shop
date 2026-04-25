import { NextFunction, Request, Response } from "express";
import ReviewService from "./review.service";
import { ResponseHandler } from "@/utils/common/response.util";
import type { CreateReviewDTO } from "./review.types";
import { GetByIdParams } from "@/types/params.type";
import { BadRequestError } from "@/utils/common/error.util";

export default class ReviewController {
  constructor(private readonly reviewService: ReviewService) { }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const reviewData: CreateReviewDTO = {
        ...req.body,
        userId,
      };

      const result = await this.reviewService.addReview(reviewData);
      return ResponseHandler.created(res, result, "Review added successfully.");
    } catch (error) {
      next(error);
    }
  };

  getByProduct = async (req: Request<GetByIdParams>, res: Response, next: NextFunction) => {
    try {
      const { id: productId } = req.params;
      const result = await this.reviewService.getProductReviews(productId);
      return ResponseHandler.success(res, result, "Reviews retrieved successfully.");
    } catch (error) {
      next(error);
    }
  };

  getByProductPaginated = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId, page = "1", limit = "5" } = req.query;
      
      if (!productId || typeof productId !== "string") {
        return new BadRequestError("productId query parameter is required.");
      }

      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);

      const result = await this.reviewService.getProductReviewsPaginated(productId, pageNum, limitNum);
      return ResponseHandler.success(res, result, "Reviews retrieved successfully.");
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request<GetByIdParams>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      const isAdmin = (req as any).user.role === "admin";

      const result = await this.reviewService.deleteReview(id, userId, isAdmin);
      return ResponseHandler.success(res, result, "Review deleted successfully.");
    } catch (error) {
      next(error);
    }
  };
}
