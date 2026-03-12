import BaseRepository from "./base.repository";
import { UserModel } from "../models/user/user.model";
import { UserEntity, RegisterUserDTO, UpdateUserDTO } from "../models/user/user.types";

export default class UserRepository extends BaseRepository<
  UserEntity,
  RegisterUserDTO,
  UpdateUserDTO
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
    const doc = await this.model.findOne({ email }).lean().select("+password");
    return doc ? this.mapToEntity(doc) : null;
  }
}