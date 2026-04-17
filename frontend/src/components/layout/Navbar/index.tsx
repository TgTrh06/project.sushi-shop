import "./Navbar.css";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { UserMenu } from "../UserMenu";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Icon } from "@/assets/svg";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export const Navbar = () => {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const isHomePage = location.pathname === "/";
  const [hasScrolledPast, setHasScrolledPast] = useState(false);

  useEffect(() => {
    if (!isHomePage) return;

    const handleScroll = () => {
      setHasScrolledPast(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  // Logic cực kỳ rõ ràng: 
  // Sticky khi (không phải trang Home) HOẶC (là trang Home nhưng đã cuộn)
  const isSticky = !isHomePage || hasScrolledPast;
  const headerClass = isSticky ? "header--sticky" : "header--transparent";

  return (
    <header className={`header ${headerClass}`}>
      <nav className="header__nav">
        <div className="header__logo">
          <Link to="/">
            <h4 data-aos="fade-right">ItsuSushi</h4>
          </Link>
        </div>

        <ul className="header__menu" data-aos="fade-left">
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/menu">Menu</NavLink>
          </li>
          <li>
            <NavLink to="/reserve">Reserve</NavLink>
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

        <ul className="header__menu-mobile" data-aos="fade-down">
          <li>
            <img src={Icon.menu} alt="menu" />
          </li>
        </ul>
      </nav>
    </header>
  );
};
