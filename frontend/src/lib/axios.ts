import axios, { type AxiosInstance } from "axios";
import { useAuthStore } from "@/stores/useAuthStore";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? import.meta.env.VITE_API_URL : "/api/v1",
  withCredentials: true,
});

let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async (): Promise<string | null> => {
  if (!refreshPromise) {
    refreshPromise = api.post("/auth/refresh")
      .then((response) => {
        const token = response.data.data?.accessToken ?? response.data.accessToken ?? null;
        if (token) useAuthStore.getState().setAccessToken(token);
        return token;
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    const isAuthRequest = ["/auth/login", "/auth/register", "/auth/refresh"]
      .some((path) => originalRequest.url?.includes(path));

    if (isAuthRequest || error.response?.status !== 401 || originalRequest._retried) {
      return Promise.reject(error);
    }

    originalRequest._retried = true;
    const newAccessToken = await refreshAccessToken();

    if (!newAccessToken) {
      useAuthStore.getState().clearState();
      return Promise.reject(error);
    }

    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
    return api(originalRequest);
  },
);

export default api;
