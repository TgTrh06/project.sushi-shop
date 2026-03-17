import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";
import { Role } from "../schemas/auth.schema";
import { userService } from "../services/user.service";

interface User {
  id: string;
  email: string;
  username: string;
  role: Role;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

type JwtPayload = {
  id: string;
  role: Role;
};

const decodeToken = (token: string): { id: string; role: Role } | null => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return {
      id: decoded.id,
      role: decoded.role,
    };
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
      login: async (token) => {
        const decoded = decodeToken(token);
        if (!decoded) return;

        // Fetch full user info from /me
        try {
          const fullUser = await userService.getProfile();
          set({ user: fullUser, token, isAuthenticated: true });
        } catch {
          // If fetch fails, set partial user from token
          set({
            user: { ...decoded, email: "", username: "" },
            token,
            isAuthenticated: true,
          });
        }
      },
      logout: () => {
        localStorage.removeItem("auth-storage");
        set({ user: null, token: null, isAuthenticated: false })
      }
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ token: state.token }), // Only persist token
    },
  ),
);
