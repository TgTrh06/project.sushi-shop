import { NotFoundError, UnauthorizedError } from "@/core/errors";
import type { PasswordHasher } from "@/modules/auth/domain/ports/password-hasher.port";
import type { UserRepository } from "../../domain/ports/user-repository.port";
import type { ChangePasswordInput } from "../dto/user.dto";

export class ChangePasswordUseCase {
  constructor(private readonly users: UserRepository, private readonly hasher: PasswordHasher) {}

  async execute(id: string, input: ChangePasswordInput): Promise<void> {
    const user = await this.users.findByIdWithPassword(id);
    if (!user?.hashedPassword) throw new NotFoundError("User not found");
    if (!(await this.hasher.compare(input.currentPassword, user.hashedPassword))) {
      throw new UnauthorizedError("Current password is incorrect");
    }
    await this.users.update(id, { hashedPassword: await this.hasher.hash(input.newPassword), passwordLastUpdated: new Date() });
  }
}
