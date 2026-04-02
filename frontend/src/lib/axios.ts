import axios, { type AxiosInstance } from "axios";
import { useAuthStore } from "../stores/auth.store";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api/v1",
  withCredentials: true,
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  }
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  async (error) => {
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
      useAuthStore.getState().clearAuth();
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
