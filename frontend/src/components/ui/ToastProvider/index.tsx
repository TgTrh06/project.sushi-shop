import { Toaster } from "react-hot-toast";

export const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 4000,
        style: {
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "14px",
          fontWeight: 500,
          borderRadius: "12px",
          padding: "14px 18px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
          maxWidth: "360px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        },
        success: {
          style: {
            background: "#fff",
            color: "#121212",
            border: "1px solid rgba(16, 185, 129, 0.2)",
          },
          iconTheme: {
            primary: "#10b981",
            secondary: "#ecfdf5",
          },
        },
        error: {
          style: {
            background: "#fff",
            color: "#121212",
            border: "1px solid rgba(239, 68, 68, 0.2)",
          },
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fef2f2",
          },
        },
        loading: {
          style: {
            background: "#fff",
            color: "#121212",
            border: "1px solid rgba(59, 130, 246, 0.2)",
          },
          iconTheme: {
            primary: "#3b82f6",
            secondary: "#eff6ff",
          },
        },
      }}
    />
  );
};