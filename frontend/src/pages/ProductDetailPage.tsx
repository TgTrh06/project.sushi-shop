import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductGallery } from "@/components/ui/ProductGallery";
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
  
  // Product state
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reviews state
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreReviews, setHasMoreReviews] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Related products state
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  // Category store
  const getCategoryName = useCategoryStore((state) => state.getCategoryName);
  const fetchCategories = useCategoryStore((state) => state.fetchCategories);

  // Helper function to fetch related products with fallback
  const fetchRelatedProducts = async (
    currentProduct: Product,
    categoryName: string
  ): Promise<Product[]> => {
    try {
      // Stage 1: Fetch products from the same category
      const categoryProducts = await productService.getProducts(1, 4, categoryName);
      
      // Filter out the current product
      const filteredCategoryProducts = categoryProducts.data.filter(
        (p) => p.slug !== currentProduct.slug
      );
      
      // Stage 2: If we have fewer than 4, fetch random products to fill
      if (filteredCategoryProducts.length < 4) {
        const needed = 4 - filteredCategoryProducts.length;
        const randomProducts = await productService.getProducts(1, needed + 5);
        
        // Filter out current product and already included products
        const existingIds = new Set([
          currentProduct.id,
          ...filteredCategoryProducts.map(p => p.id)
        ]);
        
        const additionalProducts = randomProducts.data
          .filter(p => !existingIds.has(p.id))
          .slice(0, needed);
        
        return [...filteredCategoryProducts, ...additionalProducts];
      }
      
      // Return up to 4 category products
      return filteredCategoryProducts.slice(0, 4);
    } catch (error) {
      console.error("Failed to fetch related products:", error);
      return [];
    }
  };

  // Initialize categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Fetch reviews for a specific page
  const fetchReviewsPage = useCallback(
    async (productId: string, page: number) => {
      if (!productId) return;
      
      try {
        setLoadingReviews(true);
        const data = await reviewService.getProductReviewsPaginated(productId, page, 5);

        if (page === 1) {
          setAllReviews(data.reviews);
        } else {
          setAllReviews((prev) => [...prev, ...data.reviews]);
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

  // Handle load more reviews
  const handleLoadMore = useCallback(() => {
    if (product && !loadingReviews && hasMoreReviews) {
      fetchReviewsPage(product.id, currentPage + 1);
    }
  }, [product, currentPage, loadingReviews, hasMoreReviews, fetchReviewsPage]);

  // Handle new review added
  const handleReviewAdded = useCallback(() => {
    if (product) {
      // Refresh product to get updated rating summary
      productService.getProductBySlug(slug!).then((updatedProduct) => {
        setProduct(updatedProduct);
      });
      
      // Reset reviews to page 1
      setCurrentPage(1);
      setAllReviews([]);
      fetchReviewsPage(product.id, 1);
    }
  }, [product, slug, fetchReviewsPage]);

  // Main effect: Fetch product details
  useEffect(() => {
    const fetchProductDetail = async () => {
      if (!slug) {
        setError("Product slug is missing");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch product by slug
        const productData = await productService.getProductBySlug(slug);
        setProduct(productData);

        // Fetch first page of reviews
        try {
          const reviewData = await reviewService.getProductReviewsPaginated(
            productData.id,
            1,
            5
          );
          setAllReviews(reviewData.reviews);
          setCurrentPage(1);
          setHasMoreReviews(reviewData.hasMore);
        } catch (reviewError) {
          console.error("Failed to fetch reviews:", reviewError);
        }

        // Fetch related products by category name (slug), not categoryId
        try {
          const categoryName = getCategoryName(productData.categoryId);
          if (categoryName && categoryName !== "Japanese Dish") {
            const related = await fetchRelatedProducts(productData, categoryName);
            setRelatedProducts(related);
          } else {
            // Fetch random products if no specific category
            const random = await productService.getProducts(1, 4);
            setRelatedProducts(random.data.filter((p) => p.slug !== slug));
          }
        } catch (relatedError) {
          console.error("Failed to fetch related products:", relatedError);
          setRelatedProducts([]);
        }
      } catch (err) {
        console.error("Failed to fetch product details:", err);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [slug, getCategoryName]);

  // Loading state
  if (loading) {
    return (
      <div className="product-detail-page page-container">
        <Loader />
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="product-detail-page page-container">
        <div className="product-detail__loading">
          <h2>{error || "Dish not found..."}</h2>
          <Link to="/menu" className="btn-back">
            Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="product-detail-page page-container">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[{ label: "Menu", path: "/menu" }, { label: product.name }]}
      />

      <div className="product-detail-content">
        {/* Main Content (Left) */}
        <div className="product-detail-main">
          {/* Gallery Card with embedded Product Info */}
          <div className="detail-card">
            <div className="product-gallery-wrapper">
              {/* Gallery Section - 60% */}
              <ProductGallery
                mainImageId={product.image_id ?? ""}
                galleryIds={product.gallery_ids ?? []}
                productName={product.name}
              />

              {/* Product Info Section - 30% */}
              <div className="product-info-card">
                <span className="product-category">
                  {getCategoryName(product.categoryId) || "Japanese Dish"}
                </span>
                <h1 className="product-name">{product.name}</h1>

                <div className="product-rating">
                  {[...Array(5)].map((_, i) => (
                    <img
                      key={i}
                      src={Icon.star}
                      alt="star"
                      className={
                        i < Math.floor(product.ratingSummary.averageRating)
                          ? "star--filled"
                          : "star--empty"
                      }
                    />
                  ))}
                  <span className="rating-value">
                    ({product.ratingSummary.averageRating.toFixed(1)})
                  </span>
                  {product.ratingSummary.totalReviews > 0 && (
                    <span className="reviews-count">
                      {product.ratingSummary.totalReviews}{" "}
                      {product.ratingSummary.totalReviews === 1 ? "review" : "reviews"}
                    </span>
                  )}
                </div>

                <p className="product-price">{product.price.toLocaleString("vi-VN")}₫</p>

                <button className="btn-wishlist">Add to Wishlist</button>
              </div>
            </div>
          </div>

          {/* Reviews Card */}
          <div className="detail-card">
            <h2 className="product-card-title">Guest Experience</h2>

            {currentUser ? (
              <ReviewForm
                productId={product.id}
                onReviewAdded={handleReviewAdded}
              />
            ) : (
              <div className="review-login-prompt">
                <p>
                  Please <Link to="/login">login</Link> to share your experience.
                </p>
              </div>
            )}

            <div className="reviews-list">
              {product.ratingSummary.totalReviews === 0 ? (
                <p className="no-reviews">
                  No reviews yet. Be the first to share your thoughts!
                </p>
              ) : allReviews.length > 0 ? (
                <>
                  {allReviews.map((review) => (
                    <div key={review.id} className="review-card">
                      <div className="review-header">
                        <span className="review-user">
                          {review.user?.name || "Anonymous User"}
                        </span>
                        <span className="review-date">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="review-rating">
                        {[...Array(5)].map((_, i) => (
                          <img
                            key={i}
                            src={Icon.star}
                            alt="star"
                            className={i < review.rating ? "star--filled" : ""}
                          />
                        ))}
                      </div>
                      <p className="review-comment">{review.comment}</p>
                      {review.photo_ids && review.photo_ids.length > 0 && (
                        <div className="review-photos">
                          {review.photo_ids.map((photoId, photoIdx) => (
                            <img
                              key={photoIdx}
                              src={getImageUrl(photoId, getThumbnailUrl)}
                              alt={`Review photo ${photoIdx + 1}`}
                              onClick={() =>
                                window.open(getImageUrl(photoId, getFullUrl), "_blank")
                              }
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
          </div>
        </div>

        {/* Sidebar (Right) */}
        <aside className="product-sidebar">
          {relatedProducts.length > 0 && (
            <div className="detail-card">
              <h2 className="product-card-title">You Might Also Like</h2>
              <div className="related-list">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} vertical />
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
