import { BaseRepository } from "./base.repository";
import { UserModel } from "../models/user/user.model";
import { UserEntity, CreateUserDTO, UpdateUserDTO } from "../models/user/user.types";

export class UserRepository extends BaseRepository<
  UserEntity,
  CreateUserDTO,
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

  async findByEmail(email: string): Promise<UserEntity | null> {
    const doc = await this.model.findOne({ email }).lean();
    return doc ? this.mapToEntity(doc) : null;
  }

  async findRawByEmail(email: string): Promise<any> {
    return await this.model.findOne({ email }).lean();
  }
}
