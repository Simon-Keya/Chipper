'use client';

import { addReview, fetchReviews } from '@/lib/api';
import { Review } from '@/lib/types';
import { useCallback, useEffect, useState } from 'react';

export const useReviews = (productId: number) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchReviewsData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchReviews(productId);
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviewsData();
  }, [fetchReviewsData]);

  const submitReview = async (reviewData: { rating: number; comment: string }) => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');
      const newReview = await addReview(productId, reviewData, token);
      setReviews(prev => [newReview, ...prev]);
      return newReview;
    } catch (err) {
      console.error('Error submitting review:', err);
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