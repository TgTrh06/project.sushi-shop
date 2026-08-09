import { ConflictError, ForbiddenError, UnauthorizedError } from "@/utils/common/error.util";
import { Role } from "@itsu-sushi/shared/schemas/user.schema";
import { LoginFormValues, RegisterFormValues } from "@itsu-sushi/shared/schemas/auth.schema";
import { UserEntity } from "@/modules/users/user.model";
import UserRepository from "@/modules/users/user.repository";
import SessionRepository from "./session.repository";
import { REFRESH_TOKEN_EXPIRY } from "@/config/cookie.config";
import {
  AuthSessionRepository,
  AuthUserRepository,
  PasswordHasher,
  TokenService,
} from "./domain/ports/auth.ports";
import { BcryptPasswordHasher } from "./infrastructure/bcrypt.adapter";
import { JwtTokenService } from "./infrastructure/jwt.adapter";

export class AuthService {
  constructor(
    private readonly userRepo: AuthUserRepository = new UserRepository(),
    private readonly sessionRepo: AuthSessionRepository = new SessionRepository(),
    private readonly passwordHasher: PasswordHasher = new BcryptPasswordHasher(),
    private readonly tokenService: TokenService = new JwtTokenService(),
  ) {}

  private async generateAuthResponse(user: UserEntity) {
    // Generate tokens
    const accessToken = this.tokenService.generateAccessToken({ id: user.id, role: user.role });
    const refreshToken = this.tokenService.generateRefreshToken({ id: user.id });

    // Store refresh token in DB with expiration
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY);
    await this.sessionRepo.createSession(user.id, refreshToken, expiresAt);

    // Exclude hashedPassword from user object before returning
    const { hashedPassword, ...safeUser } = user;

    return {
      accessToken,
      refreshToken,
      user: safeUser,
    };
  }

  async register(dto: RegisterFormValues) {
    const existing = await this.userRepo.exists(dto.email);
    if (existing) throw new ConflictError("Email already exists");

    const hashedPassword = await this.passwordHasher.hash(dto.password);

    const newUser = await this.userRepo.create({
      email: dto.email,
      username: dto.username,
      hashedPassword: hashedPassword,
      role: Role.CUSTOMER,
    } as any);

    return this.generateAuthResponse(newUser);
  }

  async login(dto: LoginFormValues) {
    const existingUser = await this.userRepo.findByEmail(dto.email, true);
    if (!existingUser) throw new UnauthorizedError("Invalid email or password");

    const isMatch = await this.passwordHasher.compare(dto.password, existingUser.hashedPassword);
    if (!isMatch) throw new UnauthorizedError("Invalid email or password");

    return this.generateAuthResponse(existingUser);
  }

  async logout(refreshToken: string | undefined): Promise<void> {
    if (!refreshToken) return;

    await this.sessionRepo.deleteByToken(refreshToken);
  }

  async refresh(refreshToken: string) {
    // 1. Verify token and extract payload
    const payload = this.tokenService.verifyRefreshToken(refreshToken);
    const userId = payload.id;

    // 2. Check if session exists and is valid
    const session = await this.sessionRepo.consumeByToken(refreshToken);
    // If no session found, it means token reuse or invalid token
    if (!session) {
      await this.sessionRepo.deleteAllByUserId(userId);
      throw new ForbiddenError("Token reuse detected! Please login again.");
    }

    // 3. Find user to get latest role and other info
    const user = await this.userRepo.findById(userId);
    if (!user) throw new UnauthorizedError("User not found");

    // 4. Generate new tokens and session
    return this.generateAuthResponse(user);
  }
}
