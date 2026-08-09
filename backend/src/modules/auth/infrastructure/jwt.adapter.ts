import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "@/utils/security/jwt.util";
import type { TokenService } from "../domain/ports/auth.ports";

export class JwtTokenService implements TokenService {
  generateAccessToken(payload: { id: string; role: string }): string {
    return generateAccessToken(payload);
  }

  generateRefreshToken(payload: { id: string }): string {
    return generateRefreshToken(payload);
  }

  verifyRefreshToken(token: string): { id: string } {
    return verifyRefreshToken(token);
  }
}
