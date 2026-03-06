import jwt from "jsonwebtoken";
import { env } from "../config/env";

export const authMiddleware = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };

  req.userId = decoded.userId;
  next();
}