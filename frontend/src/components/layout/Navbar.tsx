import "@/assets/styles/sections/header.css";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { UserMenu } from "./UserMenu";
import { Link } from "react-router-dom";
import { Icon } from "@/assets/svg";

export const Navbar = () => {
  const user = useAuthStore((state) => state.user);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? "header--sticky" : "header--transparent"}`}>
      <nav className="header__nav">
        <div className="header__logo">
          <Link to="/">
            <h4 data-aos="fade-down">ItsuSushi</h4>
          </Link>
        </div>

        <ul className="header__menu" data-aos="fade-down">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/menu">Menu</Link>
          </li>
          <li>
            <Link to="/booking">Reserve</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li className="header__auth-btn">
            {user ? <UserMenu /> : <Link to="/sign-in">Login</Link>}
          </li>
          <li>
            {user?.role === "admin" && <Link to="/admin">Dashboard</Link>}
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
