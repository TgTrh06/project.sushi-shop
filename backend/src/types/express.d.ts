import { Role } from "@shared/schemas/user.schema";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: Role };
    }
  }
}

export { };
