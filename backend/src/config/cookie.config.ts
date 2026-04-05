import { CookieOptions } from "express";
import { env } from "./env.config";

export const REFRESH_TOKEN_NAME = "refreshToken";
export const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days


export const REFRESH_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: REFRESH_TOKEN_EXPIRY,
  path: "/",
};
