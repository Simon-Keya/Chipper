'use client';

import { Product } from "@/lib/types";
import { ExternalLink, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const whatsappNumber = "254712345678";
  const whatsappMessage = encodeURIComponent(
    `Hello 👋! I'm interested in ordering *${product.name}* (Price: KSh ${product.price.toFixed(2)}). Could you please share more details?`
  );

  const handleWhatsAppOrder = useCallback(() => {
    console.log(`User initiated WhatsApp order for product: ${product.name}`);
    const url = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
    window.open(url, "_blank");
  }, [product.name, whatsappMessage]);

  const isInStock = product.stock > 0;

  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl border border-gray-100 hover:border-emerald-200 transition-all duration-500 overflow-hidden transform hover:-translate-y-2 flex flex-col h-full">
      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      {/* Product Image Section */}
      <Link href={`/products/${product.id}`} className="relative block">
        {/* HEIGHT REDUCTION: Changed aspect-square (1:1) to aspect-[5/4] (5:4) for a shorter image container. */}
        <div className="relative w-full aspect-[5/4] overflow-hidden bg-gray-100 rounded-t-2xl">
          {!imageError ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onError={() => setImageError(true)}
              priority={false}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="text-center">
                <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Image not available</p>
              </div>
            </div>
          )}

          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Stock Badge */}
          <div className="absolute top-3 right-3 z-10">
            {isInStock ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-sm animate-fade-in">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                In Stock
              </div>
            ) : (
              <div className="px-3 py-1.5 bg-gray-500 text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-sm">
                Sold Out
              </div>
            )}
          </div>

          {/* Quick View Badge */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 z-10">
            <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-xl flex items-center justify-center gap-2">
              <ExternalLink className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-gray-900">Quick View</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Product Info Section */}
      {/* SPACING REDUCTION: Reduced main padding from p-4/sm:p-5 to p-3/sm:p-4 */}
      <div className="flex flex-col flex-grow p-3 sm:p-4 relative z-10">
        <Link href={`/products/${product.id}`} className="flex-grow">
          {/* Category Badge */}
          {/* SPACING REDUCTION: Reduced margin bottom from mb-2 to mb-1.5 */}
          <div className="mb-1.5">
            <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
              {product.category?.name || "Product"}
            </span>
          </div>

          {/* Product Name */}
          {/* SPACING REDUCTION: Reduced margin bottom from mb-2 to mb-1. Also reduced min-height slightly */}
          <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-1 line-clamp-2 group-hover:text-emerald-700 transition-colors duration-300 min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Price Section */}
          {/* SPACING REDUCTION: Reduced margin and padding from mb-3 pb-3 to mb-2 pb-2 */}
          <div className="flex items-end justify-between mb-2 pb-2 border-b border-gray-100">
            <div>
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                Ksh {product.price.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            {isInStock && product.stock <= 10 && (
              <div className="flex items-center gap-1 text-xs text-orange-600 font-semibold bg-orange-50 px-2 py-1 rounded-full animate-pulse">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {product.stock} left
              </div>
            )}
          </div>
        </Link>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 mt-auto">
          {/* View Details Button */}
          <Link
            href={`/products/${product.id}`}
            className="group/btn w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden"
          >
            <span className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity"></span>
            <ExternalLink className="w-4 h-4 group-hover/btn:rotate-12 transition-transform relative z-10" />
            <span className="relative z-10">View Details</span>
          </Link>

          {/* WhatsApp Order Button */}
          <button
            onClick={handleWhatsAppOrder}
            disabled={!isInStock}
            className="group/whatsapp w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#25D366] hover:bg-[#22c35e] active:bg-[#1ea955] disabled:bg-gray-300 disabled:cursor-not-allowed rounded-xl shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden"
            aria-label={`Order ${product.name} via WhatsApp`}
          >
            <span className="absolute inset-0 bg-white opacity-0 group-hover/whatsapp:opacity-20 transition-opacity"></span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5 fill-white relative z-10 group-hover/whatsapp:scale-110 transition-transform"
              viewBox="0 0 24 24"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z" />
            </svg>
            <span className="relative z-10 hidden sm:inline">Order via WhatsApp</span>
            <span className="relative z-10 sm:hidden">Order Now</span>
          </button>
        </div>

        {/* Out of Stock Overlay */}
        {!isInStock && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-2xl z-20">
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="font-bold text-gray-900 mb-1">Out of Stock</p>
              <p className="text-sm text-gray-600">Check back soon</p>
            </div>
          </div>
        )}
      </div>

      {/* Decorative Corner Accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-emerald-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-tl-2xl"></div>
    </div>
  );
}