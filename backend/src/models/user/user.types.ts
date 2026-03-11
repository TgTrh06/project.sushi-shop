// Business Entity
export interface UserEntity {
  id: string;
  username: string;
  email: string;
  password: string;
  role: "customer" | "admin";
  createdAt: Date;
}

// DTOs
export interface LoginUserDTO extends Pick<
  UserEntity,
  "email" | "password"
> {}

export interface RegisterUserDTO extends Pick<
  UserEntity,
  "username" | "email" | "password"
> {}

export interface UpdateUserDTO extends Partial<UserEntity> {
  role?: UserEntity["role"];
}

// Database shape (Mongoose Document)
export interface UserDocument extends Omit<UserEntity, "id"> {}