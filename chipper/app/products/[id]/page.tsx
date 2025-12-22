'use client';

import { addReview, fetchProduct, fetchReviews } from '@/lib/api';
import { Product, Review } from '@/lib/types';
import { ShoppingCart, Star, Truck } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const WHATSAPP_NUMBER = '+254768378046';

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    if (id) {
      const loadData = async () => {
        setLoading(true);
        try {
          const prodData = await fetchProduct(id);
          if (prodData && typeof prodData === 'object') {
            setProduct(prodData as Product);
          } else {
            console.error('Invalid product data:', prodData);
            setProduct(null);
          }

          const reviewData = await fetchReviews(Number(id));
          setReviews(Array.isArray(reviewData) ? reviewData : []);
        } catch (error) {
          console.error('Failed to load product data:', error);
          setProduct(null);
          setReviews([]);
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product || product.stock < quantity) return;

    let cart: Array<{
      productId: number;
      product: { id: number; name: string; price: number; imageUrl?: string };
      quantity: number;
    }> = [];

    try {
      const stored = localStorage.getItem('chipper_cart');
      if (stored) {
        const parsed = JSON.parse(stored);
        cart = Array.isArray(parsed) ? parsed : [];
      }
    } catch (e) {
      console.error('Corrupted cart data, resetting');
      cart = [];
    }

    const existing = cart.find(item => item.productId === product.id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        productId: product.id,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
        },
        quantity,
      });
    }

    localStorage.setItem('chipper_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
    alert(`${quantity} × ${product.name} added to cart!`);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.comment.trim()) return;

    setReviewLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to leave a review');
        return;
      }

      const savedReview = await addReview(Number(id), {
        rating: newReview.rating,
        comment: newReview.comment,
      }, token);

      setReviews(prev => [savedReview, ...prev]);
      setNewReview({ rating: 5, comment: '' });
      setShowReviewForm(false);
      alert('Thank you! Your review has been submitted.');
    } catch (error) {
      alert('Failed to submit review. Please try again.');
    } finally {
      setReviewLoading(false);
    }
  };

  const handleWhatsappOrder = () => {
    const message = encodeURIComponent(
      `Hello! I'd like to order:\n\n` +
      `Product: ${product?.name}\n` +
      `Quantity: ${quantity}\n` +
      `Price: KSh ${(product?.price || 0) * quantity}\n` +
      `Link: ${window.location.href}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center py-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center py-20">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md text-center">
          <h2 className="text-3xl font-bold text-error mb-4">Product Not Found</h2>
          <p className="text-gray-600">The product you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Main Product Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Image Section */}
          <div className="relative aspect-square lg:aspect-auto">
            <Image
              src={product.imageUrl || '/placeholder.jpg'}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              priority
            />
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white text-4xl font-bold bg-error px-8 py-4 rounded-2xl">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="p-8 lg:p-16 flex flex-col justify-between">
            <div>
              {/* Title & Rating */}
              <h1 className="text-4xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-6 mb-8">
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-8 h-8 ${i < Math.round(avgRating) 
                        ? 'fill-amber-400 text-amber-400' 
                        : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-xl font-semibold text-gray-700">
                  {avgRating.toFixed(1)} • {reviews.length} reviews
                </span>
              </div>

              {/* Price */}
              <div className="mb-10">
                <p className="text-6xl font-black text-emerald-600">
                  KSh {product.price.toLocaleString()}
                </p>
                <p className="text-lg text-gray-600 mt-2">Free delivery nationwide</p>
              </div>

              {/* Description */}
              <div className="mb-12">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {product.description || 'Premium quality product with exceptional features and durability.'}
                </p>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-4 mb-10">
                <Truck className="w-8 h-8 text-emerald-600" />
                <span className={`text-xl font-semibold ${product.stock > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {product.stock > 0 
                    ? `${product.stock} in stock — Ready to ship` 
                    : 'Currently unavailable'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-6">
              {/* Quantity Selector */}
              {product.stock > 0 && (
                <div className="flex items-center gap-6">
                  <span className="text-xl font-medium text-gray-700">Quantity:</span>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="btn btn-circle btn-lg btn-outline hover:bg-primary hover:text-white"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="text-3xl font-bold w-20 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="btn btn-circle btn-lg btn-outline hover:bg-primary hover:text-white"
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Primary Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="btn btn-primary btn-lg text-xl font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all"
                >
                  <ShoppingCart className="w-7 h-7" />
                  Add to Cart
                </button>

                <button
                  onClick={handleWhatsappOrder}
                  className="btn btn-lg text-xl font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all"
                  style={{ backgroundColor: '#25D366', color: 'white' }}
                >
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.039 21.031c-1.571 0-3.111-.476-4.437-1.353l-4.706 1.24a.657.657 0 0 1-.84-.817l1.244-4.665c-.91-1.34-1.39-2.887-1.39-4.475C1.86 6.54 6.643 1.758 12.039 1.758c2.613 0 5.074 1.018 6.924 2.873a9.92 9.92 0 0 1 2.871 6.917c0 5.396-4.782 10.176-10.8 9.483zm.006-18.175c-4.966 0-9.006 4.04-9.006 9.006 0 1.57.411 3.09 1.18 4.47l.104.184-1.424 5.253 5.39-1.408.204.108c1.32.744 2.85 1.14 4.45 1.14 4.967 0 9.008-4.04 9.008-9.008s-4.04-9.008-9.008-9.008zm5.275 11.758c-.287-.14-.766-.379-.884-.423-.117-.044-.251-.066-.354.066-.104.132-.401.523-.492.628-.09.103-.178.115-.333.044-.155-.066-.653-.243-1.243-.765-.46-.408-.767-.912-.857-1.066-.09-.155-.011-.237.067-.303.07-.065.155-.171.229-.256.074-.085.1-.155.156-.276.056-.122.028-.228-.009-.303-.037-.074-.354-.849-.485-1.159-.131-.31-.264-.265-.354-.265-.091 0-.196-.011-.3-.011s-.251.044-.384.198c-.134.155-.509.497-.509 1.209 0 .712.52 1.397.594 1.498.073.1.206.156.401.127.195-.03.54-.183.834-.401.294-.219.508-.437.663-.647.155-.21.285-.316.438-.383.153-.067.31-.011.458.077z"/>
                  </svg>
                  Order via WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-20 bg-white rounded-3xl shadow-2xl p-10 lg:p-16">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
            <div>
              <h2 className="text-4xl font-black text-gray-900 mb-2">Customer Reviews</h2>
              <div className="flex items-center gap-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-7 h-7 ${i < Math.round(avgRating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-2xl font-semibold text-gray-700">
                  {avgRating.toFixed(1)} out of 5
                </span>
                <span className="text-lg text-gray-500">• {reviews.length} reviews</span>
              </div>
            </div>

            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="btn btn-primary btn-lg px-10"
            >
              Write a Review
            </button>
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div className="bg-gradient-to-r from-emerald-50 to-orange-50 rounded-3xl p-8 mb-12 border border-primary/20">
              <h3 className="text-2xl font-bold mb-6">Share Your Experience</h3>
              <form onSubmit={handleSubmitReview} className="space-y-6">
                <div>
                  <label className="label">
                    <span className="label-text font-semibold text-lg">Your Rating</span>
                  </label>
                  <div className="flex gap-3">
                    {[1,2,3,4,5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="transition-transform hover:scale-110"
                      >
                        <Star 
                          className={`w-12 h-12 ${star <= newReview.rating 
                            ? 'fill-amber-400 text-amber-400' 
                            : 'text-gray-300'}`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-semibold text-lg">Your Review</span>
                  </label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    placeholder="Tell us what you loved about this product..."
                    className="textarea textarea-bordered w-full h-40 text-lg"
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <button 
                    type="submit" 
                    disabled={reviewLoading}
                    className="btn btn-primary btn-lg px-12"
                  >
                    {reviewLoading ? 'Submitting...' : 'Submit Review'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowReviewForm(false)}
                    className="btn btn-ghost btn-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <div className="text-center py-20">
              <Star className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <p className="text-2xl text-gray-600">No reviews yet</p>
              <p className="text-lg text-gray-500 mt-4">Be the first to share your experience!</p>
            </div>
          ) : (
            <div className="grid gap-8">
              {reviews.map((review) => (
                <div key={review.id} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-8 shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-orange-500 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-xl">
                        {review.user?.name?.[0]?.toUpperCase() || 'A'}
                      </div>
                      <div>
                        <p className="text-xl font-bold text-gray-900">{review.user?.name || 'Anonymous'}</p>
                        <p className="text-gray-600">
                          {new Date(review.createdAt).toLocaleDateString('en-KE', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-6 h-6 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-lg text-gray-800 leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}