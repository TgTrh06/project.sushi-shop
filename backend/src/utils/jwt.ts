import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { UserEntity } from "../models/user/user.types";
import { Response } from "express";
import { env } from "../config/env";

export const generateToken = (user: UserEntity): string => {
  const payload = { user };
  const secret: Secret = env.JWT_SECRET as string;
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as any,
  }

  return jwt.sign(payload, secret, options);
};

export const setCookies = (res: Response, token: string): void => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  });
};