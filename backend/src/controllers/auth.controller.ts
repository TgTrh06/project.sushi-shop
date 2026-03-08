import { AuthService } from "../services/auth.service";
import { Request, Response, NextFunction } from "express";
import { ResponseHandler } from "../utils/response.utils";
import { LoginDTO } from "../models/user/user.types";

const authService = new AuthService();

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.register(req.body);
      return ResponseHandler.created(res, user, "User registered successfully.");
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const loginDto: LoginDTO = req.body;
      const token = await authService.login(loginDto);
      return ResponseHandler.success(res, { token }, "Login successful");
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    
  }
}