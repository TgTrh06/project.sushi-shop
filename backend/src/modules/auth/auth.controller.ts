import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import { setRefreshCookie, clearRefreshCookie } from "../../utils/security/jwt.utils";
import { REFRESH_TOKEN_COOKIE_NAME } from "../../config/cookie.config";
import { RegisterInputSchema, LoginInputSchema } from "@shared/schemas/auth.schema";
import { BadRequestError, UnauthorizedError } from "../../utils/common/error.utils";
import { ResponseHandler } from "../../utils/common/response.utils";

const authService = new AuthService();

export class AuthController {

  // POST /auth/register
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = RegisterInputSchema.safeParse(req.body);
      if (!parsed.success) {
        return next(new BadRequestError(parsed.error.issues.map((e: { message: string }) => e.message).join(", ")));
      }

      const { accessToken, refreshToken, user } = await authService.register(parsed.data);

      setRefreshCookie(res, refreshToken);

      return ResponseHandler.created(res, { accessToken, user }, "User registered successfully.");
    } catch (error) {
      next(error);
    }
  }

  // POST /auth/login
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = LoginInputSchema.safeParse(req.body);
      if (!parsed.success) {
        return next(new BadRequestError(parsed.error.issues.map((e: { message: string }) => e.message).join(", ")));
      }

      const { accessToken, refreshToken, user } = await authService.login(parsed.data);

      setRefreshCookie(res, refreshToken);

      return ResponseHandler.success(res, { accessToken, user }, "Login successful");
    } catch (error) {
      next(error);
    }
  }

  // POST /auth/refresh
  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const token: string | undefined = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
      if (!token) {
        return next(new UnauthorizedError("No refresh token"));
      }

      const { accessToken, refreshToken: newRefreshToken } = await authService.refresh(token);

      setRefreshCookie(res, newRefreshToken);

      return ResponseHandler.success(res, { accessToken }, "Token refreshed");
    } catch (error) {
      next(error);
    }
  }

  // POST /auth/logout
  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const token: string = req.cookies[REFRESH_TOKEN_COOKIE_NAME];

      await authService.logout(token);

      clearRefreshCookie(res);

      return ResponseHandler.success(res, null, "Logout successful");
    } catch (error) {
      next(error);
    }
  }
}
