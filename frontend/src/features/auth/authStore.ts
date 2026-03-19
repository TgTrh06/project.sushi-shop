import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";
import { Role } from "../../config/constants/role";

interface MinimalUser {
  id: string;
  role: Role;
}

interface AuthState {
  user: MinimalUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  logout: () => void;
}

type JwtPayload = {
  id: string;
  role: Role;
};

const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setToken: (token: string) => {
        const decoded = decodeToken(token);
        if (!decoded) {
          set({ user: null, token: null, isAuthenticated: false });
          return;
        };

        set({ 
          token,
          user: { id: decoded.id, role: decoded.role },
          isAuthenticated: true 
        });
      },

      logout: () => {
        // Persist auto-martically delete token in localStorage
        set({ user: null, token: null, isAuthenticated: false })
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ 
        token: state.token // Only persist token 
      }),
    },
  ),
);