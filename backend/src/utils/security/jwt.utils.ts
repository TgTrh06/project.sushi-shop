import jwt from "jsonwebtoken";
import { Response } from "express";
import { env } from "@/config/env.config";
import { REFRESH_COOKIE_OPTIONS, REFRESH_TOKEN_NAME } from "@/config/cookie.config";
import { UnauthorizedError } from "@/utils/common/error.utils";

interface AccessTokenPayload {
  id: string;
  role: string;
}

interface RefreshTokenPayload {
  id: string;
}

export function generateAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign({ id: payload.id, role: payload.role }, env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
}

export function generateRefreshToken(payload: RefreshTokenPayload): string {
  return jwt.sign({ id: payload.id }, env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  try {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
  } catch {
    throw new UnauthorizedError("Invalid or expired access token");
  }
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  try {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
  } catch {
    throw new UnauthorizedError("Invalid or expired refresh token");
  }
}

export function setRefreshCookie(res: Response, token: string): void {
  res.cookie(REFRESH_TOKEN_NAME, token, REFRESH_COOKIE_OPTIONS);
}

export function clearRefreshCookie(res: Response): void {
  res.clearCookie(REFRESH_TOKEN_NAME, { ...REFRESH_COOKIE_OPTIONS, maxAge: undefined });
}
