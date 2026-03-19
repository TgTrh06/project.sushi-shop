import axios from "axios";
import { useAuthStore } from "../features/auth/authStore";

export const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// REQUEST INTERCEPTOR
api.interceptors.request.use((config) => {
  // Get token from store instead of localStorage
  const token = useAuthStore.getState().token;

  // Attach token to header for reuse
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    const payload = error.response?.data || {};
    const errors = payload.errors;
    
    const message =
      payload.message || error.message || "Something went wrong";

    const normalizedError = {
      message,
      errors,
      status,
    };

    // AUTO LOGOUT IF TOKEN IS EXPIRED
    if (status === 401) {
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }

    // LOGIN BUT DON'T HAVE PERMISSION
    if (status === 403) {
      window.location.href = "/unauthorized";
    }

    return Promise.reject(normalizedError);
  },
);

export default api;
