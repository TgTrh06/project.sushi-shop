import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { useThemeStore } from "@/stores/useThemeStore";
import {
  User,
  LogIn,
  UserPlus,
  Settings,
  ChevronDown,
  ChevronLeft,
  LogOut,
  LayoutDashboard,
  Sun,
  Moon,
  Globe,
} from "lucide-react";
import "./UserMenu.css";

type MenuView = "main" | "appearance";

interface UserMenuProps {
  /** Where to navigate after logout. Defaults to "/" */
  redirectOnLogout?: string;
}

export const UserMenu = ({ redirectOnLogout = "/" }: UserMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<MenuView>("main");
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useThemeStore();

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset view when closed
  useEffect(() => {
    if (!isOpen) setView("main");
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate(redirectOnLogout);
  };

  const displayName = user ? (user.username || "User") : "Guest";

  return (
    <div className="user-menu-container" ref={menuRef}>
      {/* Trigger button */}
      <button
        className={`user-menu-trigger ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="user-menu-trigger__avatar">
          <User size={18} strokeWidth={1.5} />
        </span>
        <span className="user-menu-trigger__label">
          {user ? displayName : "Login"}
        </span>
        <ChevronDown
          size={16}
          strokeWidth={2}
          className={`user-menu-trigger__chevron ${isOpen ? "rotated" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="user-dropdown" role="menu">
          {/* ── MAIN VIEW ── */}
          {view === "main" && (
            <>
              {/* Header */}
              <div className="user-dropdown__header">
                <span className="user-dropdown__name">{displayName}</span>
              </div>

              <div className="user-dropdown__divider" />

              {/* Guest actions */}
              {!user && (
                <>
                  <Link
                    to="/login"
                    className="user-dropdown__item"
                    onClick={() => setIsOpen(false)}
                    role="menuitem"
                  >
                    <LogIn size={18} strokeWidth={1.5} />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="user-dropdown__item"
                    onClick={() => setIsOpen(false)}
                    role="menuitem"
                  >
                    <UserPlus size={18} strokeWidth={1.5} />
                    <span>Register</span>
                  </Link>
                </>
              )}

              {/* Logged-in actions */}
              {user && (
                <>
                  <Link
                    to="/profile"
                    className="user-dropdown__item"
                    onClick={() => setIsOpen(false)}
                    role="menuitem"
                  >
                    <User size={18} strokeWidth={1.5} />
                    <span>Profile</span>
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      to="/admin/dashboard"
                      className="user-dropdown__item"
                      onClick={() => setIsOpen(false)}
                      role="menuitem"
                    >
                      <LayoutDashboard size={18} strokeWidth={1.5} />
                      <span>Dashboard</span>
                    </Link>
                  )}
                </>
              )}

              <div className="user-dropdown__divider" />

              {/* Appearance settings */}
              <button
                className="user-dropdown__item user-dropdown__item--arrow"
                onClick={() => setView("appearance")}
                role="menuitem"
              >
                <Settings size={18} strokeWidth={1.5} />
                <span>Settings</span>
                <ChevronDown
                  size={14}
                  strokeWidth={2}
                  style={{ marginLeft: "auto", transform: "rotate(-90deg)" }}
                />
              </button>

              {/* Logout */}
              {user && (
                <>
                  <div className="user-dropdown__divider" />
                  <button
                    className="user-dropdown__item user-dropdown__item--danger"
                    onClick={handleLogout}
                    role="menuitem"
                  >
                    <LogOut size={18} strokeWidth={1.5} />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </>
          )}

          {/* ── APPEARANCE VIEW ── */}
          {view === "appearance" && (
            <>
              {/* Back header */}
              <div className="user-dropdown__header user-dropdown__header--back">
                <button
                  className="user-dropdown__back-btn"
                  onClick={() => setView("main")}
                >
                  <ChevronLeft size={16} strokeWidth={2} />
                </button>
                <span className="user-dropdown__name">Settings</span>
              </div>

              <div className="user-dropdown__divider" />

              {/* Language */}
              <div className="user-dropdown__section-label">Language</div>
              <div className="user-dropdown__lang-row">
                <button className="lang-btn lang-btn--active">
                  <Globe size={14} strokeWidth={2} />
                  <span>English</span>
                </button>
                <button className="lang-btn">
                  <Globe size={14} strokeWidth={2} />
                  <span>Vietnamese</span>
                </button>
              </div>

              <div className="user-dropdown__divider" />

              {/* Theme */}
              <div className="user-dropdown__section-label">Theme</div>
              <div className="user-dropdown__theme-row">
                <button
                  className={`theme-btn ${theme === "dark" ? "theme-btn--active" : ""}`}
                  onClick={() => setTheme("dark")}
                >
                  <Moon size={16} strokeWidth={1.5} />
                  <span>Dark</span>
                </button>
                <button
                  className={`theme-btn ${theme === "light" ? "theme-btn--active" : ""}`}
                  onClick={() => setTheme("light")}
                >
                  <Sun size={16} strokeWidth={1.5} />
                  <span>Light</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
