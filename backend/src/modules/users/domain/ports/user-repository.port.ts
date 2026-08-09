import type { UserEntity, NewUser } from "../entities/user.entity";

export interface UserRepository {
  existsByEmail(email: string): Promise<boolean>;
  create(input: NewUser): Promise<UserEntity>;
  findByEmail(email: string, includePassword?: boolean): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
  findByIdWithPassword(id: string): Promise<UserEntity | null>;
  update(id: string, data: Partial<UserEntity>): Promise<UserEntity | null>;
  delete(id: string): Promise<boolean>;
  listCustomers(skip: number, limit: number): Promise<{ data: UserEntity[]; total: number }>;
  listStaff(skip: number, limit: number): Promise<{ data: UserEntity[]; total: number }>;
}
