import "./ProductCard.css";
import { Icon } from "@/assets/svg";
import { Link } from "react-router-dom";
import { getImageUrl } from "@/lib/cloudinary";
import type { Product } from "@/features/products/product.types";

interface ProductCardProps {
  product: Product;
  vertical?: boolean;
}

export const ProductCard = ({ product, vertical = false }: ProductCardProps) => {
  const mainImageId = product.image_id || product.gallery_ids?.[0];

  if (vertical) {
    return (
      <article className="product-card product-card--vertical">
        <Link to={`/product/${product.slug}`} className="product-card__link">
          <div className="product-card__image-wrapper">
            <img
              className="product-card__image"
              src={getImageUrl(mainImageId)}
              alt={product.name}
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://placehold.co/40x40/1e293b/94a3b8?text=🍣";
              }}
            />
          </div>
        </Link>

        <div className="product-card__right">
          <Link to={`/product/${product.slug}`} className="product-card__link" style={{ flex: "unset" }}>
            <div className="product-card__content">
              <h4 className="product-card__title">{product.name}</h4>
              <div className="product-card__details">
                <div className="product-card__rating">
                  <img src={Icon.star} alt="star" />
                  <span>{product.ratingSummary?.averageRating || 5.0}</span>
                </div>
                <p className="product-card__price">
                  {product.price.toLocaleString("vi-VN")}đ
                </p>
              </div>
            </div>
          </Link>

          <div className="product-card__actions">
            <Link to={`/product/${product.slug}`} className="product-card__btn-link">
              <button className="product-card__btn">View Detail</button>
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="product-card">
      <Link to={`/product/${product.slug}`} className="product-card__link">
        <div className="product-card__image-wrapper">
          <img
            className="product-card__image"
            src={getImageUrl(mainImageId)}
            alt={product.name}
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://placehold.co/40x40/1e293b/94a3b8?text=🍣";
            }}
          />
        </div>

        <div className="product-card__content">
          <h4 className="product-card__title">{product.name}</h4>

          <div className="product-card__details flex-between">
            <div className="product-card__rating">
              <img src={Icon.star} alt="star" />
              <span>{product.ratingSummary?.averageRating || 5.0}</span>
            </div>

            <p className="product-card__price">
              {product.price.toLocaleString("vi-VN")}đ
            </p>
          </div>
        </div>
      </Link>

      <div className="product-card__actions">
        <Link to={`/product/${product.slug}`} className="product-card__btn-link">
          <button className="product-card__btn">
            View Detail
          </button>
        </Link>
      </div>
    </article>
  );
};
