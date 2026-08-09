import type { Role } from "./role";

export interface UserEntity {
  id: string;
  username: string;
  email: string;
  role: Role;
  avatar_id?: string;
  phoneNumber?: number;
  passwordLastUpdated?: Date;
  createdAt: Date;
  hashedPassword?: string;
}

export type SafeUser = Omit<UserEntity, "hashedPassword">;

export interface NewUser {
  username: string;
  email: string;
  hashedPassword: string;
  role: Role;
}
