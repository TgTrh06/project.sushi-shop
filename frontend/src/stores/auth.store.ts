import { create } from "zustand";
import type { User } from "../features/users/user.types";
import { authService } from "../features/auth/auth.service";
import {
  type LoginFormInput,
  type RegisterFormInput,
} from "@shared/schemas/auth.schema";
import { showSuccess, showError } from "@/lib/toast";

interface AuthState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;
  isInitialized: boolean; // To track if we've completed the initial auth session check on app load

  // Synchronous actions
  setAccessToken: (accessToken: string) => void;
  setLoading: (status: boolean) => void;
  clearState: () => void;

  // Async actions
  signUp: (data: RegisterFormInput) => Promise<void>;
  signIn: (data: LoginFormInput) => Promise<void>;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<void>;

  // Initialize the authentication state while app starts (e.g., check for existing token, validate it, fetch user info)
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,
  isInitialized: false,

  setAccessToken: (accessToken) => set({ accessToken }),
  setLoading: (status: boolean) => set({ loading: status }),

  clearState: () => {
    set({ accessToken: null, user: null });
  },

  signUp: async (data: RegisterFormInput) => {
    try {
      set({ loading: true });

      await authService.signUp(data);

      // showSuccess("Registration successful! Please check your email to verify your account.");
      showSuccess("Registration successful! You can now log in.");
    } catch (error) {
      console.error("Registration error:", error);
      showError("Registration failed. Please try again.");
      // throw error; // Rethrow to allow component-level handling if needed
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (data: LoginFormInput) => {
    try {
      set({ loading: true });

      const { accessToken, user } = await authService.signIn(data);
      set({ accessToken, user, isInitialized: true }); // Mark as initialized after successful login

      showSuccess(`Welcome back, ${user.username}!`);
    } catch (error) {
      console.error("Login error:", error);
      showError("Login failed. Please check your credentials.");
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      set({ loading: true });

      await authService.signOut();
    } catch (error) {
      console.error("Logout error:", error);
      showError("Failed to logout.");
    } finally {
      get().clearState(); // Clear auth state regardless of logout API success/failure
      showSuccess("Logged out successfully.");
      set({ loading: false });
    }
  },

  refreshToken: async () => {
    try {
      const { accessToken, user } = await authService.refreshToken();

      set({ accessToken, user }); // Update access token and user info in state
    } catch (error) {
      get().clearState(); // Clear auth state if refresh fails (e.g., token expired/invalid)
      console.error("Refresh token error:", error);
      showError("Failed to refresh token.");
    }
  },

  initialize: async () => {
    if (get().isInitialized) return; // Prevent re-initialization if already done
    try {
      // Simulate an API call to check the current authentication status (e.g., validate existing token, fetch user info)
      const { accessToken, user } = await authService.refreshToken(); // Attempt to refresh token on app load
      set({ accessToken, user, isInitialized: true });
    } catch {
      // Mark as initialized even if refresh fails (expired/invalid token)
      set({ accessToken: null, user: null, isInitialized: true });
    }
  },
}));
