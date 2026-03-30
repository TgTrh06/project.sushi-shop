import { create } from "zustand";
import type { User } from "../users/user.types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  setUser: (user: User) => void;
  setInitializing: (status: boolean) => void;
  clearStore: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitializing: true,

  setUser: (user: User) => {
    localStorage.setItem("hasSession", "true");
    set({ user, isAuthenticated: true });
  },

  setInitializing: (status: boolean) => set({ isInitializing: status }),
  
  clearStore: () => {
    set({ user: null, isAuthenticated: false });
  },
}));