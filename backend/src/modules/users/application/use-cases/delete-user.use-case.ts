import { BadRequestError, NotFoundError } from "@/core/errors";
import type { FileStorage } from "@/core/ports/file-storage.port";
import type { UserRepository } from "../../domain/ports/user-repository.port";

export class DeleteUserUseCase {
  constructor(private readonly users: UserRepository, private readonly storage: FileStorage) {}

  async execute(targetId: string, currentAdminId: string): Promise<void> {
    const user = await this.users.findById(targetId);
    if (!user) throw new NotFoundError("User not found");
    if (targetId === currentAdminId) throw new BadRequestError("You cannot delete your own admin account");
    if (user.role === "admin") throw new BadRequestError("Cannot delete other admin users");
    if (user.avatar_id) await this.storage.delete(user.avatar_id).catch(() => undefined);
    await this.users.delete(targetId);
  }
}
