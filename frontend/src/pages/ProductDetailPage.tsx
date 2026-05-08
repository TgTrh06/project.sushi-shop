import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { ProductCard } from "@/components/ui/ProductCard";
import { Icon } from "@/assets/svg";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Loader } from "@/components/ui/Loader";
import { getImageUrl, getThumbnailUrl, getFullUrl } from "@/lib/cloudinary";
import { productService } from "@/features/products/product.service";
import { reviewService } from "@/features/reviews/review.service";
import { ReviewForm } from "@/features/reviews/ReviewForm";
import { useAuthStore } from "@/stores/useAuthStore";
import type { Product, Review } from "@/features/products/product.types";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user: currentUser } = useAuthStore();
  const [activeImageId, setActiveImageId] = useState<string | undefined>(undefined);
  const [product, setProduct] = useState<Product | null>(null);

  const getCategoryName = useCategoryStore((state) => state.getCategoryName);
  const fetchCategories = useCategoryStore((state) => state.fetchCategories);

  // Lazy loading state
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreReviews, setHasMoreReviews] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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
        setActiveImageId(data.image_id || "");

        // Fetch first page of reviews
        await fetchReviewsPage(data.id, 1);

        // Fetch related products
        const related = await productService.getProducts(1, 4, data.categoryId);
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
              <img src={activeImageId ? getFullUrl(activeImageId) : "https://placehold.co/800x600?text=Sushi"} alt={product.name} />
            </div>
            {(product.gallery_ids?.length ?? 0) > 0 && (
              <div className="product-detail__thumbnails">
                {product.gallery_ids!.map((galleryId, idx) => {
                  const img = product.gallery_ids?.[idx];
                  return (
                    <div
                      key={idx}
                      className={`thumbnail ${activeImageId === galleryId ? "active" : ""}`}
                      onClick={() => {
                        setActiveImageId(galleryId);
                      }}
                    >
                      <img src={galleryId ? getThumbnailUrl(galleryId) : img} alt={`${product.name} thumbnail ${idx}`} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="product-detail__info">
            <span className="product-detail__category">
              {getCategoryName(product.categoryId) || "Japanese Dish"}
            </span>
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
                    {review.photos && review.photos.length > 0 && (
                      <div className="review-photos" style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
                        {review.photos.map((photo, photoIdx) => (
                          <img
                            key={photoIdx}
                            src={getImageUrl(photo, review.photo_ids?.[photoIdx])}
                            alt={`Review photo ${photoIdx + 1}`}
                            style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "4px" }}
                          />
                        ))}
                      </div>
                    )}
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
