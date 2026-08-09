import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import { setRefreshCookie, clearRefreshCookie } from "../../utils/security/jwt.util";
import { REFRESH_TOKEN_NAME } from "../../config/cookie.config";
import { UnauthorizedError } from "../../utils/common/error.util";
import { ResponseHandler } from "../../utils/common/response.util";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.register(req.body);
      setRefreshCookie(res, result.refreshToken);
      return ResponseHandler.created(res, {
        accessToken: result.accessToken,
        user: result.user,
      }, "User registered successfully.");
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.login(req.body);
      setRefreshCookie(res, result.refreshToken);
      return ResponseHandler.success(res, {
        accessToken: result.accessToken,
        user: result.user,
      }, "Login successful");
    } catch (error) {
      next(error);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token: string | undefined = req.cookies[REFRESH_TOKEN_NAME];
      if (!token) return next(new UnauthorizedError("No refresh token"));

      const { accessToken, refreshToken } = await this.authService.refresh(token);
      setRefreshCookie(res, refreshToken);
      return ResponseHandler.success(res, { accessToken }, "Token refreshed");
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.authService.logout(req.cookies[REFRESH_TOKEN_NAME]);
      clearRefreshCookie(res);
      return ResponseHandler.success(res, null, "Logout successful");
    } catch (error) {
      next(error);
    }
  };
}
