'use client';

import { useReviews } from '@/hooks/UseReviews';
import { CheckCircle, Star } from 'lucide-react';
import { useState } from 'react';

interface ReviewFormProps {
  productId: number;
  onReviewAdded?: () => void;
}

export default function ReviewForm({ productId, onReviewAdded }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { submitReview } = useReviews(productId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    setSuccess(false);
    try {
      await submitReview({ rating, comment });
      setComment('');
      setRating(5);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
      if (onReviewAdded) onReviewAdded();
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const characterCount = comment.length;
  const maxCharacters = 1000;

  return (
    <div className="bg-white rounded-2xl p-8 lg:p-12 border border-slate-200">
      <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-8">Share Your Experience</h3>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Rating Section */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-slate-700">
            Your Rating <span className="text-blue-600">*</span>
          </label>
          <div className="flex items-center gap-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1 transition-all duration-200 hover:scale-125 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                aria-label={`Rate ${star} stars`}
              >
                <Star
                  className={`w-8 h-8 transition-colors ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 hover:text-amber-300'}`}
                />
              </button>
            ))}
            <span className="ml-4 text-sm font-medium text-slate-600">{rating} out of 5</span>
          </div>
        </div>

        {/* Comment Section */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-slate-700">
            Your Review <span className="text-blue-600">*</span>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about this product. What did you like or dislike?"
            className="w-full h-40 px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
            maxLength={maxCharacters}
            required
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Min. 10 characters required</span>
            <span className={`text-xs font-medium ${characterCount > maxCharacters * 0.9 ? 'text-orange-600' : 'text-slate-500'}`}>
              {characterCount} / {maxCharacters}
            </span>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-lg p-4 animate-in fade-in slide-in-from-top-2">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="text-sm font-medium text-emerald-700">Thank you! Your review has been submitted successfully.</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={submitting || !comment.trim() || comment.length < 10}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:shadow-md"
          >
            {submitting ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              'Submit Review'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}