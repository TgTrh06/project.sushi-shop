import type { User } from "@shared/schemas/user.schema";

export type { User };

export type AuthResponse = {
  accessToken: string;
  user: User;
};
