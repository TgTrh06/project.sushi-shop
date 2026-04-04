import UserRepository from "./user.repository";
import { SafeUser, UserEntity } from "./user.model";
import { UpdateUserInput } from "@shared/schemas/auth.schema";
import { BadRequestError, NotFoundError } from "@/utils/common/error.utils";
import { PaginationResult, PaginationUtils } from "@/utils/common/pagination.utils";

function sanitizeUser(user: UserEntity): SafeUser {
  const { hashedPassword, ...safeUser } = user;
  return safeUser;
}

export default class UserService {
  private repo = new UserRepository();

  /* CUSTOMER SERVICE */
  async getUserById(id: string): Promise<SafeUser> {
    const user = await this.repo.findById(id);

    if (!user) throw new NotFoundError("User not found");

    return sanitizeUser(user);
  }

  async updateProfile(id: string, dto: UpdateUserInput): Promise<SafeUser> {
    const existingUser = await this.repo.findById(id);
    if (!existingUser) throw new NotFoundError("User not found");

    const updatedUser = await this.repo.update(id, dto);
    if (!updatedUser) throw new BadRequestError("Failed to update user");

    return sanitizeUser(updatedUser);
  }

  /* ADMIN SERVICES */
  async getAllUsers(
    page: number,
    limit: number,
    offset: number,
  ): Promise<PaginationResult<SafeUser>> {
    const { docs, total } = await this.repo.findPaginated(limit, offset);

    const safeData = docs.map(sanitizeUser);

    return PaginationUtils.format(safeData, total, page, limit);
  }

  async deleteUser(targetId: string, currentUserId: string): Promise<void> {
    const existingUser = await this.repo.findById(targetId);
    if (!existingUser) throw new NotFoundError("User not found");

    if (targetId === currentUserId) {
      throw new BadRequestError("You cannot delete your own admin account");
    }

    if (existingUser.role === "admin") {
      throw new BadRequestError("Cannot delete other admin users");
    }

    await this.repo.delete(targetId);
  }
}
