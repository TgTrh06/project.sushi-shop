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

    // API that don't require token refresh - Prevent infinite loop of refresh attempts
    if (
      originalRequest.url.includes("/auth/login") ||
      originalRequest.url.includes("/auth/register") ||
      originalRequest.url.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retryCount = originalRequest._retryCount || 0;

    // Check if error is due to unauthorized access and we haven't already tried refreshing
    if (error.response?.status === 401 && originalRequest._retryCount < 4) {
      originalRequest._retryCount += 1;

      try {
        // Attempt to refresh token
        const response = await api.post("/auth/refresh", { withCredentials: true });
        const newAccessToken = response.data.accessToken;

        useAuthStore.getState().setAccessToken(newAccessToken); // Update access token in store
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);

  },
);

export default api;
