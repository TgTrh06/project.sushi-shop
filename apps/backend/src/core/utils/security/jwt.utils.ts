import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { UserEntity } from "../../../modules/users/user.types";
import { Response } from "express";
import { env } from "../../config/env.config";
import { COOKIE_OPTIONS, TOKEN_NAME } from "../../config/cookie.config";

export default class JwtUtils {
  static generateToken = (user: UserEntity): string => {
    const payload = { id: user.id, role: user.role };
    const secret: Secret = env.JWT_SECRET as string;
    const options: SignOptions = {
      expiresIn: env.JWT_EXPIRES_IN as any,
    }

    return jwt.sign(payload, secret, options);
  };

  static setCookies = (res: Response, token: string): void => {
    res.cookie(TOKEN_NAME, token, COOKIE_OPTIONS); 
  };

  static clearCookies = (res: Response): void => {
    res.clearCookie(TOKEN_NAME, { ...COOKIE_OPTIONS, maxAge: undefined });
  }
}