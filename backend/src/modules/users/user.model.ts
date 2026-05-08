import { Schema, model } from "mongoose";
import { Role } from "@shared/schemas/user.schema";
import type { User } from "@shared/schemas/user.schema";

// =========================================================
// BUSINESS ENTITY — extends shared User with hashedPassword
// =========================================================

export interface UserEntity extends User {
  hashedPassword: string;
}

export type SafeUser = User; // User from BaseUserSchema is already safe (no hashedPassword)

// =========================================================
// DATABASE SHAPE (Mongoose Document)
// =========================================================

export interface UserDocument extends Omit<UserEntity, "id"> {}

const UserSchema = new Schema<UserDocument>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  hashedPassword: {
    type: String,
    required: true,
    select: false,
  },
  role: {
    type: String,
    enum: Object.values(Role),
    default: Role.CUSTOMER,
  },
  avatar_id: { type: String, default: null },
  phoneNumber: { type: Number, default: null },
  passwordLastUpdated: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});

export const UserModel = model<UserDocument>("User", UserSchema);
