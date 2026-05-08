import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import "./ScrollToTopButton.css";

export const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      className="scroll-to-top"
      onClick={handleClick}
      aria-label="Scroll to top"
    >
      <ChevronUp size={22} strokeWidth={2.5} />
    </button>
  );
};
