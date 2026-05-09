import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getThumbnailUrl, getFullUrl } from "@/lib/cloudinary";
import { GalleryNavBtn } from "@/components/ui/GalleryNavBtn";
import "./ProductGallery.css";

interface ProductGalleryProps {
  mainImageId: string;
  galleryIds: string[];
  productName: string;
}

const VISIBLE_COUNT = 4;

export const ProductGallery = ({
  mainImageId,
  galleryIds,
  productName,
}: ProductGalleryProps) => {
  // All image ids: main first, then gallery
  const allIds = [
    ...(mainImageId ? [mainImageId] : []),
    ...galleryIds,
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [thumbOffset, setThumbOffset] = useState(0); // index of first visible thumbnail

  const activeId = allIds[activeIndex] ?? "";

  const handleSelect = (index: number) => {
    setActiveIndex(index);
  };

  const handlePrev = () => {
    const newIndex = activeIndex === 0 ? allIds.length - 1 : activeIndex - 1;
    setActiveIndex(newIndex);
    // Adjust thumb window so active thumb is visible
    if (newIndex < thumbOffset) {
      setThumbOffset(newIndex);
    } else if (newIndex === allIds.length - 1) {
      setThumbOffset(Math.max(0, allIds.length - VISIBLE_COUNT));
    }
  };

  const handleNext = () => {
    const newIndex = activeIndex === allIds.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(newIndex);
    // Adjust thumb window so active thumb is visible
    if (newIndex >= thumbOffset + VISIBLE_COUNT) {
      setThumbOffset(newIndex - VISIBLE_COUNT + 1);
    } else if (newIndex === 0) {
      setThumbOffset(0);
    }
  };

  const handleThumbUp = () => {
    setThumbOffset((prev) => Math.max(0, prev - 1));
  };

  const handleThumbDown = () => {
    setThumbOffset((prev) =>
      Math.min(allIds.length - VISIBLE_COUNT, prev + 1)
    );
  };

  const visibleThumbs = allIds.slice(thumbOffset, thumbOffset + VISIBLE_COUNT);
  const canThumbUp = thumbOffset > 0;
  const canThumbDown = thumbOffset + VISIBLE_COUNT < allIds.length;

  return (
    <div className="product-gallery">
      {/* Thumbnail strip (left, vertical) */}
      {allIds.length > 1 && (
        <div className="product-gallery__thumb-strip">
          {/* Placeholder để giữ layout khi nút ẩn */}
          <div className="gallery-nav-btn-slot">
            <GalleryNavBtn 
              direction="up" 
              onClick={handleThumbUp}
              disabled={!canThumbUp}
            />
          </div>

          <div className="product-gallery__thumbs">
            {visibleThumbs.map((id, i) => {
              const realIndex = thumbOffset + i;
              return (
                <div
                  key={id}
                  className={`thumbnail ${activeIndex === realIndex ? "active" : ""}`}
                  onClick={() => handleSelect(realIndex)}
                >
                  <img
                    src={getThumbnailUrl(id)}
                    alt={`${productName} thumbnail ${realIndex + 1}`}
                  />
                </div>
              );
            })}
          </div>

          <div className="gallery-nav-btn-slot">
            <GalleryNavBtn 
              direction="down" 
              onClick={handleThumbDown}
              disabled={!canThumbDown}
            />
          </div>
        </div>
      )}

      {/* Main image + prev/next nav */}
      <div className="product-gallery__main-wrapper">
        <button
          className="gallery-main-nav gallery-main-nav--prev"
          onClick={handlePrev}
          aria-label="Previous image"
        >
          <ChevronLeft size={16} strokeWidth={2.5} />
        </button>

        <div className="product-gallery__main">
          <img
            src={activeId ? getFullUrl(activeId) : "https://placehold.co/800x600?text=Sushi"}
            alt={productName}
          />
        </div>

        <button
          className="gallery-main-nav gallery-main-nav--next"
          onClick={handleNext}
          aria-label="Next image"
        >
          <ChevronRight size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};
