import { Request, Response, NextFunction } from "express";
import { verifyAccessToken as verifyJwt } from "../utils/security/jwt.utils";
import { ForbiddenError, UnauthorizedError } from "../utils/common/error.utils";
import { Role } from "../modules/users/user.types";

export const verifyAccessToken = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new UnauthorizedError("No token provided"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyJwt(token);
    req.user = { id: decoded.id, role: decoded.role as Role };
    next();
  } catch {
    next(new UnauthorizedError("Invalid or expired token"));
  }
};

export const authorize = (...roles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError("Not authenticated"));
    }

    if (!roles.includes(req.user.role as Role)) {
      return next(new ForbiddenError("Insufficient permissions"));
    }

    next();
  };
