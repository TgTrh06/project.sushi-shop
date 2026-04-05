import { Link } from "react-router-dom";
import "./header.css";
import { useAuthStore } from "@/stores/auth.store";
import { UserMenu } from "./UserMenu";

export const Navbar = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <header>
      <nav className="header__nav">
        <div className="header__logo">
          <Link to="/" className="text-2xl font-bold text-orange-600">
            <h4>ItsuSushi</h4>
            <div className="header__logo-overlay"></div>
          </Link>
        </div>

        <div className="header__menu">
          <Link title="Home" to="/" className="hover:text-orange-600">Trang chủ</Link>
          <Link title="Menu" to="/menu" className="hover:text-orange-600">Thực đơn</Link>
          {user && (
            <Link title="Booking" to="/booking" className="text-red-600 font-bold">Đặt bàn</Link>
          )}
          {user?.role === 'admin' && (
            <Link title="Admin" to="/admin" className="text-red-600 font-bold">Quản trị</Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <UserMenu />
          ) : (
            <div className="flex gap-2">
              <Link title="Login" to="/sign-in" className="px-4 py-2 text-orange-600">Đăng nhập</Link>
              <Link title="Register" to="/sign-up" className="px-4 py-2 bg-orange-600 text-white rounded-lg">Đăng ký</Link>
            </div>
          )}
        </div>
        {/* <ul className="header__menu">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/Menu">Menu</Link>
        </li>
        <li>
          <Link to="/booking">Booking</Link>
        </li>
        <li>
          <Link to="/about">About Us</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
      </ul> */}
      </nav>
    </header >
  );
};
