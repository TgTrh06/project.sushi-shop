import { Schema, model, type Document, Types } from "mongoose";

export interface SessionDocument extends Document {
  userId: Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
}

const schema = new Schema<SessionDocument>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  tokenHash: { type: String, required: true, unique: true, index: true },
  expiresAt: { type: Date, required: true },
}, { timestamps: true });
schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const SessionModel = model<SessionDocument>("Session", schema);

let indexSyncPromise: Promise<string[]> | null = null;

/**
 * Synchronizes the session collection indexes after the refresh-token field
 * migration. This removes the legacy refreshToken_1 index and keeps the
 * tokenHash uniqueness/TTL indexes aligned with the current schema.
 */
export function ensureSessionIndexes(): Promise<string[]> {
  if (!indexSyncPromise) {
    indexSyncPromise = SessionModel.syncIndexes().catch((error) => {
      indexSyncPromise = null;
      throw error;
    });
  }
  return indexSyncPromise;
}
