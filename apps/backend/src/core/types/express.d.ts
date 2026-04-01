import { JwtPayload } from "../core/middleware/auth.middleware";

// augment Express request to include user property
// using a module-level export helps TypeScript treat this as a module

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export {};
