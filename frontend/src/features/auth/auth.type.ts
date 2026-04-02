import { Role } from "../../constants/role";

export type User = {
  id: string;
  username: string;
  email: string;
  role: Role;
};

export type AuthResponse = {
  accessToken: string;
  user: User;
};