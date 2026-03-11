import { UserEntity } from "../models/user/user.types";

declare global {
  namespace Express {
    interface Request {
      user?: UserEntity;
    }
  }
}
