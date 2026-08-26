import type { Model } from "mongoose";
import { UserModel, type UserDocument } from "./user.model";
import type { NewUser, UserEntity } from "@/modules/users/domain/entities/user.entity";
import type { UserRepository } from "@/modules/users/domain/ports/user-repository.port";
import type { Role } from "@/modules/users/domain/entities/role";

export class MongooseUserRepository implements UserRepository {
  constructor(private readonly model: Model<UserDocument> = UserModel) { }

  private map(doc: UserDocument | Record<string, any>): UserEntity {
    return {
      id: String(doc._id), username: doc.username, email: doc.email, role: doc.role as Role,
      avatar_id: doc.avatar_id ?? undefined, phoneNumber: doc.phoneNumber ?? undefined,
      passwordLastUpdated: doc.passwordLastUpdated ? new Date(doc.passwordLastUpdated) : undefined,
      createdAt: new Date(doc.createdAt),
      ...(doc.hashedPassword ? { hashedPassword: doc.hashedPassword } : {}),
    };
  }

  async existsByEmail(email: string) { return Boolean(await this.model.exists({ email: email.toLowerCase() })); }

  async create(input: NewUser) { return this.map(await this.model.create(input)); }

  async findByEmail(email: string, includePassword = false) {
    const query = this.model.findOne({ email: email.toLowerCase() });
    if (includePassword) query.select("+hashedPassword");
    const doc = await query.lean();
    return doc ? this.map(doc) : null;
  }

  async findById(id: string) { const doc = await this.model.findById(id).lean(); return doc ? this.map(doc) : null; }

  async findByIdWithPassword(id: string) {
    const doc = await this.model.findById(id).select("+hashedPassword").lean();
    return doc ? this.map(doc) : null;
  }

  private async list(filter: Record<string, unknown>, skip: number, limit: number) {
    const [docs, total] = await Promise.all([
      this.model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      this.model.countDocuments(filter),
    ]);
    return { data: docs.map((doc) => this.map(doc)), total };
  }

  listCustomers(skip: number, limit: number) { return this.list({ role: "customer" }, skip, limit); }
  listStaff(skip: number, limit: number) { return this.list({ role: { $in: ["staff", "admin"] } }, skip, limit); }

  async update(id: string, data: Partial<UserEntity>) {
    const doc = await this.model.findByIdAndUpdate(
      id,
      { $set: data },
      { returnDocument: "after", runValidators: true }
    ).lean();
    return doc ? this.map(doc) : null;
  }

  async delete(id: string) { return (await this.model.findByIdAndDelete(id)) !== null; }
}
