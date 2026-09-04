import type { SessionRepository } from "../../domain/ports/session-repository.port";
import type { TokenService } from "../../domain/ports/token-service.port";

export class LogoutUserUseCase {
  constructor(private readonly sessions: SessionRepository, private readonly tokens: TokenService) {}

  async execute(refreshToken?: string): Promise<void> {
    if (refreshToken) await this.sessions.revokeByTokenHash(this.tokens.hashRefreshToken(refreshToken));
  }
}
