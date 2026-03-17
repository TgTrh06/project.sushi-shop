import jwt from "jsonwebtoken";
import { env } from "../config/env.config";
import { Request, Response, NextFunction } from "express";
import { ForbiddenError, UnauthorizedError } from "../utils/common/errors";

export interface JwtPayload {
  id: string;
  role: string;
}

export const verifyToken = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const token =
      req.cookies?.token || req.headers?.authorization?.split(" ")[1];
    if (!token) {
      return next(
        new UnauthorizedError(
          "Session expired or not found. Please log in again.",
        ),
      );
    }

    const decoded = jwt.verify(token, env.JWT_SECRET as string) as JwtPayload;
    if (!decoded) {
      return next(new UnauthorizedError("Invalid token"));
    }

    req.user = decoded;
    next();
  } catch (error) {
    return next(new UnauthorizedError("Invalid token"));
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