import { create } from "zustand";
import type { User } from "@/features/users/user.types";
import { authService } from "@/features/auth/auth.service";
import type {
  LoginFormInput,
  RegisterFormInput,
} from "@/features/auth/schemas/auth.schema";
import { showError, showSuccess } from "@/lib/toast";

interface AuthState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;
  isInitialized: boolean;
  setAccessToken: (accessToken: string) => void;
  setLoading: (status: boolean) => void;
  clearState: () => void;
  updateUser: (user: User) => void;
  register: (input: RegisterFormInput) => Promise<void>;
  login: (input: LoginFormInput) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,
  isInitialized: false,

  setAccessToken: (accessToken) => set({ accessToken }),
  setLoading: (loading) => set({ loading }),
  updateUser: (user) => set({ user }),
  clearState: () => set({ accessToken: null, user: null }),

  register: async (input) => {
    set({ loading: true });
    try {
      await authService.register(input);
      showSuccess("Registration successful! You can now log in.");
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  login: async (input) => {
    set({ loading: true });
    try {
      const { accessToken, user } = await authService.login(input);
      set({ accessToken, user, isInitialized: true });
      showSuccess(`Welcome back, ${user.username}!`);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
      showError("Failed to logout.");
    } finally {
      get().clearState();
      set({ loading: false });
      showSuccess("Logged out successfully.");
    }
  },

  refreshToken: async () => {
    try {
      const { accessToken, user } = await authService.refresh();
      set({ accessToken, user });
    } catch (error) {
      get().clearState();
      console.error("Refresh token error:", error);
    }
  },

  initialize: async () => {
    if (get().isInitialized) return;
    try {
      const { accessToken, user } = await authService.refresh();
      set({ accessToken, user, isInitialized: true });
    } catch {
      set({ accessToken: null, user: null, isInitialized: true });
    }
  },
}));
