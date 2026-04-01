import { Request, Response, NextFunction } from "express";
import { ResponseHandler } from "../../utils/common/response.utils";
import UserService from "./user.service";
import { PaginationUtils } from "../../utils/common/pagination.utils";

const userService = new UserService();

export default class UserController {

  // =========================================================
  // API CUSTOMER (For USER to manage) 
  // NEED to be VERIFIED through "verifyToken"
  // =========================================================
  
  // GET /users/me
  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const safeUser = await userService.getUserById(req.user!.id);

      return ResponseHandler.success(res, safeUser, "Profile retrieved successfully.");
    } catch (error) {
      next(error);
    }
  }

  // PUT /users/me
  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const safeUser = await userService.updateProfile(req.user!.id, req.body);

      return ResponseHandler.success(res, safeUser, "User updated successfully.")
    } catch (error) {
      next(error);
    }
  }  

  // =========================================================
  // API ADMIN (For ADMIN to manage) 
  // NEED to be VERIFIED through "verifyToken" & "verifyAdmin"
  // =========================================================

  // GET /admin/users
  static async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, offset } = PaginationUtils.extract(req.query);

      const paginatedUsers = await userService.getAllUsers(page, limit, offset);
      
      return ResponseHandler.success(res, paginatedUsers, "Users retrieved successfully.")
    } catch (error) {
      next(error);
    }
  }

  // GET /admin/users/:id
  static async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const safeUser = await userService.getUserById(String(req.params.id));

      return ResponseHandler.success(res, safeUser, "User retrieved successfully.")
    } catch (error) {
      next(error);
    }
  }

  // DELETE /admin/users/:id
  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const targetId = String(req.params.id);
      const currentAdminId = req.user!.id

      await userService.deleteUser(targetId, currentAdminId);
      return ResponseHandler.success(res, null, "User deleted successfully.")
    } catch (error) {
      next(error);
    }
  }
}