import type { ErrorRequestHandler } from "express";
import { env } from "@/core/config/env.config";
import { AppError } from "@/core/errors";
import { logger } from "@/core/logging/logger";

export const errorMiddleware: ErrorRequestHandler = (error, req, res, _next) => {
  const appError = error instanceof AppError ? error : new AppError("Internal Server Error", 500, false);
  logger[appError.statusCode >= 500 ? "error" : "warn"]("HTTP request failed", {
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    method: req.method,
    path: req.path,
  });

  res.status(appError.statusCode).json({
    success: false,
    message: appError.statusCode >= 500 ? "Internal Server Error" : appError.message,
    ...(env.NODE_ENV === "development" && { stack: error instanceof Error ? error.stack : undefined }),
  });
};
