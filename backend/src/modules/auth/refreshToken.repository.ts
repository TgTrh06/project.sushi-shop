import { Types } from "mongoose";
import { IRefreshToken, RefreshTokenModel } from "./refreshToken.model";

export async function create(
  userId: string | Types.ObjectId,
  token: string,
  expiresAt: Date
): Promise<IRefreshToken> {
  return RefreshTokenModel.create({ userId, token, expiresAt });
}

export async function findByToken(token: string): Promise<IRefreshToken | null> {
  return RefreshTokenModel.findOne({ token });
}

export async function revokeToken(token: string): Promise<void> {
  await RefreshTokenModel.updateOne({ token }, { isRevoked: true });
}

export async function revokeAllForUser(userId: string | Types.ObjectId): Promise<void> {
  await RefreshTokenModel.updateMany({ userId }, { isRevoked: true });
}
