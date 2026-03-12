import { Request, Response, NextFunction } from "express";
import { ResponseHandler } from "../utils/response.utils";
import UserService from "../services/user.service";

const userService = new UserService();

export default class UserController {
  static async getAllUsers(_req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAllUsers();
      return ResponseHandler.success(res, users, "Users retrieved successfully.")
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.getUserById(String(req.params.id));
      return ResponseHandler.success(res, user, "User retrieved successfully.")
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
      return ResponseHandler.success(res, user, "User updated successfully.")
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