import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/common/logger.util";
import { env } from "../config/env.config";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const statusCode = err.statusCode || err.status || 500;

  // Log detail error based on status code
  if (statusCode >= 500) {
    logger.error(err.message, {
      metadata: {
        stack: err.stack,
        path: req.path,
        method: req.method,
        ip: req.ip,
      }
    });
  } else {
    logger.warn(`[${statusCode}] ${err.message}`, {
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
    message: statusCode === 500 ? "Internal Server Error" : err.message, // Hide error 500
    // Only show when on dev enviroment for debugging
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  });
};