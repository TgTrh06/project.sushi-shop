// Business Entity
export interface User extends Document {
  id: string;
  username: string;
  email: string;
  password: string;
  role: "customer" | "admin";
  createdAt: Date;
}

// DTOs
export interface CreateUserDTO extends Pick<
  User,
  "username" | "email" | "password"
> {}

export interface UpdateUserDTO extends Partial<CreateUserDTO> {
  role?: User["role"];
}

// Database shape (Mongoose Document)
export interface UserDocument extends Omit<User, "id"> {}