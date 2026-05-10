import { Model } from "mongoose";
import { UserModel, UserEntity, UserDocument } from "./user.model";
import { Role } from "@shared/schemas/user.schema";
import { RegisterFormValues } from "@shared/schemas/auth.schema";
import { UpdateUserFormValues } from "@shared/schemas/user.schema";

export default class UserRepository {
  private model: Model<UserDocument>;

  constructor() {
    this.model = UserModel;
  }

  // Utility to convert Mongoose document to UserEntity
  private mapToEntity(doc: any): UserEntity {
    if (!doc) return null as any;
    return {
      id: doc._id.toString(),
      username: doc.username,
      email: doc.email,
      avatar_id: doc.avatar_id,
      phoneNumber: doc.phoneNumber ?? undefined,
      passwordLastUpdated: doc.passwordLastUpdated ? new Date(doc.passwordLastUpdated) : undefined,
      // Only map password if exist in doc (use +hashedPassword)
      ...(doc.hashedPassword && { hashedPassword: doc.hashedPassword }),
      role: doc.role,
      createdAt: doc.createdAt ? new Date(doc.createdAt) : new Date(),
    };
  }
  
  // ==========================================
  // AUTH METHODS
  // ==========================================
  
  async create(data: RegisterFormValues): Promise<UserEntity> {
    const doc = await this.model.create(data);
    return this.mapToEntity(doc);
  }

  async findByEmail(email: string, includePassword: boolean = false): Promise<UserEntity | null> {
    let query = this.model.findOne({ email });
    
    if (includePassword) {
      query.select("+hashedPassword");
    }

    const doc = await query.lean();
    return doc ? this.mapToEntity(doc) : null;
  }

  // ==========================================
  // USER MANAGEMENT METHODS (ADMIN/PROFILE)
  // ==========================================

  async findById(id: string): Promise<UserEntity | null> {
    const doc = await this.model.findById(id).lean();
    return doc ? this.mapToEntity(doc) : null;
  }

  async findByIdWithPassword(id: string): Promise<UserEntity | null> {
    const doc = await this.model.findById(id).select("+hashedPassword").lean();
    return doc ? this.mapToEntity(doc) : null;
  }

  async findUsers(limit: number, offset: number): Promise<{ docs: UserEntity[]; total: number }> {
    const filter = { role: { $in: [Role.CUSTOMER] } };
    const [docs, total] = await Promise.all([
      this.model
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .lean(),
      this.model.countDocuments(filter),
    ]);
    return { 
      docs: docs.map((doc) => this.mapToEntity(doc)), 
      total 
    };
  }

  async findStaffs(limit: number, offset: number): Promise<{ docs: UserEntity[]; total: number }> {
    const filter = { role: { $in: [Role.STAFF, Role.ADMIN] } };
    
    const [docs, total] = await Promise.all([
      this.model
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .lean(),
      this.model.countDocuments(filter),
    ]);
    return { 
      docs: docs.map((doc) => this.mapToEntity(doc)), 
      total 
    };
  }

  async update(id: string, data: UpdateUserFormValues | Record<string, any>): Promise<UserEntity | null> {
    const doc = await this.model
      .findByIdAndUpdate(
        id, 
        { $set: data },
        { 
          returnDocument: 'after',
          runValidators: true
        }
      )
      .lean();
    return doc ? this.mapToEntity(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return !!result;
  }

  async exists(email: string): Promise<boolean> {
    const result = await this.model.exists({ email });
    return !!result;
  }
}