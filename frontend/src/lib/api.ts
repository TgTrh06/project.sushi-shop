import axios from "axios";
import { useAuthStore } from "../features/auth/auth.store";

export const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  }
});

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const payload = error.response?.data || {};
    const errors = payload.errors;
    const message = payload.message || error.message || "Something went wrong";

    const normalizedError = { message, errors, status };

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
