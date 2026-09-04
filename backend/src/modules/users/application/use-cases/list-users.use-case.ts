import type { SafeUser } from "../../domain/entities/user.entity";
import type { UserRepository } from "../../domain/ports/user-repository.port";
import { Pagination } from "@/core/http/pagination";

export class ListUsersUseCase {
  constructor(private readonly users: UserRepository) {}

  async execute(kind: "customers" | "staff", page: number, limit: number) {
    const skip = (page - 1) * limit;
    const result = kind === "customers"
      ? await this.users.listCustomers(skip, limit)
      : await this.users.listStaff(skip, limit);
    const safe = result.data.map(({ hashedPassword: _hash, ...user }) => user as SafeUser);
    return Pagination.result(safe, result.total, page, limit);
  }
}
