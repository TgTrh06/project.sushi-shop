import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // Đừng quên import cái này để chạy showSuccess, showError
import { AppRoutes } from "./routes/AppRoutes";
import { useAuthStore } from "./features/auth/auth.store";
import { userService } from "./features/users/user.service";
import { Navbar } from "./components/layout/Navbar";

function App() {
  // State để chặn render UI cho đến khi check API xong
  const [isInitializing, setIsInitializing] = useState(true);
  const { isAuthenticated, setUser, logout } = useAuthStore();

  useEffect(() => {
    const verifySession = async () => {
      // Chỉ kiểm tra API nếu LocalStorage báo là đã từng đăng nhập
      if (isAuthenticated) {
        try {
          const user = await userService.getMe();
          setUser(user); // Cập nhật lại thông tin mới nhất (VD: lỡ Admin vừa đổi role của user)
        } catch {
          // Cookie hết hạn hoặc không hợp lệ -> Xóa store để văng ra trang Login
          logout();
        }
      }
      // Dù thành công hay thất bại cũng tắt màn hình loading
      setIsInitializing(false);
    };

    verifySession();
  }, [isAuthenticated, setUser, logout]);

  // Màn hình chờ lúc mới F5 (Bạn có thể thay bằng Spinner đẹp hơn)
  if (isInitializing) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
        <div className="text-lg font-medium text-gray-600">Loading ứng dụng...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Navbar />
      {/* Nơi chứa toàn bộ các Route bảo mật của bạn */}
      <AppRoutes />
      
      {/* Bắt buộc phải có Toaster để lib/toast.ts của bạn hoạt động */}
      <Toaster position="top-right" reverseOrder={false} />
    </BrowserRouter>
  );
}

export default App;