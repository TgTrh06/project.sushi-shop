import "./Navbar.css";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { UserMenu } from "../UserMenu";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Icon } from "@/assets/svg";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface NavbarProps {
  onMenuClick?: () => void;
}

export const Navbar = ({ onMenuClick }: NavbarProps) => {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const isHomePage = location.pathname === "/";
  const [hasScrolledPast, setHasScrolledPast] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Only listen for scroll on homepage to toggle transparency
    if (!isHomePage) {
      setHasScrolledPast(true); // Always "scrolled past" on other pages to trigger sticky style
      return;
    }

    const handleScroll = () => {
      setHasScrolledPast(window.scrollY > 50);
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  const headerClass = hasScrolledPast ? "header--sticky" : "header--transparent";

  return (
    <header className={`header ${headerClass}`}>
      <nav className="header__nav">
        <div className="header__logo">
          <Link to="/">
            <h4 data-aos="fade-down">ItsuSushi</h4>
          </Link>
        </div>

        {isMobile ? (
          <div className="header__mobile-actions" data-aos="fade-down">
            <ThemeToggle />
            <button
              className="header__menu-btn"
              onClick={onMenuClick}
              aria-label="Open menu"
            >
              <img src={Icon.menu} alt="menu" />
            </button>
          </div>
        ) : (
          <ul className="header__menu" data-aos="fade-down">
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink to="/menu">Menu</NavLink>
            </li>
            <li>
              <NavLink to="/reservation">Reservation</NavLink>
            </li>
            <li>
              <NavLink to="/about">About</NavLink>
            </li>
            <li>
              <ThemeToggle />
            </li>
            <li className="header__auth-btn">
              {user ? <UserMenu /> : <Link to="/login">Login</Link>}
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
};
