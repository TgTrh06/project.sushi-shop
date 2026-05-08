import axios, { type AxiosInstance } from "axios";
import { useAuthStore } from "@/stores/useAuthStore";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? import.meta.env.VITE_API_URL : "/api/v1",
  withCredentials: true,
});

// REQUEST INTERCEPTOR - Attach Access Token to Authorization Header
api.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  }
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh for auth endpoints to prevent infinite loops
    if (
      originalRequest.url.includes("/auth/login") ||
      originalRequest.url.includes("/auth/register") ||
      originalRequest.url.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    // Only attempt refresh once per request
    if (error.response?.status === 401 && !originalRequest._retried) {
      originalRequest._retried = true;

      try {
        const response = await api.post("/auth/refresh");
        const newAccessToken = response.data.data?.accessToken ?? response.data.accessToken;

        if (newAccessToken) {
          useAuthStore.getState().setAccessToken(newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest); // retry original request with new token
        }
      } catch {
        // Refresh failed — clear auth state and reject
        useAuthStore.getState().logout?.();
      }
    }

    return Promise.reject(error);
  },
);

export default api;
