import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { ProductCard } from "@/components/ui/ProductCard";
import { Icon } from "@/assets/svg";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Loader } from "@/components/ui/Loader";
import { productService } from "@/features/products/product.service";
import { reviewService } from "@/features/reviews/review.service";
import { ReviewForm } from "@/features/reviews/ReviewForm";
import { useAuthStore } from "@/stores/useAuthStore";
import type { ProductDetail, Product, Review } from "@/features/products/product.types";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user: currentUser } = useAuthStore();
  const [activeImage, setActiveImage] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<"ingredients" | "nutrition" | "policy">("ingredients");
  const [product, setProduct] = useState<ProductDetail | null>(null);

  // Lazy loading state
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreReviews, setHasMoreReviews] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviewsPage = useCallback(
    async (productId: string, page: number) => {
      try {
        setLoadingReviews(true);
        const data = await reviewService.getProductReviewsPaginated(productId, page, 5);

        if (page === 1) {
          // First page: replace all reviews
          setAllReviews(data.reviews);
        } else {
          // Subsequent pages: append reviews
          setAllReviews(prev => [...prev, ...data.reviews]);
        }

        setCurrentPage(page);
        setHasMoreReviews(data.hasMore);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoadingReviews(false);
      }
    },
    []
  );

  const handleLoadMore = useCallback(() => {
    if (product && !loadingReviews && hasMoreReviews) {
      fetchReviewsPage(product.id, currentPage + 1);
    }
  }, [product, currentPage, loadingReviews, hasMoreReviews, fetchReviewsPage]);

  const handleReviewAdded = useCallback(() => {
    if (product) {
      // Reset to page 1 when new review is added
      setCurrentPage(1);
      setAllReviews([]);
      fetchReviewsPage(product.id, 1);
    }
  }, [product, fetchReviewsPage]);

  useEffect(() => {
    const fetchProductDetail = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const data = await productService.getProductBySlug(slug);
        setProduct(data);
        setActiveImage(data.image);

        // Fetch first page of reviews
        await fetchReviewsPage(data.id, 1);

        // Fetch related products
        const related = await productService.getProducts(1, 4, data.category.id);
        setRelatedProducts(related.data.filter(p => p.slug !== slug));
      } catch (error) {
        console.error("Failed to fetch product details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetail();
  }, [slug, fetchReviewsPage]);

  if (loading) {
    return (
      <div className="product-detail-page page-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <Loader />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page page-container">
        <div className="product-detail__loading">
          <h2>Dish not found...</h2>
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
            {(product.gallery?.length ?? 0) > 0 && (
              <div className="product-detail__thumbnails">
                {product.gallery!.map((img, idx) => (
                  <div
                    key={idx}
                    className={`thumbnail ${activeImage === img ? "active" : ""}`}
                    onClick={() => setActiveImage(img)}
                  >
                    <img src={img} alt={`${product.name} thumbnail ${idx}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="product-detail__info">
            <span className="product-detail__category">{product.category.name || "Japanese Dish"}</span>
            <h1 className="product-detail__name">{product.name}</h1>

            <div className="product-detail__meta">
              <div className="product-detail__rating">
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i}
                    src={Icon.star}
                    alt="star"
                    className={i < Math.floor(product.ratingSummary.averageRating) ? "star--filled" : "star--empty"}
                  />
                ))}
                <span>({product.ratingSummary.averageRating.toFixed(1)})</span>
                {product.ratingSummary.totalReviews > 0 && (
                  <span className="reviews-count">{product.ratingSummary.totalReviews} {product.ratingSummary.totalReviews === 1 ? "review" : "reviews"}</span>
                )}
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
                {product.ingredients?.length ? (
                  product.ingredients.map((ing, i) => <li key={i}>{ing}</li>)
                ) : (
                  <li style={{ color: "var(--text-muted)", listStyle: "none" }}>No ingredient information available.</li>
                )}
              </ul>
            )}
            {activeTab === "nutrition" && (
              <div className="nutrition-grid">
                {product.nutrition?.length ? (
                  product.nutrition.map((item, i) => (
                    <div key={i} className="nutrition-item">
                      <span className="label">{item.label}</span>
                      <span className="value">{item.value}</span>
                    </div>
                  ))
                ) : (
                  <p style={{ color: "var(--text-muted)" }}>No nutrition information available.</p>
                )}
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

          {currentUser ? (
            <ReviewForm productId={product.id} onReviewAdded={handleReviewAdded} />
          ) : (
            <div className="review-login-prompt">
              <p>Please <Link to="/login">login</Link> to share your experience.</p>
            </div>
          )}

          <div className="reviews-list">
            {product.ratingSummary.totalReviews === 0 ? (
              <p className="no-reviews">No reviews yet. Be the first to share your thoughts!</p>
            ) : allReviews.length > 0 ? (
              <>
                {allReviews.map((review, idx) => (
                  <div key={review.id} className="review-card" style={{ animationDelay: `${idx * 0.1}s` }}>
                    <div className="review-header">
                      <span className="review-user">{(review as Review).user.name || "Anonymous User"}</span>
                      <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="review-rating">
                      {[...Array(5)].map((_, i) => (
                        <img key={i} src={Icon.star} alt="star" className={i < review.rating ? "star--filled" : ""} />
                      ))}
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))}

                {hasMoreReviews && (
                  <button
                    className="btn-load-more"
                    onClick={handleLoadMore}
                    disabled={loadingReviews}
                  >
                    {loadingReviews ? "Loading..." : "Load More Reviews"}
                  </button>
                )}
              </>
            ) : (
              loadingReviews && <Loader />
            )}
          </div>
        </section>

        {/* Related */}
        {relatedProducts.length > 0 && (
          <section className="product-detail__related">
            <h2 className="section-title">You Might Also Like</h2>
            <div className="related-grid">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
