import UserRepository from "./user.repository";
import { type SafeUser, UserEntity } from "./user.model";
import { UpdateUserFormValues, ChangePasswordFormValues } from "@shared/schemas/user.schema";
import { BadRequestError, NotFoundError, UnauthorizedError } from "@/utils/common/error.util";
import { PaginationResult, PaginationUtils } from "@/utils/common/pagination.util";
import { hashPassword, comparePassword } from "@/utils/security/bcrypt.util";
import * as cloudinaryService from "@/modules/upload/cloudinary.service";

function sanitizeUser(user: UserEntity): SafeUser {
  const { hashedPassword, ...safeUser } = user;
  return safeUser;
}

export default class UserService {
  constructor(private readonly userRepo: UserRepository) {};

  /* CUSTOMER SERVICE */

  async getUserById(id: string): Promise<SafeUser> {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundError("User not found");
    return sanitizeUser(user);
  }

  async updateProfile(id: string, dto: UpdateUserFormValues): Promise<SafeUser> {
    const existingUser = await this.userRepo.findById(id);
    if (!existingUser) throw new NotFoundError("User not found");

    // Handle avatar cleanup if avatar_id is being replaced
    if (dto.avatar_id && dto.avatar_id !== existingUser.avatar_id && existingUser.avatar_id) {
      try {
        await cloudinaryService.deleteImage(existingUser.avatar_id);
      } catch (error) {
        console.error("Failed to delete old avatar from Cloudinary:", error);
      }
    }

    const updatedUser = await this.userRepo.update(id, dto);
    if (!updatedUser) throw new BadRequestError("Failed to update profile");

    return sanitizeUser(updatedUser);
  }

  async changePassword(id: string, dto: ChangePasswordFormValues): Promise<void> {
    // Fetch user with password included
    const user = await this.userRepo.findByIdWithPassword(id);
    if (!user) throw new NotFoundError("User not found");

    // Verify current password
    const isMatch = await comparePassword(dto.currentPassword, user.hashedPassword);
    if (!isMatch) throw new UnauthorizedError("Current password is incorrect");

    // Hash and save new password + stamp the timestamp
    const hashedPassword = await hashPassword(dto.newPassword);
    await this.userRepo.update(id, { hashedPassword, passwordLastUpdated: new Date() } as any);
  }

  /* ADMIN SERVICES */

  async getUsers(page: number, limit: number, offset: number): Promise<PaginationResult<SafeUser>> {
    const { docs, total } = await this.userRepo.findUsers(limit, offset);
    return PaginationUtils.format(docs.map(sanitizeUser), total, page, limit);
  }

  async getStaffs(page: number, limit: number, offset: number): Promise<PaginationResult<SafeUser>> {
    const { docs, total } = await this.userRepo.findStaffs(limit, offset);
    return PaginationUtils.format(docs.map(sanitizeUser), total, page, limit);
  }

  async delete(targetId: string, currentUserId: string): Promise<void> {
    const existingUser = await this.userRepo.findById(targetId);
    if (!existingUser) throw new NotFoundError("User not found");

    if (targetId === currentUserId) {
      throw new BadRequestError("You cannot delete your own admin account");
    }

    if (existingUser.role === "admin") {
      throw new BadRequestError("Cannot delete other admin users");
    }

    if (existingUser.avatar_id) {
      try {
        await cloudinaryService.deleteImage(existingUser.avatar_id);
      } catch (error) {
        console.error("Failed to delete user avatar from Cloudinary:", error);
      }
    }

    await this.userRepo.delete(targetId);
  }
}
