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
          const [prodData, reviewData] = await Promise.all([
            fetchProduct(id),
            fetchReviews(Number(id)),
          ]);
          setProduct(prodData);
          setReviews(reviewData || []);
        } catch (error) {
          console.error('Failed to load product data:', error);
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product || product.stock < quantity) return;

    const cart = JSON.parse(localStorage.getItem('chipper_cart') || '[]');
    const existing = cart.find((item: { productId: number }) => item.productId === product.id);

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

      setReviews([savedReview, ...reviews]);
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

  if (loading || !product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="min-h-screen bg-base-200 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-base-100 rounded-3xl shadow-2xl overflow-hidden">
          {/* Image */}
          <div className="relative aspect-square lg:aspect-auto lg:h-full">
            <Image
              src={product.imageUrl || '/placeholder.jpg'}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Details */}
          <div className="p-8 lg:p-12 flex flex-col justify-between">
            <div>
              <h1 className="text-4xl lg:text-5xl font-black text-base-content mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${i < Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-base-300'}`}
                    />
                  ))}
                  <span className="text-lg font-medium">
                    {avgRating.toFixed(1)} ({reviews.length} reviews)
                  </span>
                </div>
              </div>

              <p className="text-5xl font-black text-primary mb-8">
                KSh {product.price.toLocaleString()}
              </p>

              <div className="space-y-6 mb-10">
                <p className="text-base-content/80 leading-relaxed">
                  {product.description || 'High-quality product with excellent features.'}
                </p>

                <div className="flex items-center gap-3">
                  <Truck className="w-6 h-6 text-success" />
                  <span className="font-medium text-success">
                    {product.stock > 0 ? `${product.stock} in stock • Free delivery` : 'Out of stock'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              {product.stock > 0 && (
                <div className="flex items-center gap-4 mb-6">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="btn btn-circle btn-outline"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold w-16 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="btn btn-circle btn-outline"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="btn btn-primary btn-lg"
                >
                  <ShoppingCart className="w-6 h-6" />
                  Add to Cart
                </button>

                <button
                  onClick={handleWhatsappOrder}
                  className="btn btn-success btn-lg"
                  style={{ backgroundColor: '#25D366' }}
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.039 21.031c-1.571 0-3.111-.476-4.437-1.353l-4.706 1.24a.657.657 0 0 1-.84-.817l1.244-4.665c-.91-1.34-1.39-2.887-1.39-4.475C1.86 6.54 6.643 1.758 12.039 1.758c2.613 0 5.074 1.018 6.924 2.873a9.92 9.92 0 0 1 2.871 6.917c0 5.396-4.782 10.176-10.8 9.483zm.006-18.175c-4.966 0-9.006 4.04-9.006 9.006 0 1.57.411 3.09 1.18 4.47l.104.184-1.424 5.253 5.39-1.408.204.108c1.32.744 2.85 1.14 4.45 1.14 4.967 0 9.008-4.04 9.008-9.008s-4.04-9.008-9.008-9.008zm5.275 11.758c-.287-.14-.766-.379-.884-.423-.117-.044-.251-.066-.354.066-.104.132-.401.523-.492.628-.09.103-.178.115-.333.044-.155-.066-.653-.243-1.243-.765-.46-.408-.767-.912-.857-1.066-.09-.155-.011-.237.067-.303.07-.065.155-.171.229-.256.074-.085.1-.155.156-.276.056-.122.028-.228-.009-.303-.037-.074-.354-.849-.485-1.159-.131-.31-.264-.265-.354-.265-.091 0-.196-.011-.3-.011s-.251.044-.384.198c-.134.155-.509.497-.509 1.209 0 .712.52 1.397.594 1.498.073.1.206.156.401.127.195-.03.54-.183.834-.401.294-.219.508-.437.663-.647.155-.21.285-.316.438-.383.153-.067.31-.011.458.077z"/>
                  </svg>
                  Order via WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 bg-base-100 rounded-3xl shadow-xl p-8 md:p-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Customer Reviews</h2>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="btn btn-outline btn-primary"
            >
              Write a Review
            </button>
          </div>

          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="bg-base-200 rounded-2xl p-6 mb-10">
              <div className="flex items-center gap-2 mb-4">
                {[1,2,3,4,5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className="text-3xl"
                  >
                    <Star className={star <= newReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-base-300'} />
                  </button>
                ))}
              </div>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                placeholder="Share your experience with this product..."
                className="textarea textarea-bordered w-full h-32 mb-4"
                required
              />
              <div className="flex gap-3">
                <button type="submit" disabled={reviewLoading} className="btn btn-primary">
                  {reviewLoading ? 'Submitting...' : 'Submit Review'}
                </button>
                <button type="button" onClick={() => setShowReviewForm(false)} className="btn btn-ghost">
                  Cancel
                </button>
              </div>
            </form>
          )}

          {reviews.length === 0 ? (
            <p className="text-center text-base-content/60 py-12">No reviews yet — be the first to review!</p>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-base-200 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-xl font-bold text-primary">
                        {review.user?.name?.[0]?.toUpperCase() || 'A'}
                      </div>
                      <div>
                        <p className="font-semibold">{review.user?.name || 'Anonymous'}</p>
                        <p className="text-sm text-base-content/60">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-base-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-base-content/80">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}