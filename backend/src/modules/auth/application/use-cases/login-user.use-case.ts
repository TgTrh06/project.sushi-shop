import { UnauthorizedError } from "@/core/errors";
import type { UserRepository } from "@/modules/users/domain/ports/user-repository.port";
import type { PasswordHasher } from "../../domain/ports/password-hasher.port";
import type { TokenService } from "../../domain/ports/token-service.port";
import type { SessionRepository } from "../../domain/ports/session-repository.port";
import type { LoginUserInput, AuthResult } from "../dto/auth.dto";
import { createAuthResult } from "./shared-auth.use-case";

export class LoginUserUseCase {
  constructor(
    private readonly users: UserRepository,
    private readonly sessions: SessionRepository,
    private readonly hasher: PasswordHasher,
    private readonly tokens: TokenService,
    private readonly refreshExpiryMs: number,
  ) {}

  async execute(input: LoginUserInput): Promise<AuthResult> {
    const user = await this.users.findByEmail(input.email, true);
    if (!user?.hashedPassword || !(await this.hasher.compare(input.password, user.hashedPassword))) {
      throw new UnauthorizedError("Invalid email or password");
    }
    return createAuthResult(user, this.sessions, this.tokens, this.refreshExpiryMs);
  }
}
