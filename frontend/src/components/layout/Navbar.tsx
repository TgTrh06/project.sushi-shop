import "@/assets/styles/sections/header.css";
import { Icon } from "@/assets/svg";
import { Link } from "react-router-dom";
import { UserMenu } from "./UserMenu";
import { useAuthStore } from "@/stores/auth.store";

export const Navbar = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <header>
      <nav className="header__nav">
        <div className="header__logo">
          <Link to="/">
            <h4 data-aos="fade-down">ItsuSushi</h4>
            {/* <div className="header__logo-overlay"></div> */}
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
            {user && (
              <Link to="/booking" className="text-red-600 font-bold">
                Booking
              </Link>
            )}
          </li>
          <li>
            <Link to="/about">About Us</Link>
          </li>
          <li>
            <img src={Icon.search} alt="search" />
          </li>
          {user ? (
            <UserMenu />
          ) : (
            <li>
              <Link to="/sign-in">Sign In</Link>
              <Link to="/sign-up">Sign Up</Link>
            </li>
          )}
          
          {/* <li>
            {user?.role === "admin" && (
              <Link to="/admin" className="text-red-600 font-bold">
                Dashboard
              </Link>
            )}
          </li> */}
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
