import "./Header.css";
import { useEffect, useState } from "react";
import { UserMenu } from "../UserMenu";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Icon } from "@/assets/svg";
import { LogoIcon } from "@/components/ui/LogoIcon";

interface HeaderProps {
  onMenuClick?: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const [hasScrolledPast, setHasScrolledPast] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => setHasScrolledPast(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerClass = isHomePage 
    ? (hasScrolledPast ? "header--sticky is-home-page" : "header--transparent is-home-page") 
    : "header--sticky";

  return (
    <header
      className={`header ${headerClass}`}
    >
      <nav className="header__nav">
        <div className="header__logo" data-aos="fade-down">
          <Link to="/">
            <h4>
              <LogoIcon size={32} primaryColor="var(--primary-color)" className="header__logo-icon"/>
              Itsu<span>Sushi</span>
            </h4>
          </Link>
        </div>

        {isMobile ? (
          <div className="header__mobile-actions" data-aos="fade-down">
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
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/menu">Menu</NavLink></li>
            <li><NavLink to="/reservation">Reservation</NavLink></li>
            <li><NavLink to="/about">About</NavLink></li>
            <UserMenu/>
          </ul>
        )}
      </nav>
    </header>
  );
};
