import "./ProductCard.css";
import { Icon } from "@/assets/svg";
import { Link } from "react-router-dom";
import { WishListButton } from "@/components/ui/WishListButton";
import type { Product } from "@/features/products/product.types";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <article className="product-card">
      <Link to={`/product/${product.slug}`} className="product-card__link">
        <div className="product-card__image-wrapper">
          <img
            className="product-card__image"
            src={product.image || "https://placehold.co/600x400?text=Sushi"}
            alt={product.name}
            loading="lazy"
          />
        </div>

        <div className="product-card__content">
          <h4 className="product-card__title">{product.name}</h4>

          <div className="product-card__details flex-between">
            <div className="product-card__rating">
              <img src={Icon.star} alt="star" />
              <span>{product.ratingSummary?.averageRating || 5.0}</span>
            </div>

            <p className="product-card__price">${product.price}.00</p>
          </div>
        </div>
      </Link>

      <div className="product-card__actions">
        <Link to={`/product/${product.slug}`} className="product-card__btn-link">
          <button className="product-card__btn">
            View Detail
          </button>
        </Link>
        <WishListButton />
      </div>
    </article>
  );
};
