import toast from "react-hot-toast";

export default class ToastNoti {
  showSuccess = (message: string) => {
    toast.success(message);
  };

  showError = (message: string) => {
    toast.error(message);
  };
};