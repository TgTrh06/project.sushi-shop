import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AuthService } from "../services/auth.service";
import { Request, Response, NextFunction } from "express";
import { ForbiddenError, UnauthorizedError } from "../utils/common/errors";

interface JwtPayload {
  id: string;
  role: string;
}

const service = new AuthService();

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

    const user = await service.getUserById(decoded.id);
    if (!user) {
      return next(new UnauthorizedError("User not found"));
    }

    req.user = user;
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