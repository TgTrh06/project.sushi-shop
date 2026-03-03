import { Schema, model, Document, Types } from "mongoose";

export interface IUser extends Document  {
  username: string;
  email: string;
  password: string;
  role: "customer" | "admin";
}