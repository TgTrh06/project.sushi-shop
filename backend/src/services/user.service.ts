import { UserRepository } from "../repositories/user.repository";
import {
  UserEntity,
  CreateUserDTO,
  UpdateUserDTO,
} from "../models/user/user.types";
import bcrypt from "bcrypt";

export class UserService {
  private repo = new UserRepository();

  async getAllUsers(): Promise<UserEntity[]> {
    return await this.repo.findAll();
  }

  async getUserById(id: string): Promise<UserEntity | null> {
    const user = await this.repo.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  async register(dto: CreateUserDTO): Promise<UserEntity> {
    if (!dto.username || !dto.email || !dto.password) {
      throw new Error("Missing required fields");
    }

    const existingUser = await this.repo.findByEmail(dto.email);
    if (existingUser) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newUser = await this.repo.create({
      ...dto,
      password: hashedPassword,
    });

    return newUser;
  }

  async login() {}

  async updateUser(id: string, dto: UpdateUserDTO): Promise<UserEntity> {
    const existingUser = await this.repo.findById(id);
    if (!existingUser) {
      throw new Error("User not found");
    }
    
    const updatedUser = await this.repo.update(id, dto);
    if (!updatedUser) {
      throw new Error("Failed to update user");
    }

    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    const existingUser = await this.repo.findById(id);
    if (!existingUser) {
      throw new Error("User not found");
    }

    if (existingUser.role === "admin") {
      throw new Error("Cannot delete admin users");
    }

    await this.repo.delete(id);
  }
}