import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/common/logger.util";
import { env } from "@/core/config/env.config";

export const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const error = err instanceof Error ? err : new Error("Unknown error");
  const statusCode = typeof err === "object" && err !== null && "statusCode" in err
    ? Number((err as { statusCode?: number }).statusCode) || 500
    : 500;

  // Log detail error based on status code
  if (statusCode >= 500) {
    logger.error(error.message, {
      metadata: {
        stack: error.stack,
        path: req.path,
        method: req.method,
        ip: req.ip,
      }
    });
  } else {
    logger.warn(`[${statusCode}] ${error.message}`, {
      metadata: {
        path: req.path,
        method: req.method,
        ip: req.ip,
      }
    });
  }
  
  // Setup response
  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? "Internal Server Error" : error.message,
    // Only show when on dev enviroment for debugging
    ...(env.NODE_ENV === "development" && { stack: error.stack }),
  });
};
