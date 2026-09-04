import type { Role } from "@/modules/users/domain/entities/role";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: Role };
    }
  }
}

export {};
