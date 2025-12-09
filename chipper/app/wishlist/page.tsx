'use client';

import { Heart, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ProductCard from '../../components/ProductCard';
import { Product } from '../../lib/types';

export default function WishlistPage() {
  const [wishlistItems] = useState<Product[]>([
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 4999,
      imageUrl: '/products/headphones.jpg',
    },
    {
      id: 2,
      name: 'Smart Watch',
      price: 12999,
      imageUrl: '/products/watch.jpg',
    },
  ]);

  const removeFromWishlist = (productId: number) => {
    // Remove logic
    console.log(`Removed ${productId} from wishlist`);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center py-12">
        <div className="text-center max-w-md mx-auto p-8">
          <Heart className="w-24 h-24 text-base-content/40 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-base-content mb-4">Your Wishlist is Empty</h2>
          <p className="text-base-content/60 mb-8">Save items you love for later.</p>
          <a href="/products" className="btn btn-primary">
            Start Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Heart className="w-6 h-6 text-secondary" fill="currentColor" />
        <h1 className="text-2xl font-bold text-base-content">Wishlist ({wishlistItems.length})</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlistItems.map((product) => (
          <div key={product.id} className="relative group">
            <ProductCard product={product} />
            <button
              onClick={() => removeFromWishlist(product.id)}
              className="absolute top-2 right-2 btn btn-ghost btn-xs btn-circle opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}