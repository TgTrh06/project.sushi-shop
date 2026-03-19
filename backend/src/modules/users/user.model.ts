import { Schema, model } from "mongoose";
import { UserDocument } from "./user.types";

const UserSchema = new Schema<UserDocument>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { 
    type: String, 
    required: true,
    select: false  
  },
  role: { type: String, enum: ["customer", "admin"], default: "customer" },
  createdAt: { type: Date, default: Date.now },
});

export const UserModel = model<UserDocument>("User", UserSchema);