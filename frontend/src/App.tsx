import Aos from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AppRoutes } from "@/routes/AppRoutes";
import { useAuthStore } from "@/stores/useAuthStore";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Loader } from "@/components/ui/Loader";

// Wrapper to conditionally render Navbar/Footer for non-admin routes
const AppShell = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}

      {isAdminRoute ? (
        <AppRoutes />
      ) : (
        <main className="max-w-7xl mx-auto px-4 py-6">
          <AppRoutes />
        </main>
      )}

      {!isAdminRoute && <Footer />}
    </>
  );
};

function App() {
  const initialize = useAuthStore((state) => state.initialize);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  useEffect(() => {
    // Aos init
    Aos.init({
      duration: 1000, // Duration length (ms)
      once: true, // Animation run only once
      easing: "ease-in-out",
    });
    // Check session (cookie) on app load
    initialize();
  }, [initialize]);

  // Loading screen while checking auth status
  if (!isInitialized) {
    return <Loader />;
  }

  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
