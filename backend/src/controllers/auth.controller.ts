import { AuthService } from "../services/auth.service";
import { Request, Response, NextFunction } from "express";
import { ResponseHandler } from "../utils/response.utils";
import { LoginDTO, RegisterUserDTO } from "../models/user/user.types";
import JwtUtils from "../utils/jwt";

const authService = new AuthService();

export class AuthController {
  static async register(
    req: Request<{}, {}, RegisterUserDTO>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = await authService.register(req.body);
      return ResponseHandler.created(res, user, "User registered successfully.");
    } catch (error) {
      next(error);
    }
  }

  static async login(
    req: Request<{}, {}, LoginDTO>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const token = await authService.login(req.body);
      JwtUtils.setCookies(res, token);
      return ResponseHandler.success(res, { token }, "Login successful");
    } catch (error) {
      next(error);
    }
  }

  static async logout(_req: Request, res: Response, next: NextFunction) {
    try {
      JwtUtils.clearCookies(res);
      return ResponseHandler.success(res, null, "Logout successful");
    } catch (error) {
      next(error);
    }
  }
}