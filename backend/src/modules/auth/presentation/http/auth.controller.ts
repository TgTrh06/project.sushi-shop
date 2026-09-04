import type { NextFunction, Request, Response } from "express";
import { HttpResponse } from "@/core/http/response";
import { REFRESH_TOKEN_NAME, setRefreshCookie, clearRefreshCookie } from "@/core/security/refresh-cookie";
import type { RegisterUserUseCase } from "../../application/use-cases/register-user.use-case";
import type { LoginUserUseCase } from "../../application/use-cases/login-user.use-case";
import type { RefreshSessionUseCase } from "../../application/use-cases/refresh-session.use-case";
import type { LogoutUserUseCase } from "../../application/use-cases/logout-user.use-case";
import { UnauthorizedError } from "@/core/errors";

export class AuthController {
  constructor(
    private readonly registerUser: RegisterUserUseCase,
    private readonly loginUser: LoginUserUseCase,
    private readonly refreshSession: RefreshSessionUseCase,
    private readonly logoutUser: LogoutUserUseCase,
  ) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.registerUser.execute(req.body);
      setRefreshCookie(res, result.refreshToken);
      return HttpResponse.created(res, { accessToken: result.accessToken, user: result.user }, "User registered successfully.");
    } catch (error) { next(error); }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.loginUser.execute(req.body);
      setRefreshCookie(res, result.refreshToken);
      return HttpResponse.success(res, { accessToken: result.accessToken, user: result.user }, "Login successful");
    } catch (error) { next(error); }
  };

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies?.[REFRESH_TOKEN_NAME];
      if (!token) throw new UnauthorizedError("No refresh token");
      const result = await this.refreshSession.execute(token);
      setRefreshCookie(res, result.refreshToken);
      return HttpResponse.success(res, { accessToken: result.accessToken }, "Token refreshed");
    } catch (error) { next(error); }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.logoutUser.execute(req.cookies?.[REFRESH_TOKEN_NAME]);
      clearRefreshCookie(res);
      return HttpResponse.success(res, null, "Logout successful");
    } catch (error) { next(error); }
  };
}
