'use client';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
// Assuming fetchProductById is available in your lib/api.ts
import { ShoppingCart } from 'lucide-react'; // Using Lucide for a professional icon
import { fetchProduct } from '../../../lib/api';
import { Product } from '../../../lib/types';

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (id) {
      // Using fetchProduct based on the function name in the shared api.ts
      fetchProduct(id).then(setProduct).catch(console.error);
    }
  }, [id]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </div>
    );
  }

  // Helper to determine stock class
  const stockClass = product.stock > 10 
    ? 'text-success' 
    : product.stock > 0 
    ? 'text-warning' 
    : 'text-error';

  return (
    <div className="container mx-auto px-4 py-10 sm:py-16">
      {/* Main Product Layout: Two columns for desktop, stacked for mobile 
        Using bg-base-100 and shadow-2xl for a clean, elevated look 
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 bg-base-100 p-6 sm:p-10 rounded-xl shadow-2xl">
        
        {/* === Column 1: Product Image === */}
        <div className="w-full relative aspect-square md:aspect-auto md:h-[550px] overflow-hidden rounded-lg shadow-xl">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill // Fill the container, responsive sizing
            className="object-cover transition-transform duration-500 hover:scale-105"
            priority // Load the main image immediately
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        
        {/* === Column 2: Product Details and Actions === */}
        <div className="flex flex-col gap-6 lg:gap-8">
          
          {/* Header */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-content">
            {product.name}
          </h1>

          {/* Price & Category */}
          <div className="flex flex-col gap-3 border-b border-base-200 pb-6">
            <p className="text-4xl sm:text-5xl font-black text-primary">
              ${product.price.toFixed(2)}
            </p>
            <p className="text-sm font-medium text-neutral-content/70">
              Category: 
              <span className="font-semibold ml-2 badge badge-outline badge-warning text-warning">
                {product.category?.name || 'Uncategorized'}
              </span>
            </p>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-neutral-content border-l-4 border-primary pl-3">Description</h2>
            <p className="text-neutral-content/90 leading-relaxed text-sm">
              {product.description || 'No detailed product description is currently available.'}
            </p>
          </div>

          {/* Stock Status */}
          <div className="py-4 border-y border-base-200">
            <p className={`font-bold text-lg flex items-center gap-2 ${stockClass}`}>
              {product.stock > 0 ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {product.stock} In Stock
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Out of Stock
                </>
              )}
            </p>
          </div>

          {/* Purchase Button */}
          <div className="pt-4">
            <button
              className="btn btn-lg btn-warning w-full rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.01] disabled:opacity-40 font-bold"
              disabled={product.stock <= 0}
            >
              <ShoppingCart className="h-6 w-6" />
              {product.stock > 0 ? 'Add to Cart' : 'Notify Me When Available'}
            </button>
          </div>
          
        </div>
      </div>

      {/* --- SEO Structured Data --- */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            image: product.imageUrl, // Fixed image property
            description: product.description,
            offers: {
              '@type': 'Offer',
              priceCurrency: 'USD',
              price: product.price,
              availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', // Schema change
              url: `https://chipper-store.com/products/${product.id}`,
            },
          }),
        }}
      />
    </div>
  );
}
