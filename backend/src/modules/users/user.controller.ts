import { Request, Response, NextFunction } from "express";
import { ResponseHandler } from "../../utils/common/response.utils";
import UserService from "./user.service";
import { PaginationUtils } from "../../utils/common/pagination.utils";

export default class UserController {
  private static readonly userService = new UserService();

  // =========================================================
  // API CUSTOMER (For USER to manage)
  // NEED to be VERIFIED through "verifyToken"
  // =========================================================

  // GET /users/me
  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const safeUser = await this.userService.getUserById(req.user!.id);

      return ResponseHandler.success(
        res,
        safeUser,
        "Profile retrieved successfully.",
      );
    } catch (error) {
      next(error);
    }
  }

  // PUT /users/me
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const newProfile = await this.userService.updateProfile(
        req.user!.id,
        req.body,
      );

      return ResponseHandler.success(
        res,
        newProfile,
        "User updated successfully.",
      );
    } catch (error) {
      next(error);
    }
  }

  // =========================================================
  // API ADMIN (For ADMIN to manage)
  // NEED to be VERIFIED through "verifyToken" & "verifyAdmin"
  // =========================================================

  // GET /admin/users
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, offset } = PaginationUtils.extract(req.query);

      const paginatedUsers = await this.userService.getAllUsers(page, limit, offset);

      return ResponseHandler.success(
        res,
        paginatedUsers,
        "Users retrieved successfully.",
      );
    } catch (error) {
      next(error);
    }
  }

  // GET /admin/users/:id
  static async getOneById(req: Request, res: Response, next: NextFunction) {
    try {
      const safeUser = await this.userService.getUserById(String(req.params.id));

      return ResponseHandler.success(
        res,
        safeUser,
        "User retrieved successfully.",
      );
    } catch (error) {
      next(error);
    }
  }

  // DELETE /admin/users/:id
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const targetId = String(req.params.id);
      const currentAdminId = req.user!.id;

      await this.userService.deleteUser(targetId, currentAdminId);
      return ResponseHandler.success(res, null, "User deleted successfully.");
    } catch (error) {
      next(error);
    }
  }
}
