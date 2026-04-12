import { Request, Response, NextFunction } from "express";
import { ResponseHandler } from "../../utils/common/response.utils";
import UserService from "./user.service";
import { PaginationParams, PaginationUtils } from "../../utils/common/pagination.utils";
import { UpdateUserFormInput } from "@shared/schemas/auth.schema";
import { GetByIdParams } from "@/types/params.type";

export default class UserController {
  constructor(private readonly userService: UserService) {};

  // =========================================================
  // API CUSTOMER (For USER to manage)
  // NEED to be VERIFIED through "verifyToken"
  // =========================================================

  // GET /users/me
  getMe = async (req: Request<{}, any, {}>, res: Response, next: NextFunction) => {
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
  update = async (req: Request<{}, any, UpdateUserFormInput>, res: Response, next: NextFunction) => {
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
  getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit, offset } = PaginationUtils.extract(req.query);

      const paginatedUsers = await this.userService.getUsers(page, limit, offset);

      return ResponseHandler.success(
        res,
        paginatedUsers,
        "Users retrieved successfully.",
      );
    } catch (error) {
      next(error);
    }
  }

  // GET /admin/staffs
  getStaffs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit, offset } = PaginationUtils.extract(req.query);

      const paginatedUsers = await this.userService.getStaffs(page, limit, offset);

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
  getOneById = async (req: Request<GetByIdParams, any, {}>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const safeUser = await this.userService.getUserById(id);

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
  delete = async (req: Request<GetByIdParams, any, {}>, res: Response, next: NextFunction) => {
    try {
      const { id: targetId } = req.params;
      const currentAdminId = req.user!.id;

      await this.userService.delete(targetId, currentAdminId);
      return ResponseHandler.success(res, null, "User deleted successfully.");
    } catch (error) {
      next(error);
    }
  }
}
