import { useAuthStore } from "@/stores/auth.store";
import { useNavigate } from "react-router-dom";

export const UserMenu = () => {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/sign-in");
  };

  if (!user) return null;

  return (
    <div className="flex items-center gap-4">
      <div className="text-right">
        <p className="text-sm font-bold text-gray-800">{user.username}</p>
        <p className="text-xs text-gray-500 capitalize">{user.role}</p>
      </div>
      <button
        onClick={handleLogout}
        className="px-3 py-1 text-sm border border-red-500 text-red-500 rounded hover:bg-red-50"
      >
        Đăng xuất
      </button>
    </div>
  );
};