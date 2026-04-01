import { Role } from "../../config/constants/role";

export interface User {
  id: string;
  username: string;
  email: string;
  role: Role;
};