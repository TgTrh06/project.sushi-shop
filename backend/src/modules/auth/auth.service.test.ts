import { describe, expect, it } from "vitest";
import { Role } from "@itsu-sushi/shared/schemas/user.schema";
import { RegisterSchema } from "@itsu-sushi/shared/schemas/auth.schema";
import { generateRefreshToken } from "@/utils/security/jwt.util";
import { AuthService } from "./auth.service";
import type UserRepository from "@/modules/users/user.repository";
import type SessionRepository from "./session.repository";

describe("AuthService", () => {
  it("ignores a client role and always creates a customer", async () => {
    const userRepository = {
      exists: async () => false,
      create: async (input: Record<string, unknown>) => ({
        id: "user-1",
        email: String(input.email),
        username: String(input.username),
        role: input.role as Role,
        hashedPassword: String(input.hashedPassword),
        createdAt: new Date(),
      }),
    };
    const sessionRepository = {
      createSession: async () => ({
        id: "session-1",
        userId: "user-1",
        tokenHash: "hash",
        expiresAt: new Date(),
      }),
    };

    const service = new AuthService(
      userRepository as unknown as UserRepository,
      sessionRepository as unknown as SessionRepository,
    );
    const result = await service.register({
      email: "customer@example.com",
      username: "Customer",
      password: "password123",
      confirmPassword: "password123",
      role: Role.ADMIN,
    } as never);

    expect(result.user.role).toBe(Role.CUSTOMER);
  });

  it("does not expose role in the public registration schema", () => {
    const parsed = RegisterSchema.parse({
      email: "customer@example.com",
      username: "Customer",
      password: "password123",
      confirmPassword: "password123",
      role: Role.ADMIN,
    });

    expect(parsed).not.toHaveProperty("role");
  });

  it("revokes all sessions when an already-consumed refresh token is reused", async () => {
    let revokedUserId: string | undefined;
    const userRepository = {};
    const sessionRepository = {
      consumeByToken: async () => null,
      deleteAllByUserId: async (userId: string) => {
        revokedUserId = userId;
        return true;
      },
    };
    const service = new AuthService(
      userRepository as unknown as UserRepository,
      sessionRepository as unknown as SessionRepository,
    );
    const token = generateRefreshToken({ id: "user-1" });

    await expect(service.refresh(token)).rejects.toThrow("Token reuse detected");
    expect(revokedUserId).toBe("user-1");
  });
});
