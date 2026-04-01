import { JwtPayload } from "./jwt.type";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export { };
