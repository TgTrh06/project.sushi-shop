import { ConflictError, ForbiddenError, UnauthorizedError } from "@/utils/common/error.utils";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "@/utils/security/jwt.utils";
import { hashPassword, comparePassword } from "@/utils/security/bcrypt.utils";
import { LoginFormValues, RegisterFormValues, Role } from "@shared/schemas/auth.schema";
import { UserEntity } from "@/modules/users/user.model";
import UserRepository from "@/modules/users/user.repository";
import SessionRepository from "./session.repository";
import { REFRESH_TOKEN_EXPIRY } from "@/config/cookie.config";

export class AuthService {
  private userRepo = new UserRepository();
  private sessionRepo = new SessionRepository();

  private async generateAuthResponse(user: UserEntity) {
    // Generate tokens
    const accessToken = generateAccessToken({ id: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id });

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

    const hashedPassword = await hashPassword(dto.password);

    const newUser = await this.userRepo.create({
      email: dto.email,
      username: dto.username,
      hashedPassword: hashedPassword,
      role: dto.role || Role.CUSTOMER,
    } as any);

    return this.generateAuthResponse(newUser);
  }

  async login(dto: LoginFormValues) {
    const existingUser = await this.userRepo.findByEmail(dto.email, true);
    if (!existingUser) throw new UnauthorizedError("Invalid email or password");

    const isMatch = await comparePassword(dto.password, existingUser.hashedPassword);
    if (!isMatch) throw new UnauthorizedError("Invalid email or password");

    return this.generateAuthResponse(existingUser);
  }

  async logout(refreshToken: string | undefined): Promise<void> {
    if (!refreshToken) return;

    await this.sessionRepo.deleteByToken(refreshToken);
  }

  async refresh(refreshToken: string) {
    // 1. Verify token and extract payload
    const payload = verifyRefreshToken(refreshToken);
    const userId = payload.id;

    // 2. Check if session exists and is valid
    const session = await this.sessionRepo.findByToken(refreshToken);
    // If no session found, it means token reuse or invalid token
    if (!session) {
      await this.sessionRepo.deleteAllByUserId(userId);
      throw new ForbiddenError("Token reuse detected! Please login again.");
    }

    // 3. Delete old session and create new one
    await this.sessionRepo.deleteByToken(refreshToken);

    // 4. Find user to get latest role and other info
    const user = await this.userRepo.findById(userId);
    if (!user) throw new UnauthorizedError("User not found");

    // 5. Generate new tokens and session
    return this.generateAuthResponse(user);
  }
}
