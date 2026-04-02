import { CookieOptions } from "express";
import { env } from "./env.config";

export const REFRESH_TOKEN_COOKIE_NAME = "refreshToken";

export const refreshCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/api/v1/auth/refresh", // Restrict cookie to refresh token endpoint
};
