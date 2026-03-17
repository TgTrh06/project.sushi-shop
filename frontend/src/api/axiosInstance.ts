import axios from "axios";
import { useAuthStore } from "../stores/auth.store";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true
})

api.interceptors.request.use((config) => {
  // Get token from store instead of localStorage
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// // --- RESPONSE INTERCEPTOR: Xử lý lỗi hệ thống (401, 403) ---
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Token hết hạn hoặc không hợp lệ -> Đăng xuất người dùng
//       console.error("Phiên đăng nhập hết hạn.");
//       useAuthStore.getState().logout();
//       window.location.href = '/login';
//     }
    
//     if (error.response?.status === 403) {
//       // Đã đăng nhập nhưng không có quyền (ví dụ Customer vào Admin)
//       window.location.href = '/unauthorized';
//     }

//     return Promise.reject(error);
//   }
// );

export default api