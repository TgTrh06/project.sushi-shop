import Aos from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AppRoutes } from "@/routes/AppRoutes";
import { useAuthStore } from "@/stores/auth.store";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "./components/layout/Footer";

function App() {
  const initialize = useAuthStore((state) => state.initialize);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  useEffect(() => {
    // Aos init
    Aos.init({
      duration: 1000, // Duration length (ms)
      once: true,     // Animation run only once
      easing: 'ease-in-out',
    });
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

      <Footer />
    </BrowserRouter>
  );
}

export default App;