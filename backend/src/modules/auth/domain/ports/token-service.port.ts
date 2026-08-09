import type { Role } from "@/modules/users/domain/entities/role";

export interface TokenService {
  createAccessToken(payload: { id: string; role: Role }): string;
  createRefreshToken(payload: { id: string }): string;
  verifyAccessToken(token: string): { id: string; role: string };
  verifyRefreshToken(token: string): { id: string };
  hashRefreshToken(token: string): string;
}
