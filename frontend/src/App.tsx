import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AppRoutes } from "./routes/AppRoutes";
import { useAuthStore } from "./stores/auth.store";
import { userService } from "./features/users/user.service";
import { Navbar } from "./components/layout/Navbar";

function App() {
  const { setAuth, clearAuth, isInitializing, setInitializing } = useAuthStore();

  useEffect(() => {
    const verifyAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (accessToken) {
        try {
          const user = await userService.getMe();
          setAuth(accessToken, user);
        } catch {
          clearAuth();
        }
      }
      setInitializing(false);
    };

    verifyAuth();
  }, [setAuth, clearAuth, setInitializing]);

  // Loading screen while checking auth status
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