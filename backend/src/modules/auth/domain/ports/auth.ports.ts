import type { LoginFormValues, RegisterFormValues } from "@itsu-sushi/shared/schemas/auth.schema";
import type { UserEntity } from "@/modules/users/user.model";
import type { SessionEntity } from "@/modules/auth/session.model";

export interface AuthUserRepository {
  exists(email: string): Promise<boolean>;
  create(data: Record<string, unknown>): Promise<UserEntity>;
  findByEmail(email: string, includePassword?: boolean): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
}

export interface AuthSessionRepository {
  createSession(userId: string, refreshToken: string, expiresAt: Date): Promise<SessionEntity>;
  deleteByToken(refreshToken: string): Promise<boolean>;
  consumeByToken(refreshToken: string): Promise<SessionEntity | null>;
  deleteAllByUserId(userId: string): Promise<boolean>;
}

export interface AuthCredentials {
  register(dto: RegisterFormValues): Promise<unknown>;
  login(dto: LoginFormValues): Promise<unknown>;
}

export interface PasswordHasher {
  hash(password: string): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
}

export interface TokenService {
  generateAccessToken(payload: { id: string; role: string }): string;
  generateRefreshToken(payload: { id: string }): string;
  verifyRefreshToken(token: string): { id: string };
}
