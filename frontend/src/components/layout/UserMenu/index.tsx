import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { Images } from "@/assets/image"; // Sử dụng đống ảnh bạn đã setup
import "./UserMenu.css";

export const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Lấy thông tin user từ store của bạn
  const { user, logout } = useAuthStore();

  // Đóng menu khi click ra ngoài vùng chứa
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/");
  };

  return (
    <div className="user-menu-container" ref={menuRef}>
      {/* Nút bấm Avatar */}
      <button className="user-avatar-btn" onClick={() => setIsOpen(!isOpen)}>
        <img src={Images.common.userAvatarSmall} alt="User Avatar" />
      </button>

      {/* Droplist */}
      {isOpen && (
        <ul className="user-droplist">
          {/* Standard */}
          <li>
            <Link to="/profile" className="droplist-item" onClick={() => setIsOpen(false)}>
              Profile
            </Link>
          </li>

          {/* Admin only */}
          {user?.role === "admin" && (
            <li>
              <Link to="/admin/dashboard" className="droplist-item" onClick={() => setIsOpen(false)}>
                Dashboard
              </Link>
            </li>
          )}

          {/* Sign Out */}
          <li className="droplist-item signout" onClick={handleLogout}>
            Sign Out
          </li>
        </ul>
      )}
    </div>
  );
};