import { Types, type Model } from "mongoose";
import { SessionModel, type SessionDocument } from "./session.model";
import type { SessionEntity } from "@/modules/auth/domain/entities/session.entity";
import type { SessionRepository } from "@/modules/auth/domain/ports/session-repository.port";

export class MongooseSessionRepository implements SessionRepository {
  constructor(private readonly model: Model<SessionDocument> = SessionModel) {}

  private map(doc: SessionDocument | Record<string, any>): SessionEntity {
    return { id: String(doc._id), userId: String(doc.userId), tokenHash: doc.tokenHash, expiresAt: new Date(doc.expiresAt) };
  }

  async create(input: Omit<SessionEntity, "id">) {
    const doc = await this.model.create({ ...input, userId: new Types.ObjectId(input.userId) });
    return this.map(doc);
  }

  async consumeByTokenHash(tokenHash: string) {
    const doc = await this.model.findOneAndDelete({ tokenHash, expiresAt: { $gt: new Date() } }).lean();
    return doc ? this.map(doc) : null;
  }

  async revokeByTokenHash(tokenHash: string) { return (await this.model.deleteOne({ tokenHash })).deletedCount > 0; }

  async revokeAllByUserId(userId: string) { await this.model.deleteMany({ userId: new Types.ObjectId(userId) }); }
}
