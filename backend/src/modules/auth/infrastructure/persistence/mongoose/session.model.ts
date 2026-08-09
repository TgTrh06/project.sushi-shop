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
