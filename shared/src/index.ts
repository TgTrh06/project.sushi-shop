export * from "./config/reservation.config";
export * from "./config/seat-map.config";
export * from "./schemas/auth.schema";
export * from "./schemas/category.schema";
export * from "./schemas/product.schema";
export * from "./schemas/reservation.schema";
export * from "./schemas/review.schema";
export * from "./schemas/stats.schema";
export * from "./schemas/user.schema";

export interface ApiResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  details?: unknown;
}
