import { Request, Response, NextFunction } from "express";
import { ResponseHandler } from "../utils/response.utils";
import UserService from "../services/user.service";

const userService = new UserService();

export default class UserController {
  static async getAllUsers(_req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAllUsers();
      const safeUsers = users.map(({ password, ...user }) => user);
      return ResponseHandler.success(res, safeUsers, "Users retrieved successfully.")
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return ResponseHandler.success(res, null, "No user logged in.");
      }

      const user = await userService.getUserById(req.user.id);
      const { password, ...safeUser } = user;
      return ResponseHandler.success(res, safeUser, "Profile retrieved successfully.");
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.getUserById(String(req.params.id));
      const { password, ...safeUser } = user;
      return ResponseHandler.success(res, safeUser, "User retrieved successfully.")
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.updateUser(
        String(req.params.id),
        req.body,
      );
      const { password, ...safeUser } = user;
      return ResponseHandler.success(res, safeUser, "User updated successfully.")
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      await userService.deleteUser(String(req.params.id));
      return ResponseHandler.success(res, "User deleted successfully.")
    } catch (error) {
      next(error);
    }
  }
}