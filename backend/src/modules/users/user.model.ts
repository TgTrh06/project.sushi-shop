import { Schema, model } from "mongoose";
import { Role } from "@shared/schemas/auth.schema";

// Business Entity
export interface UserEntity {
  id: string;
  username: string;
  email: string;
  hashedPassword: string;
  role: Role;
  createdAt: Date;
}

export type SafeUser = Omit<UserEntity, "hashedPassword">;

// Database shape (Mongoose Document)
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
    default: Role.CUSTOMER 
  },
  createdAt: { type: Date, default: Date.now },
});

export const UserModel = model<UserDocument>("User", UserSchema);
