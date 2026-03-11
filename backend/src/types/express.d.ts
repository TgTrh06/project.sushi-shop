import { UserEntity } from "../models/user/user.types";

// augment Express request to include user property
// using a module-level export helps TypeScript treat this as a module

declare global {
  namespace Express {
    interface Request {
      user?: UserEntity;
    }
  }
}

export {};
