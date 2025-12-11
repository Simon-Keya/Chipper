'use client';

import { useReviews } from '@/hooks/UseReviews';
import { Star } from 'lucide-react';
import { useState } from 'react';

interface ReviewFormProps {
  productId: number;
  onReviewAdded?: () => void;
}

export default function ReviewForm({ productId, onReviewAdded }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { submitReview } = useReviews(productId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      await submitReview({ rating, comment });
      setComment('');
      setRating(5);
      if (onReviewAdded) onReviewAdded();
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-base-200 rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-semibold text-base-content">Add Your Review</h3>
      
      {/* Rating Stars */}
      <div className="flex items-center gap-1">
        {[5, 4, 3, 2, 1].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={`p-1 transition-colors ${rating >= star ? 'text-warning fill-current' : 'text-base-content/40 hover:text-warning'}`}
          >
            <Star className="w-6 h-6" />
          </button>
        ))}
      </div>

      {/* Comment */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience with this product..."
        className="textarea textarea-bordered w-full h-24 resize-none"
        maxLength={1000}
      />

      <div className="flex justify-between items-center text-sm text-base-content/60">
        <span>{comment.length}/1000 characters</span>
        <button type="submit" disabled={submitting || !comment.trim()} className="btn btn-primary btn-sm">
          {submitting ? <span className="loading loading-spinner"></span> : 'Submit Review'}
        </button>
      </div>
    </form>
  );
}