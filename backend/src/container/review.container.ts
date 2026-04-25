import ReviewController from "@/modules/reviews/review.controller";
import ReviewRepository from "@/modules/reviews/review.repository";
import ReviewService from "@/modules/reviews/review.service";

const reviewRepo = new ReviewRepository();

export const reviewService = new ReviewService(reviewRepo);
export const reviewController = new ReviewController(reviewService);
