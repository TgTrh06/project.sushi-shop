import { Link } from "react-router-dom";
import "./header.css";

export const Navbar = () => {
  return (
    <header>
      <nav className="header__nav">
        <div className="header__logo">
          <h4>SushiYa</h4>
          <div className="header__logo-overlay"></div>
        </div>

        <ul className="header__menu">
          {/* Dùng thẻ <Link> của React thay cho thẻ <a> để chuyển trang không bị load lại web */}
          <li><Link to="/">Home</Link></li>
          <li><Link to="/shop">Menu</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/login">Login</Link></li>
        </ul>
      </nav>
    </header>
  );
};