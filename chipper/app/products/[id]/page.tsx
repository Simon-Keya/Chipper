'use client';

import ReviewCard from '@/components/ReviewCard';
import ReviewForm from '@/components/ReviewForm';
import { fetchProduct, fetchReviews } from '@/lib/api';
import { Product, Review } from '@/lib/types';
import { AlertCircle, ShoppingCart, Star, Truck } from 'lucide-react';
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
  const [showReviewForm, setShowReviewForm] = useState(false);

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

  const handleWhatsappOrder = () => {
    if (!product) return;
    const message = encodeURIComponent(
      `Hello! I'd like to order:\n\n` +
      `Product: ${product.name}\n` +
      `Quantity: ${quantity}\n` +
      `Price: KSh ${(product.price || 0) * quantity}\n` +
      `Link: ${window.location.href}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  const handleReviewAdded = () => {
    fetchReviews(Number(id)).then(data => {
      setReviews(Array.isArray(data) ? data : []);
    });
    setShowReviewForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-blue-400"></span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center px-4">
        <div className="bg-slate-800 rounded-2xl shadow-2xl p-12 max-w-md text-center border border-slate-700">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Product Not Found</h2>
          <p className="text-slate-300">The product you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Product Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100 mb-12">
          {/* Image Section */}
          <div className="relative aspect-square lg:aspect-auto bg-slate-100 overflow-hidden group">
            <Image
              src={product.imageUrl || '/placeholder.jpg'}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              priority
            />
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                <div className="bg-red-500 px-8 py-4 rounded-xl">
                  <span className="text-white text-2xl font-bold">Out of Stock</span>
                </div>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="p-8 lg:p-12 flex flex-col justify-between space-y-8">
            {/* Header */}
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                {product.name}
              </h1>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-6 pb-6 border-b border-slate-200">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 transition-colors ${i < Math.round(avgRating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-slate-600">
                  <span className="text-slate-900">{avgRating.toFixed(1)}</span>
                  {' '}
                  <span className="text-slate-500">({reviews.length})</span>
                </span>
              </div>

              {/* Price & Delivery */}
              <div className="space-y-3">
                <p className="text-5xl font-bold text-slate-900">
                  KSh <span className="text-emerald-600">{product.price.toLocaleString()}</span>
                </p>
                <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                  <Truck className="w-4 h-4" />
                  <span>Free delivery nationwide</span>
                </div>
              </div>

              {/* Stock Status */}
              <div className={`inline-flex items-center gap-3 px-4 py-3 rounded-lg ${product.stock > 0 ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
                <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                <span className={`text-sm font-semibold ${product.stock > 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                  {product.stock > 0 ? `${product.stock} in stock — Ready to ship` : 'Currently unavailable'}
                </span>
              </div>

              {/* Description */}
              <p className="text-slate-600 leading-relaxed text-base pt-2">
                {product.description || 'Premium quality product with exceptional features and durability.'}
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-6 pt-6 border-t border-slate-200">
              {/* Quantity Selector */}
              {product.stock > 0 && (
                <div className="bg-slate-50 rounded-lg p-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">Quantity:</span>
                  <div className="flex items-center gap-3 bg-white rounded-lg p-1 border border-slate-200">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100 transition-colors text-slate-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={quantity <= 1}
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-semibold text-slate-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100 transition-colors text-slate-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleWhatsappOrder}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.039 21.031c-1.571 0-3.111-.476-4.437-1.353l-4.706 1.24a.657.657 0 0 1-.84-.817l1.244-4.665c-.91-1.34-1.39-2.887-1.39-4.475C1.86 6.54 6.643 1.758 12.039 1.758c2.613 0 5.074 1.018 6.924 2.873a9.92 9.92 0 0 1 2.871 6.917c0 5.396-4.782 10.176-10.8 9.483zm.006-18.175c-4.966 0-9.006 4.04-9.006 9.006 0 1.57.411 3.09 1.18 4.47l.104.184-1.424 5.253 5.39-1.408.204.108c1.32.744 2.85 1.14 4.45 1.14 4.967 0 9.008-4.04 9.008-9.008s-4.04-9.008-9.008-9.008zm5.275 11.758c-.287-.14-.766-.379-.884-.423-.117-.044-.251-.066-.354.066-.104.132-.401.523-.492.628-.09.103-.178.115-.333.044-.155-.066-.653-.243-1.243-.765-.46-.408-.767-.912-.857-1.066-.09-.155-.011-.237.067-.303.07-.065.155-.171.229-.256.074-.085.1-.155.156-.276.056-.122.028-.228-.009-.303-.037-.074-.354-.849-.485-1.159-.131-.31-.264-.265-.354-.265-.091 0-.196-.011-.3-.011s-.251.044-.384.198c-.134.155-.509.497-.509 1.209 0 .712.52 1.397.594 1.498.073.1.206.156.401.127.195-.03.54-.183.834-.401.294-.219.508-.437.663-.647.155-.21.285-.316.438-.383.153-.067.31-.011.458.077z"/>
                  </svg>
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          {/* Reviews Header */}
          <div className="border-b border-slate-200 p-8 lg:p-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
              <div className="space-y-4">
                <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">Customer Reviews</h2>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.round(avgRating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-slate-900">{avgRating.toFixed(1)} out of 5</span>
                  <span className="text-slate-500">• {reviews.length} reviews</span>
                </div>
              </div>

              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors whitespace-nowrap"
              >
                Write a Review
              </button>
            </div>
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div className="border-b border-slate-200 p-8 lg:p-12 bg-slate-50">
              <ReviewForm
                productId={Number(id)}
                onReviewAdded={handleReviewAdded}
              />
            </div>
          )}

          {/* Reviews List */}
          <div className="p-8 lg:p-12">
            {reviews.length === 0 ? (
              <div className="text-center py-16">
                <Star className="w-16 h-16 text-slate-300 mx-auto mb-6" />
                <p className="text-xl font-semibold text-slate-900 mb-2">No reviews yet</p>
                <p className="text-slate-500">Be the first to share your experience!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}