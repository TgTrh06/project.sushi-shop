import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AppRoutes } from "./routes/AppRoutes";
import { useAuthStore } from "./stores/auth.store";
import { Navbar } from "./components/layout/Navbar";

function App() {
  const initialize = useAuthStore((state) => state.initialize);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  useEffect(() => {
    // Check session (cookie) on app load
    initialize();
  }, [initialize]);

  // Loading screen while checking auth status
  if (!isInitialized) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
        <div className="text-lg font-medium text-gray-600">Loading ứng dụng...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />

      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <AppRoutes />
      </main>
    </BrowserRouter>
  );
}

export default App;