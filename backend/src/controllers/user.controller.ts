import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { successHandler } from "../common/response";

const userService = new UserService();

export class UserController {
  static async getAllUsers(_req: Request, res: Response, next: Function) {
    try {
      const users = await userService.getAllUsers();
      return res.status(200).json(successHandler(200, "Users retrieved successfully.", users));
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req: Request, res: Response, next: Function) {
    try {
      const user = await userService.getUserById(String(req.params.id));
      return res.status(200).json(successHandler(200, "User retrieved successfully.", user));
    } catch (error) {
      next(error);
    }
  }

  static async register(req: Request, res: Response, next: Function) {
    try {
      const user = await userService.register(req.body);
      return res.status(201).json(successHandler(201, "User registered successfully.", user));
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req: Request, res: Response, next: Function) {
    try {
      const user = await userService.updateUser(
        String(req.params.id),
        req.body,
      );
      return res.status(200).json(successHandler(200, "User updated successfully.", user));
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req: Request, res: Response, next: Function) {
    try {
      await userService.deleteUser(String(req.params.id));
      return res.status(200).json(successHandler(200, "User deleted successfully."));
    } catch (error) {
      next(error);
    }
  }
}