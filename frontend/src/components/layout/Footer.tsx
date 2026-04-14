import { Icon } from "@/assets/svg";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <div>
      <footer className="footer flex-between">
        <h3 className="footer__logo">
          <span>Itsu</span>Sushi
        </h3>

        <ul className="footer__nav">
          <li>
            <Link to="#menu">Menu</Link>
          </li>
          <li>
            <Link to="#food">Food</Link>
          </li>
          <li>
            <Link to="#services">Services</Link>
          </li>
          <li>
            <Link to="#about-us">About Us</Link>
          </li>
        </ul>

        <ul className="footer__social">
          <li className="flex-center">
            <img src={Icon.facebook} alt="facebook" />
          </li>
          <li className="flex-center">
            <img src={Icon.instagram} alt="instagram" />
          </li>
          <li className="flex-center">
            <img src={Icon.twitter} alt="twitter" />
          </li>
        </ul>
      </footer>
    </div>
  );
};
