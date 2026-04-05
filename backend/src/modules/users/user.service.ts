import UserRepository from "./user.repository";
import { type SafeUser, UserEntity } from "./user.model";
import { UpdateUserFormValues } from "@shared/schemas/auth.schema";
import { BadRequestError, NotFoundError } from "@/utils/common/error.utils";
import { PaginationResult, PaginationUtils } from "@/utils/common/pagination.utils";
import { hashPassword } from "@/utils/security/bcrypt.utils";

function sanitizeUser(user: UserEntity): SafeUser {
  const { hashedPassword, ...safeUser } = user;
  return safeUser;
}

export default class UserService {
  private userRepo = new UserRepository();


  /* CUSTOMER SERVICE */
  async getUserById(id: string): Promise<SafeUser> {
    const user = await this.userRepo.findById(id);

    if (!user) throw new NotFoundError("User not found");

    return sanitizeUser(user);
  }

  async updateProfile(id: string, dto: UpdateUserFormValues): Promise<SafeUser> {
    const existingUser = await this.userRepo.findById(id);
    if (!existingUser) throw new NotFoundError("User not found");

    const updateData: any = { ...dto };

    if (dto.password) {
      // Hash the new password before saving
      updateData.hashedPassword = await hashPassword(dto.password);
      delete updateData.password; // Remove plain password from update data
    }
    
    const updatedUser = await this.userRepo.update(id, updateData);
    if (!updatedUser) throw new BadRequestError("Failed to update user");

    return sanitizeUser(updatedUser);
  }

  /* ADMIN SERVICES */
  async getAllUsers(
    page: number,
    limit: number,
    offset: number,
  ): Promise<PaginationResult<SafeUser>> {
    const { docs, total } = await this.userRepo.findPaginated(limit, offset);

    const safeData = docs.map(sanitizeUser);

    return PaginationUtils.format(safeData, total, page, limit);
  }

  async deleteUser(targetId: string, currentUserId: string): Promise<void> {
    const existingUser = await this.userRepo.findById(targetId);
    if (!existingUser) throw new NotFoundError("User not found");

    if (targetId === currentUserId) {
      throw new BadRequestError("You cannot delete your own admin account");
    }

    if (existingUser.role === "admin") {
      throw new BadRequestError("Cannot delete other admin users");
    }

    await this.userRepo.delete(targetId);
  }
}
