import { Schema, model, Types } from "mongoose";

export interface SessionEntity {
  id: string;
  userId: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface SessionDocument {
  userId: Types.ObjectId;
  refreshToken: string;
  expiresAt: Date;
}

const SessionSchema = new Schema<SessionDocument>(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    refreshToken: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    }
  },
  { 
    timestamps: true
  }
);

SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const SessionModel = model<SessionDocument>("Session", SessionSchema);