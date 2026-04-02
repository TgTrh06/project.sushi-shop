import jwt from "jsonwebtoken";
import { Response } from "express";
import { env } from "../../config/env.config";
import { refreshCookieOptions, REFRESH_TOKEN_COOKIE_NAME } from "../../config/cookie.config";
import { UnauthorizedError } from "../common/error.utils";
import { AccessTokenPayload, RefreshTokenPayload } from "../../types/jwt.type";

export function generateAccessToken(user: { id: string; role: string }): string {
  return jwt.sign({ id: user.id, role: user.role }, env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
}

export function generateRefreshToken(userId: string): string {
  return jwt.sign({ id: userId }, env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
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
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, token, refreshCookieOptions);
}

export function clearRefreshCookie(res: Response): void {
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, { ...refreshCookieOptions, maxAge: undefined });
}
