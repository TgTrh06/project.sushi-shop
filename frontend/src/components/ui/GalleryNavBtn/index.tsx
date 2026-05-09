import { ChevronUp, ChevronDown } from "lucide-react";
import "./GalleryNavBtn.css";

interface GalleryNavBtnProps {
  direction: "up" | "down";
  onClick: () => void;
  disabled?: boolean;
  "aria-label"?: string;
}

export const GalleryNavBtn = ({
  direction,
  onClick,
  disabled = false,
  "aria-label": ariaLabel,
}: GalleryNavBtnProps) => {
  return (
    <button
      className={`gallery-nav-btn gallery-nav-btn--${direction}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel ?? (direction === "up" ? "Previous image" : "Next image")}
    >
      {direction === "up" ? <ChevronUp size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />}
    </button>
  );
};
