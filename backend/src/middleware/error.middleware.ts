import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/common/logger";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  logger.error(err.message, {
    stack: err.stack,
    path: req.path,
    method: req.method,
  });
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};