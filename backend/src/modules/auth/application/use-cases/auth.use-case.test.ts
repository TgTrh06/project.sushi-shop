import { describe, expect, it } from "vitest";
import { RegisterUserUseCase } from "./register-user.use-case";
import type { UserEntity } from "@/modules/users/domain/entities/user.entity";
import type { UserRepository } from "@/modules/users/domain/ports/user-repository.port";
import type { SessionRepository } from "../../domain/ports/session-repository.port";
import type { PasswordHasher } from "../../domain/ports/password-hasher.port";
import type { TokenService } from "../../domain/ports/token-service.port";

describe("RegisterUserUseCase", () => {
  it("always creates a customer even when the request tries to escalate role", async () => {
    let created!: UserEntity;
    const users: UserRepository = {
      existsByEmail: async () => false,
      create: async (input) => { created = { id: "u1", ...input, createdAt: new Date() }; return created; },
      findByEmail: async () => null, findById: async () => created, findByIdWithPassword: async () => created,
      update: async () => created, delete: async () => true,
      listCustomers: async () => ({ data: [], total: 0 }), listStaff: async () => ({ data: [], total: 0 }),
    };
    const sessions: SessionRepository = { create: async (value) => ({ id: "s1", ...value }), consumeByTokenHash: async () => null, revokeByTokenHash: async () => true, revokeAllByUserId: async () => undefined };
    const hasher: PasswordHasher = { hash: async () => "hash", compare: async () => true };
    const tokens: TokenService = { createAccessToken: () => "access", createRefreshToken: () => "refresh", verifyAccessToken: () => ({ id: "u1", role: "customer" }), verifyRefreshToken: () => ({ id: "u1" }), hashRefreshToken: () => "refresh-hash" };
    const result = await new RegisterUserUseCase(users, sessions, hasher, tokens, 1000).execute({ email: "customer@example.com", username: "Customer", password: "secret", ...( { role: "admin" } as Record<string, unknown>) });
    expect(created.role).toBe("customer");
    expect(result.user).not.toHaveProperty("hashedPassword");
  });
});
