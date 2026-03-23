import { create } from "zustand";
import type { User } from "../users/user.types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  clearStore: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user: User) => {
    set({ user, isAuthenticated: true });
  },

  clearStore: () => {
    // Persist auto-martically delete token in localStorage
    set({ user: null, isAuthenticated: false });
  },
}));