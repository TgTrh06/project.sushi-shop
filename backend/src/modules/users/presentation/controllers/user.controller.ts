import type { NextFunction, Request, Response } from "express";
import { HttpResponse } from "@/core/http/response";
import { Pagination } from "@/core/http/pagination";
import type { GetUserUseCase } from "../../application/use-cases/get-user.use-case";
import type { UpdateProfileUseCase } from "../../application/use-cases/update-profile.use-case";
import type { ChangePasswordUseCase } from "../../application/use-cases/change-password.use-case";
import type { ListUsersUseCase } from "../../application/use-cases/list-users.use-case";
import type { DeleteUserUseCase } from "../../application/use-cases/delete-user.use-case";

export class UserController {
  constructor(
    private readonly getUser: GetUserUseCase,
    private readonly updateProfile: UpdateProfileUseCase,
    private readonly changePassword: ChangePasswordUseCase,
    private readonly listUsers: ListUsersUseCase,
    private readonly deleteUser: DeleteUserUseCase,
  ) {}

  getMe = async (req: Request, res: Response, next: NextFunction) => {
    try { return HttpResponse.success(res, await this.getUser.execute(req.user!.id), "Profile retrieved successfully."); } catch (error) { next(error); }
  };
  update = async (req: Request, res: Response, next: NextFunction) => {
    try { return HttpResponse.success(res, await this.updateProfile.execute(req.user!.id, req.body), "Profile updated successfully."); } catch (error) { next(error); }
  };
  changePasswordHandler = async (req: Request, res: Response, next: NextFunction) => {
    try { await this.changePassword.execute(req.user!.id, req.body); return HttpResponse.success(res, null, "Password changed successfully."); } catch (error) { next(error); }
  };
  getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try { const { page, limit } = Pagination.parse(req.query as Record<string, unknown>); return HttpResponse.success(res, await this.listUsers.execute("customers", page, limit), "Users retrieved successfully."); } catch (error) { next(error); }
  };
  getStaffs = async (req: Request, res: Response, next: NextFunction) => {
    try { const { page, limit } = Pagination.parse(req.query as Record<string, unknown>); return HttpResponse.success(res, await this.listUsers.execute("staff", page, limit), "Users retrieved successfully."); } catch (error) { next(error); }
  };
  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try { return HttpResponse.success(res, await this.getUser.execute(String(req.params.id)), "User retrieved successfully."); } catch (error) { next(error); }
  };
  delete = async (req: Request, res: Response, next: NextFunction) => {
    try { await this.deleteUser.execute(String(req.params.id), req.user!.id); return HttpResponse.success(res, null, "User deleted successfully."); } catch (error) { next(error); }
  };
}
