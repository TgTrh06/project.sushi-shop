import AuthService from "./auth.service";
import { Request, Response, NextFunction } from "express";
import { ResponseHandler } from "../../utils/common/response";
import { LoginUserDTO, RegisterUserDTO } from "../users/user.types";
import JwtUtils from "../../utils/security/jwt";

const authService = new AuthService();

export default class AuthController {
  static async register(
    req: Request<{}, {}, RegisterUserDTO>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { token, user } = await authService.register(req.body);

      JwtUtils.setCookies(res, token);

      return ResponseHandler.created(res, { user }, "User registered successfully.");
    } catch (error) {
      next(error);
    }
  }

  static async login(
    req: Request<{}, {}, LoginUserDTO>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { token, user } = await authService.login(req.body);

      JwtUtils.setCookies(res, token);

      return ResponseHandler.success(res, { user }, "Login successful");
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