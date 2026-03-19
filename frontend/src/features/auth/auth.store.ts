import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "./auth.types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      logout: () => {
        // Persist auto-martically delete token in localStorage
        set({ user: null, isAuthenticated: false })
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);