import { useState } from "react";
import { Icon } from "@/assets/svg";
import { reviewService } from "./review.service";
import { showError, showSuccess } from "@/lib/toast";

interface ReviewFormProps {
  productId: string;
  onReviewAdded: () => void;
}

export const ReviewForm = ({ productId, onReviewAdded }: ReviewFormProps) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      await reviewService.addReview(productId, rating, comment);
      showSuccess("Thank you for your review!");
      setComment("");
      setRating(5);
      onReviewAdded();
    } catch {
      showError("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3 className="review-form__title">Share your experience</h3>
      
      <div className="review-form__rating">
        <p>Rating</p>
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              className={`star-btn ${star <= rating ? "active" : ""}`}
              onClick={() => setRating(star)}
            >
              <img src={Icon.star} alt="star" />
            </button>
          ))}
        </div>
      </div>

      <div className="review-form__field">
        <textarea
          placeholder="Write your review here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          maxLength={1000}
        />
      </div>

      <button type="submit" className="btn-submit-review" disabled={submitting}>
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};
