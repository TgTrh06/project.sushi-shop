export type Role = "user" | "admin";

// Business Entity
export interface UserEntity {
  id: string;
  username: string;
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
}

export type SafeUser = Omit<UserEntity, "password">;

// Database shape (Mongoose Document)
export interface UserDocument extends Omit<UserEntity, "id"> {}
