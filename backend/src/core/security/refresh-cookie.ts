import type { Response, CookieOptions } from "express";
import { env } from "@/core/config/env.config";

export const REFRESH_TOKEN_NAME = "refreshToken";
export const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000;
const options: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: REFRESH_TOKEN_EXPIRY,
  path: "/",
};

export function setRefreshCookie(res: Response, token: string) { res.cookie(REFRESH_TOKEN_NAME, token, options); }
export function clearRefreshCookie(res: Response) { res.clearCookie(REFRESH_TOKEN_NAME, { ...options, maxAge: undefined }); }
