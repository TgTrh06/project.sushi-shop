import { ForbiddenError, UnauthorizedError } from "@/core/errors";
import type { UserRepository } from "@/modules/users/domain/ports/user-repository.port";
import type { SessionRepository } from "../../domain/ports/session-repository.port";
import type { TokenService } from "../../domain/ports/token-service.port";
import type { AuthResult } from "../dto/auth.dto";
import { createAuthResult } from "./shared-auth.use-case";

export class RefreshSessionUseCase {
  constructor(
    private readonly users: UserRepository,
    private readonly sessions: SessionRepository,
    private readonly tokens: TokenService,
    private readonly refreshExpiryMs: number,
  ) {}

  async execute(refreshToken: string): Promise<AuthResult> {
    const payload = this.tokens.verifyRefreshToken(refreshToken);
    const session = await this.sessions.consumeByTokenHash(this.tokens.hashRefreshToken(refreshToken));
    if (!session) {
      await this.sessions.revokeAllByUserId(payload.id);
      throw new ForbiddenError("Token reuse detected! Please login again.");
    }
    const user = await this.users.findById(payload.id);
    if (!user) throw new UnauthorizedError("User not found");
    return createAuthResult(user, this.sessions, this.tokens, this.refreshExpiryMs);
  }
}
