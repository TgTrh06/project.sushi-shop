import { NotFoundError } from "@/core/errors";
import type { SafeUser } from "../../domain/entities/user.entity";
import type { UserRepository } from "../../domain/ports/user-repository.port";

export class GetUserUseCase {
  constructor(private readonly users: UserRepository) {}
  async execute(id: string): Promise<SafeUser> {
    const user = await this.users.findById(id);
    if (!user) throw new NotFoundError("User not found");
    const { hashedPassword: _hash, ...safe } = user;
    return safe;
  }
}
