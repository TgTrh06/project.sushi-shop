import { Model, Types } from "mongoose";
import { SessionDocument, SessionEntity, SessionModel } from "./session.model";

export default class SessionRepository {
  private model: Model<SessionDocument>;

  constructor() {
    this.model = SessionModel;
  }
  
  // Map Mongoose document to SessionEntity
  private mapToEntity(doc: any): SessionEntity {
    if (!doc) return null as any;
    return {
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      refreshToken: doc.refreshToken,
      expiresAt: doc.expiresAt
    };
  }

  async createSession(userId: string, refreshToken: string, expiresAt: Date): Promise<SessionEntity> {
    const doc = await this.model.create({ 
      userId: new Types.ObjectId(userId), 
      refreshToken, 
      expiresAt 
    });
    return this.mapToEntity(doc);
  }

  async findByToken(refreshToken: string): Promise<SessionEntity | null> {
    const doc = await this.model.findOne({ refreshToken }).lean();
    return doc ? this.mapToEntity(doc) : null;
  }

  async deleteByToken(refreshToken: string): Promise<boolean> {
    const result = await this.model.deleteOne({ refreshToken });
    return !!result;
  }

  async deleteAllByUserId(userId: string): Promise<boolean> {
    const result = await this.model.deleteMany({ userId: new Types.ObjectId(userId) });
    return !!result;
  }

  async isValidSession(userId: string, refreshToken: string): Promise<boolean> {
    const session = await this.model.exists({ 
      userId: new Types.ObjectId(userId), 
      refreshToken
    });    
    return !!session;
  }
};