import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ProductCard, type Product } from "@/components/ui/ProductCard";
import { Images } from "@/assets/image";
import { Icon } from "@/assets/svg";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Loader } from "@/components/ui/Loader";

// Extended Product type for details
interface ProductDetail extends Product {
  gallery: string[];
  description: string;
  ingredients: string[];
  nutrition: { label: string; value: string }[];
  reviews: { id: string; user: string; rating: number; date: string; comment: string; likes: number }[];
}

const MOCK_DETAIL_DATA: Record<string, ProductDetail> = {
  "1": {
    id: "1",
    name: "Chezu Sushi",
    price: 21,
    image: Images.sushi.s12,
    rating: 4.9,
    category: "Sushi",
    gallery: [Images.sushi.s12, Images.sushi.s11, Images.sushi.s10],
    description: "Inspired by the serene winters of Hokkaido, Chezu Sushi combines premium aged cheddar with the freshest Atlantic salmon. A daring yet harmonious fusion that melts on the tongue, crafted by Chef Itsu to challenge and delight the palate.",
    ingredients: ["Atlantic Salmon", "Aged Cheddar", "Vinegared Rice", "Nori", "Wasabi", "Pickled Ginger"],
    nutrition: [
      { label: "Calories", value: "320 kcal" },
      { label: "Protein", value: "18g" },
      { label: "Carbs", value: "42g" },
      { label: "Fat", value: "12g" }
    ],
    reviews: [
      { id: "r1", user: "Yuki Tanaka", rating: 5, date: "2024-03-15", comment: "An unexpected masterpiece. The cheese doesn't overpower the fish, it enhances it.", likes: 12 },
      { id: "r2", user: "Michael Chen", rating: 4, date: "2024-03-10", comment: "Beautiful presentation. A bit rich for some, but definitely a unique experience.", likes: 5 }
    ]
  },
  "2": {
    id: "2",
    name: "Original Sushi",
    price: 19,
    image: Images.sushi.s11,
    rating: 5.0,
    category: "Sushi",
    gallery: [Images.sushi.s11, Images.sushi.s12, Images.sushi.s9],
    description: "The essence of ItsuSushi. Pure, simple, and perfected through decades of tradition. Hand-pressed rice meets catch-of-the-day yellowtail, seasoned with our secret shoyu blend.",
    ingredients: ["Yellowtail Fish", "Vinegared Rice", "House Shoyu", "Wasabi"],
    nutrition: [
      { label: "Calories", value: "280 kcal" },
      { label: "Protein", value: "22g" },
      { label: "Carbs", value: "38g" },
      { label: "Fat", value: "6g" }
    ],
    reviews: [
      { id: "r3", user: "Sato San", rating: 5, date: "2024-03-20", comment: "This is what sushi should be. Perfection in simplicity.", likes: 24 }
    ]
  }
};

const RELATED_PRODUCTS: Product[] = [
  { id: "3", name: "Ramen Legendo", price: 13, image: Images.sushi.s10, rating: 4.7, category: "Ramen" },
  { id: "4", name: "Salmon Sashimi", price: 25, image: Images.sushi.s9, rating: 4.8, category: "Sushi" },
  { id: "2", name: "Original Sushi", price: 19, image: Images.sushi.s11, rating: 5.0, category: "Sushi" },
  { id: "5", name: "Udon Classic", price: 15, image: Images.sushi.s8, rating: 4.6, category: "Udon" },
];

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [activeImage, setActiveImage] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"ingredients" | "nutrition" | "policy">("ingredients");
  const [product, setProduct] = useState<ProductDetail | null>(null);

  useEffect(() => {
    // Simulate API fetch
    if (id && MOCK_DETAIL_DATA[id]) {
      const data = MOCK_DETAIL_DATA[id];
      setProduct(data);
      setActiveImage(data.gallery[0]);
    }
  }, [id]);

  if (!product) {
    return (
      <div className="product-detail-page page-container">
        <div className="product-detail__loading">
          <Loader />
          <Link to="/menu" className="btn-back">Back to Menu</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page page-container">
      {/* Breadcrumbs */}
      <Breadcrumb items={[{ label: "Menu", path: "/menu" }, { label: product.name }]} />

      <div className="container-content">
        <section className="product-detail__main">
          {/* Gallery */}
          <div className="product-detail__gallery">
            <div className="product-detail__main-image">
              <img src={activeImage} alt={product.name} />
            </div>
            <div className="product-detail__thumbnails">
              {product.gallery.map((img, idx) => (
                <div
                  key={idx}
                  className={`thumbnail ${activeImage === img ? "active" : ""}`}
                  onClick={() => setActiveImage(img)}
                >
                  <img src={img} alt={`${product.name} thumbnail ${idx}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="product-detail__info">
            <span className="product-detail__category">{product.category}</span>
            <h1 className="product-detail__name">{product.name}</h1>

            <div className="product-detail__meta">
              <div className="product-detail__rating">
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i}
                    src={Icon.star}
                    alt="star"
                    className={i < Math.floor(product.rating) ? "star--filled" : "star--empty"}
                  />
                ))}
                <span>({product.rating})</span>
              </div>
              <p className="product-detail__price">${product.price}.00</p>
            </div>

            <p className="product-detail__description">{product.description}</p>

            <div className="product-detail__actions">
              <button className="btn-wishlist-large">
                Add to Wishlist
              </button>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="product-detail__tabs">
          <div className="tab-headers">
            <button className={activeTab === "ingredients" ? "active" : ""} onClick={() => setActiveTab("ingredients")}>Ingredients</button>
            <button className={activeTab === "nutrition" ? "active" : ""} onClick={() => setActiveTab("nutrition")}>Nutrition Facts</button>
            <button className={activeTab === "policy" ? "active" : ""} onClick={() => setActiveTab("policy")}>Dining Policy</button>
          </div>
          <div className="tab-content">
            {activeTab === "ingredients" && (
              <ul className="ingredients-list">
                {product.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
              </ul>
            )}
            {activeTab === "nutrition" && (
              <div className="nutrition-grid">
                {product.nutrition.map((item, i) => (
                  <div key={i} className="nutrition-item">
                    <span className="label">{item.label}</span>
                    <span className="value">{item.value}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "policy" && (
              <p className="policy-text">
                This item is available for dine-in only to ensure optimal freshness.
                Please note that ingredients may vary based on seasonal availability.
              </p>
            )}
          </div>
        </section>

        {/* Reviews */}
        <section className="product-detail__reviews">
          <h2 className="section-title">Guest Experience</h2>
          <div className="reviews-list">
            {product.reviews.map(review => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <span className="review-user">{review.user}</span>
                  <span className="review-date">{review.date}</span>
                </div>
                <div className="review-rating">
                  {[...Array(5)].map((_, i) => (
                    <img key={i} src={Icon.star} alt="star" className={i < review.rating ? "star--filled" : ""} />
                  ))}
                </div>
                <p className="review-comment">{review.comment}</p>
                <div className="review-actions">
                  <button className="btn-like">Helpful ({review.likes})</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Related */}
        <section className="product-detail__related">
          <h2 className="section-title">You Might Also Like</h2>
          <div className="related-grid">
            {RELATED_PRODUCTS.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
