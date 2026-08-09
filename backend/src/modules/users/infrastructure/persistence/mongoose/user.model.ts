import { Schema, model, type Document } from "mongoose";
import type { Role } from "@itsu-sushi/shared/schemas/user.schema";

export interface UserDocument extends Document {
  username: string;
  email: string;
  hashedPassword: string;
  role: Role;
  avatar_id?: string;
  phoneNumber?: number;
  passwordLastUpdated?: Date;
  createdAt: Date;
}

const schema = new Schema<UserDocument>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  hashedPassword: { type: String, required: true, select: false },
  role: { type: String, enum: ["customer", "staff", "admin"], default: "customer" },
  avatar_id: { type: String, default: null },
  phoneNumber: { type: Number, default: null },
  passwordLastUpdated: { type: Date, default: null },
}, { timestamps: { createdAt: true, updatedAt: false } });

export const UserModel = model<UserDocument>("User", schema);
