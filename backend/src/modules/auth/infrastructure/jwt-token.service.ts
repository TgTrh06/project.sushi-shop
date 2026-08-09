import jwt from "jsonwebtoken";
import { hashToken } from "@/core/security/token-hash";
import { env } from "@/core/config/env.config";
import type { Role } from "@/modules/users/domain/entities/role";
import type { TokenService } from "../domain/ports/token-service.port";

export class JwtTokenService implements TokenService {
  createAccessToken(payload: { id: string; role: Role }) {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
  }
  createRefreshToken(payload: { id: string }) {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
  }
  verifyAccessToken(token: string) { return jwt.verify(token, env.JWT_ACCESS_SECRET) as { id: string; role: string }; }
  verifyRefreshToken(token: string) { return jwt.verify(token, env.JWT_REFRESH_SECRET) as { id: string }; }
  hashRefreshToken(token: string) { return hashToken(token); }
}
