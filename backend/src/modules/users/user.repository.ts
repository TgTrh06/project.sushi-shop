import BaseRepository from "../../repository";
import { UserModel } from "./user.model";
import { UserEntity } from "./user.types";
import { RegisterInput, UpdateUserInput } from "@shared/schemas/auth.schema";

export default class UserRepository extends BaseRepository<
  UserEntity,
  RegisterInput,
  UpdateUserInput
> {
  constructor() {
    super(UserModel);
  }

  protected mapToEntity(doc: any): UserEntity {
    return {
      id: doc._id.toString(),
      username: doc.username,
      email: doc.email,
      password: doc.password,
      role: doc.role,
      createdAt: doc.createdAt,
    };
  }

  async findByEmailForAuth(email: string): Promise<UserEntity | null> {
    const doc = await this.model.findOne({ email }).select("+password").lean();
    return doc ? this.mapToEntity(doc) : null;
  }
}