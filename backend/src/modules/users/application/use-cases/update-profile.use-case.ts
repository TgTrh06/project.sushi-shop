import { BadRequestError, NotFoundError } from "@/core/errors";
import type { FileStorage } from "@/core/ports/file-storage.port";
import type { SafeUser } from "../../domain/entities/user.entity";
import type { UserRepository } from "../../domain/ports/user-repository.port";
import type { UpdateProfileInput } from "../dto/user.dto";

export class UpdateProfileUseCase {
  constructor(private readonly users: UserRepository, private readonly storage: FileStorage) {}

  async execute(id: string, input: UpdateProfileInput): Promise<SafeUser> {
    const current = await this.users.findById(id);
    if (!current) throw new NotFoundError("User not found");
    if (input.avatar_id && input.avatar_id !== current.avatar_id) {
      if (current.avatar_id) await this.storage.delete(current.avatar_id).catch(() => undefined);
    }
    const updated = await this.users.update(id, input);
    if (!updated) throw new BadRequestError("Failed to update profile");
    const { hashedPassword: _hash, ...safe } = updated;
    return safe;
  }
}
