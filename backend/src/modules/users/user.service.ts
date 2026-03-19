import UserRepository from "./user.repository";
import {
  SafeUser,
  UpdateUserDTO,
} from "./user.types";
import {
  BadRequestError,
  NotFoundError,
} from "../../utils/common/error.utils";
import { sanitizeUser } from "../../utils/security/sanitize.utils";

export default class UserService {
  private repo = new UserRepository();

  /* CUSTOMER SERVICE */ 
  async getUserById(id: string): Promise<SafeUser> {
    const user = await this.repo.findById(id);

    if (!user) throw new NotFoundError("User not found");

    return sanitizeUser(user);
  }

  async updateProfile(id: string, dto: UpdateUserDTO): Promise<SafeUser> {
    const existingUser = await this.repo.findById(id);
    if (!existingUser) throw new NotFoundError("User not found");

    const updatedUser = await this.repo.update(id, dto);
    if (!updatedUser) throw new BadRequestError("Failed to update user");

    return sanitizeUser(updatedUser);
  }

  /* ADMIN SERVICES */
  async getAllUsers(): Promise<SafeUser[]> {
    const users = await this.repo.findAll();
    return users.map(sanitizeUser);
  }  

  async deleteUser(targetId: string, currentUserId: string): Promise<void> {
    const existingUser = await this.repo.findById(targetId);
    if (!existingUser) throw new NotFoundError("User not found");

    if (targetId === currentUserId) {
      throw new BadRequestError("You cannot delete your own admin account");
    };

    if (existingUser.role === "admin") {
      throw new BadRequestError("Cannot delete other admin users");
    };

    await this.repo.delete(targetId);
  }
}
