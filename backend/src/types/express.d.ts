import { Role } from "@shared/schemas/auth.schema";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: Role };
    }
  }
}

export { };
