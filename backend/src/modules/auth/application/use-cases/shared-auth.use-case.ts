import type { UserEntity, SafeUser } from "@/modules/users/domain/entities/user.entity";
import type { SessionRepository } from "../../domain/ports/session-repository.port";
import type { TokenService } from "../../domain/ports/token-service.port";
import type { AuthResult } from "../dto/auth.dto";

export async function createAuthResult(
  user: UserEntity,
  sessions: SessionRepository,
  tokens: TokenService,
  refreshExpiryMs: number,
): Promise<AuthResult> {
  const accessToken = tokens.createAccessToken({ id: user.id, role: user.role });
  const refreshToken = tokens.createRefreshToken({ id: user.id });
  await sessions.create({
    userId: user.id,
    tokenHash: tokens.hashRefreshToken(refreshToken),
    expiresAt: new Date(Date.now() + refreshExpiryMs),
  });
  const { hashedPassword: _hashedPassword, ...safeUser } = user;
  return { accessToken, refreshToken, user: safeUser as SafeUser };
}
