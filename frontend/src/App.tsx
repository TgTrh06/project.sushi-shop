import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AppRoutes } from "./routes/AppRoutes";
import { useAuthStore } from "./features/auth/auth.store";
import { userService } from "./features/users/user.service";
import { Navbar } from "./components/layout/Navbar";

function App() {
  const { setUser, clearStore, isInitializing, setInitializing } = useAuthStore();

  useEffect(() => {
    const verifySession = async () => {
      const hasSession = localStorage.getItem("hasSession");

      if (hasSession === "true") {
        try {
          const user = await userService.getMe();
          setUser(user); // Cập nhật lại thông tin mới nhất (VD: lỡ Admin vừa đổi role của user)
        } catch {
          // Cookie hết hạn hoặc không hợp lệ -> Xóa store để văng ra trang Login
          clearStore();
        }
      }
      // Dù thành công hay thất bại cũng tắt màn hình loading
      setInitializing(false);
    };

    verifySession();
  }, [setUser, clearStore, setInitializing]);

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