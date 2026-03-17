import { CookieOptions } from "express";
import { env } from "./env.config";

export const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true, // Prevent XSS
  secure: env.NODE_ENV === "production", // ONLY HTTPS while running production
  sameSite: "strict",
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  // domain: 
};

export const TOKEN_NAME = "token"; // Set cookie name