import "./Sidebar.css";
import { Link, NavLink } from "react-router-dom";
import { Icon } from "@/assets/svg";
import { useAuthStore } from "@/stores/useAuthStore";
import { UserMenu } from "../UserMenu";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const user = useAuthStore((state) => state.user);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`sidebar-backdrop ${isOpen ? "is-open" : ""}`} 
        onClick={onClose}
      />

      {/* Sidebar Drawer */}
      <aside className={`sidebar-drawer ${isOpen ? "is-open" : ""}`}>
        <div className="sidebar-header">
          <Link to="/" onClick={onClose} className="sidebar-logo">
            <span>Itsu</span>Sushi
          </Link>
          <button className="sidebar-close" onClick={onClose} aria-label="Close menu">
            <span />
            <span />
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            <li><NavLink to="/" onClick={onClose}>Home</NavLink></li>
            <li><NavLink to="/menu" onClick={onClose}>Menu</NavLink></li>
            <li><NavLink to="/reserve" onClick={onClose}>Reserve</NavLink></li>
            <li><NavLink to="/about" onClick={onClose}>About</NavLink></li>
          </ul>

          <div className="sidebar-divider" />

          {/* Contact Section */}
          <div className="sidebar-contact">
            <h4 className="sidebar-heading">Find Us</h4>
            <p>123 Sushi Way, Tokyo District</p>
            <p>+84 901 234 567</p>
            <p className="sidebar-hours">Daily: 11:00 AM - 10:00 PM</p>
          </div>

          {/* Social Section */}
          <div className="sidebar-social-section">
            <h4 className="sidebar-heading">Follow Us</h4>
            <ul className="sidebar-social-icons">
              <li>
                <a href="https://facebook.com" target="_blank" rel="noreferrer">
                  <img src={Icon.facebook} alt="facebook" />
                </a>
              </li>
              <li>
                <a href="https://instagram.com" target="_blank" rel="noreferrer">
                  <img src={Icon.instagram} alt="instagram" />
                </a>
              </li>
              <li>
                <a href="https://twitter.com" target="_blank" rel="noreferrer">
                  <img src={Icon.twitter} alt="twitter" />
                </a>
              </li>
            </ul>
          </div>
        </nav>

        <div className="sidebar-footer">
          {user ? (
            <div className="sidebar-user-wrapper">
              <UserMenu />
            </div>
          ) : (
            <Link to="/login" onClick={onClose} className="sidebar-login-btn">
              Login / Sign Up
            </Link>
          )}
        </div>
      </aside>
    </>
  );
};
