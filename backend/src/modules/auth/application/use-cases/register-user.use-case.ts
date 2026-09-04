import { Role } from "@/modules/users/domain/entities/role";
import { ConflictError } from "@/core/errors";
import type { UserRepository } from "@/modules/users/domain/ports/user-repository.port";
import type { PasswordHasher } from "../../domain/ports/password-hasher.port";
import type { TokenService } from "../../domain/ports/token-service.port";
import type { SessionRepository } from "../../domain/ports/session-repository.port";
import type { RegisterUserInput, AuthResult } from "../dto/auth.dto";
import { createAuthResult } from "./shared-auth.use-case";

export class RegisterUserUseCase {
  constructor(
    private readonly users: UserRepository,
    private readonly sessions: SessionRepository,
    private readonly hasher: PasswordHasher,
    private readonly tokens: TokenService,
    private readonly refreshExpiryMs: number,
  ) {}

  async execute(input: RegisterUserInput): Promise<AuthResult> {
    if (await this.users.existsByEmail(input.email)) throw new ConflictError("Email already exists");
    const user = await this.users.create({
      email: input.email,
      username: input.username,
      hashedPassword: await this.hasher.hash(input.password),
      role: Role.CUSTOMER,
    });
    return createAuthResult(user, this.sessions, this.tokens, this.refreshExpiryMs);
  }
}
