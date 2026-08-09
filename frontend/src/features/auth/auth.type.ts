import type { User } from "@/features/users/user.types";

export type { User };

export type AuthResponse = {
  accessToken: string;
  user: User;
};
