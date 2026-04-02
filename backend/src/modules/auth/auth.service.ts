import { ConflictError, UnauthorizedError } from "../../utils/common/error.utils";
import { create, findByToken, revokeToken, revokeAllForUser } from "./refreshToken.repository";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/security/jwt.utils";
import UserRepository from "../users/user.repository";
import { hashPassword, comparePassword } from "../../utils/security/bcrypt.utils";
import { sanitizeUser } from "../../utils/security/sanitize.utils";
import { LoginInput, RegisterInput } from "@shared/schemas/auth.schema";

export class AuthService {
  private repo = new UserRepository();

  async register(dto: RegisterInput) {
    const existing = await this.repo.findByEmailForAuth(dto.email);
    if (existing) {
      throw new ConflictError("Email already exists");
    }

    const hashedPassword = await hashPassword(dto.password);

    const newUser = await this.repo.create({
      email: dto.email,
      username: dto.username ?? dto.email,
      password: hashedPassword,
      confirmPassword: hashedPassword,
      role: "customer",
    } as RegisterInput);

    const accessToken = generateAccessToken({ id: newUser.id, role: newUser.role });
    const refreshToken = generateRefreshToken(newUser.id);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await create(newUser.id, refreshToken, expiresAt);

    const user = sanitizeUser(newUser);

    return { accessToken, refreshToken, user };
  }

  async login(dto: LoginInput) {
    const existingUser = await this.repo.findByEmailForAuth(dto.email);
    if (!existingUser) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const isMatch = await comparePassword(dto.password, existingUser.password);
    if (!isMatch) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const accessToken = generateAccessToken({ id: existingUser.id, role: existingUser.role });
    const refreshToken = generateRefreshToken(existingUser.id);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await create(existingUser.id, refreshToken, expiresAt);

    const user = sanitizeUser(existingUser);

    return { accessToken, refreshToken, user };
  }

  async refresh(token: string) {
    const payload = verifyRefreshToken(token);
    const userId = payload.id;

    const record = await findByToken(token);

    if (!record) {
      await revokeAllForUser(userId);
      throw new UnauthorizedError("Token reuse detected");
    }

    if (record.isRevoked) {
      await revokeAllForUser(userId);
      throw new UnauthorizedError("Token reuse detected");
    }

    await revokeToken(token);

    const user = await this.repo.findById(userId);
    const role = user?.role ?? "customer";

    const accessToken = generateAccessToken({ id: userId, role });
    const newRefreshToken = generateRefreshToken(userId);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await create(userId, newRefreshToken, expiresAt);

    return { accessToken, refreshToken: newRefreshToken };
  }

  async logout(token: string | undefined): Promise<void> {
    if (token) {
      await revokeToken(token);
    }
  }
}
