import BaseRepository from "../../repository";
import { UserModel, UserEntity } from "./user.model";
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
      hashedPassword: doc.hashedPassword,
      role: doc.role,
      createdAt: doc.createdAt,
    };
  }

  async findByEmailForAuth(email: string): Promise<UserEntity | null> {
    const doc = await this.model.findOne({ email }).select("+hashedPassword").lean();
    return doc ? this.mapToEntity(doc) : null;
  }
}