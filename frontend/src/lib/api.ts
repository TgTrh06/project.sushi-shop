import axios from "axios";
import { useAuthStore } from "../features/auth/auth.store";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  }
});

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      const networkError = {
        message: "Failed connecting to server. Please check the connection.",
        status: 503
      };
      return Promise.reject(networkError);
    }

    const status = error.response?.status;
    const payload = error.response?.data || {};
    const message = payload.message || "Something went wrong";
    const errors = payload.errors;

    const normalizedError = { message, errors, status };

    if (status === 401) {
      useAuthStore.getState().clearStore();
      window.dispatchEvent(new CustomEvent("auth-unauthorized"));
    } else if (status === 403) {
      window.dispatchEvent(new CustomEvent("auth-forbiden"));
    } else {
      console.error("[Server Error]: ", error);
    }

    return Promise.reject(normalizedError);
  },
);

export default api;
