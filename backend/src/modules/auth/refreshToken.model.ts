import { Schema, model, Document, Types } from "mongoose";

export interface IRefreshToken extends Document {
  userId: Types.ObjectId;
  token: string;
  isRevoked: boolean;
  expiresAt: Date;
};

const RefreshTokenSchema = new Schema<IRefreshToken>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true },
  isRevoked: { type: Boolean, required: true, default: false },
  expiresAt: { type: Date, required: true },
});

RefreshTokenSchema.index({ token: 1 }, { unique: true });
RefreshTokenSchema.index({ userId: 1 });

export const RefreshTokenModel = model<IRefreshToken>("RefreshToken", RefreshTokenSchema);
