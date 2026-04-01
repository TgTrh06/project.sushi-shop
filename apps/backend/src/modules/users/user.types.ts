import { IsNotEmpty, IsOptional, IsString } from "class-validator";

// Business Entity
export interface UserEntity {
  id: string;
  username: string;
  email: string;
  password: string;
  role: "customer" | "admin";
  createdAt: Date;
}

export type SafeUser = Omit<UserEntity, "password">;

// Database shape (Mongoose Document)
export interface UserDocument extends Omit<UserEntity, "id"> {}

// DTOs
export class LoginUserDTO {
  @IsString()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
export class RegisterUserDTO {
  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsString()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class UpdateUserDTO {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  password?: string;
}
