import type { NextFunction, Request, Response } from "express";
import { Role } from "@/modules/users/domain/entities/role";
import { ForbiddenError, UnauthorizedError } from "@/core/errors";
import type { TokenService } from "@/modules/auth/domain/ports/token-service.port";

export function createAuthMiddleware(tokenService: TokenService) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const value = req.headers.authorization;
    if (!value?.startsWith("Bearer ")) {
      next(new UnauthorizedError("No token provided"));
      return;
    }

    try {
      const payload = tokenService.verifyAccessToken(value.slice(7));
      req.user = { id: payload.id, role: payload.role as Role };
      next();
    } catch {
      next(new UnauthorizedError("Invalid or expired token"));
    }
  };
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) {
    next(new UnauthorizedError("Not authenticated"));
    return;
  }
  if (req.user.role !== Role.ADMIN) {
    next(new ForbiddenError("Insufficient permissions"));
    return;
  }
  next();
}
