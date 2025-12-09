import { addReview, fetchReviews } from '@/lib/api';
import { Review } from '@/lib/types';
import { useEffect, useState } from 'react';

export const useReviews = (productId: number) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReviewsData();
  }, [productId]);

  const fetchReviewsData = async () => {
    setLoading(true);
    try {
      const data = await fetchReviews(productId);
      setReviews(data);
    } catch (err) {
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (reviewData: { rating: number; comment: string }) => {
    setSubmitting(true);
    try {
      const newReview = await addReview(productId, reviewData);
      setReviews(prev => [newReview, ...prev]);
      return newReview;
    } catch (err) {
      setError('Failed to submit review');
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length || 0;

  return {
    reviews,
    averageRating,
    loading,
    submitting,
    error,
    submitReview,
    refetch: fetchReviewsData,
  };
};