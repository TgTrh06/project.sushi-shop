import { Role } from "@itsu-sushi/shared/schemas/user.schema";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: Role };
    }
  }
}

export { };
