import toast from "react-hot-toast";

export const showSuccess = (message: string) => {
  toast.success(message);
};

export const showError = (message: string) => {
  toast.error(message);
};

export const showLoading = (message: string) => {
  return toast.loading(message, {
    style: {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: "14px",
      fontWeight: 500,
      borderRadius: "12px",
      padding: "14px 18px",
      background: "#fff",
      color: "#121212",
      border: "1px solid rgba(0,0,0,0.06)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
    },
  });
};

export const dismissToast = (id: string) => {
  toast.dismiss(id);
};
