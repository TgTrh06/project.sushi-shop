import type { Role } from "@itsu-sushi/shared/schemas/user.schema";
import type { SafeUser } from "@/modules/users/domain/entities/user.entity";

export interface RegisterUserInput {
  email: string;
  username: string;
  password: string;
}

export interface LoginUserInput {
  email: string;
  password: string;
}

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: SafeUser;
}

export interface AccessTokenPayload {
  id: string;
  role: Role;
}
