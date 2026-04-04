import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import { setRefreshCookie, clearRefreshCookie } from "../../utils/security/jwt.utils";
import { REFRESH_TOKEN_NAME } from "../../config/cookie.config";
import { UnauthorizedError } from "../../utils/common/error.utils";
import { ResponseHandler } from "../../utils/common/response.utils";

export class AuthController {
  private static authService = new AuthService();

  // POST /auth/register
  static register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.register(req.body);

      setRefreshCookie(res, result.refreshToken);

      return ResponseHandler.created(res, { 
        accessToken: result.accessToken, 
        user: result.user 
      }, "User registered successfully.");
    } catch (error) {
      next(error);
    }
  }

  // POST /auth/login
  static login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.login(req.body);

      setRefreshCookie(res, result.refreshToken);

      return ResponseHandler.success(res, { 
        accessToken: result.accessToken, 
        user: result.user 
      }, "Login successful");
    } catch (error) {
      next(error);
    }
  }

  // POST /auth/refresh
  static refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token: string | undefined = req.cookies[REFRESH_TOKEN_NAME];
      if (!token) {
        return next(new UnauthorizedError("No refresh token"));
      }

      const { accessToken, refreshToken: newRefreshToken } = await this.authService.refresh(token);

      setRefreshCookie(res, newRefreshToken);

      return ResponseHandler.success(res, { accessToken }, "Token refreshed");
    } catch (error) {
      next(error);
    }
  }

  // POST /auth/logout
  static logout = async (req: Request, res: Response, next: NextFunction) =>  {
    try {
      const token: string = req.cookies[REFRESH_TOKEN_NAME];

      await this.authService.logout(token);

      clearRefreshCookie(res);

      return ResponseHandler.success(res, null, "Logout successful");
    } catch (error) {
      next(error);
    }
  }
}
