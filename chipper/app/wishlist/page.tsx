'use client';

import { Heart } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  // Empty wishlist — no dummy products
  const wishlistItems = [];

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center py-12">
        <div className="text-center max-w-md mx-auto p-8">
          <Heart className="w-24 h-24 text-base-content/40 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-base-content mb-4">Your Wishlist is Empty</h2>
          <p className="text-base-content/60 mb-8">Save items you love for later.</p>
          <Link href="/products" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  // This part will only show when real items are added later
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Heart className="w-6 h-6 text-secondary" fill="currentColor" />
        <h1 className="text-2xl font-bold text-base-content">Wishlist ({wishlistItems.length})</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Real wishlist items will go here when implemented */}
      </div>
    </div>
  );
}