import jwt from "jsonwebtoken";
import { UserEntity } from "../models/user/user.types";

export const generateToken = (user: UserEntity) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET as string,
    { 
      expiresIn: "1h" 
    },
  );
};