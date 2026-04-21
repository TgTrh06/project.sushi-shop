import { Link } from "react-router-dom";
import "./Footer.css";
import { SocialButtons } from "@/components/ui/SocialButtons";

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__main">
          {/* Col 1: Brand / Intro */}
          <div className="footer__col footer__col--brand">
            <h3 className="footer__logo">
              <span>Itsu</span>Sushi
            </h3>
            <p className="footer__vision">
              Crafting authentic Japanese flavors with a modern minimalist soul.
              Taste the essence of Zen in every bite.
            </p>
            <SocialButtons />
          </div>

          {/* Col 2: Quick Links */}
          <div className="footer__col">
            <h4 className="footer__heading">Quick Links</h4>
            <ul className="footer__links">
              <li><Link to="/menu">Our Menu</Link></li>
              <li><Link to="/reserve">Reservations</Link></li>
              <li><Link to="/about">Our Story</Link></li>
              <li><Link to="/careers">Careers</Link></li>
            </ul>
          </div>

          {/* Col 3: Contact Info */}
          <div className="footer__col">
            <h4 className="footer__heading">Contact Us</h4>
            <ul className="footer__contact">
              <li>123 Sushi Way, Tokyo District</li>
              <li>+84 901 234 567</li>
              <li>hello@itsusushi.com</li>
              <li className="footer__hours">
                <span>Mon - Sun:</span> 11:00 AM - 10:00 PM
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="footer__col footer__col--newsletter">
            <h4 className="footer__heading">Newsletter</h4>
            <p className="footer__newsletter-text">Join our circle for exclusive seasonal updates.</p>
            <form className="footer__form" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                className="footer__input"
              />
              <button type="submit" className="footer__subscribe-btn">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            © {new Date().getFullYear()} ItsuSushi Restaurant Group. All rights reserved.
          </p>
          <div className="footer__legal">
            <Link to="/privacy">Privacy Policy</Link>
            <span className="footer__separator">•</span>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
