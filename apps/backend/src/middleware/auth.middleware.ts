import jwt from "jsonwebtoken";
import { env } from "../config/env.config";
import { Request, Response, NextFunction } from "express";
import { ForbiddenError, UnauthorizedError } from "../utils/common/error.utils";
import { TOKEN_NAME } from "../config/cookie.config";
import { JwtPayload } from "../types/jwt.type";

export const verifyToken = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.[TOKEN_NAME] || req.headers?.authorization?.split(" ")[1];
    
    if (!token) {
      throw new UnauthorizedError("Session expired or not found. Please log in again.");
    }

    const decoded = jwt.verify(token, env.JWT_SECRET as string) as JwtPayload;

    req.user = decoded;
    next();
  } catch (error) {
    return next(new UnauthorizedError("Invalid or expired token."));
  }
};

export const verifyAdmin = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  if (!req.user || req.user.role !== "admin") {
    return next(new ForbiddenError("Forbiden: Admin only"));
  }
  next();
};