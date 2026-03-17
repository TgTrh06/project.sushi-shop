import UserRepository from "../repositories/user.repository";
import {
  UserEntity,
  UpdateUserDTO,
} from "../models/user/user.types";
import {
  BadRequestError,
  NotFoundError,
} from "../utils/common/errors";

export default class UserService {
  private repo = new UserRepository();

  /* 
    CUSTOMER SERVICE
  */ 
  async getUserById(id: string): Promise<UserEntity> {
    const user = await this.repo.findById(id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }

  async updateUser(id: string, dto: UpdateUserDTO): Promise<UserEntity> {
    const existingUser = await this.repo.findById(id);
    if (!existingUser) {
      throw new NotFoundError("User not found");
    }

    const updatedUser = await this.repo.update(id, dto);
    if (!updatedUser) {
      throw new BadRequestError("Failed to update user");
    }

    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    const existingUser = await this.repo.findById(id);
    if (!existingUser) {
      throw new NotFoundError("User not found");
    }

    if (existingUser.role === "admin") {
      throw new BadRequestError("Cannot delete admin users");
    }

    await this.repo.delete(id);
  }

  /*
    ADMIN SERVICES
  */
  async getAllUsers(): Promise<UserEntity[]> {
    return await this.repo.findAll();
  }
}
