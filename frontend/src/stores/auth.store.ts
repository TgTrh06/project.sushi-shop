import { create } from "zustand";
import type { User } from "../features/users/user.types";

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isInitializing: boolean;

  setAuth: (accessToken: string, user: User) => void;
  setInitializing: (status: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isInitializing: true,

  setAuth: ( accessToken, user) => {
    set({ accessToken, user });
  },

  setInitializing: (status: boolean) => set({ isInitializing: status }),
  
  clearAuth: () => {
    set({ accessToken: null, user: null });
  },
}));