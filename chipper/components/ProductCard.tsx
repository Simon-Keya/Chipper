// components/ProductCard.tsx

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
  const whatsappNumber = "254768378046";
  const whatsappMessage = encodeURIComponent(
    `Hello 👋! I'm interested in ordering *${product.name}* (Price: KSh ${product.price.toFixed(2)}). Could you please share more details?`
  );

  const handleWhatsAppOrder = useCallback(() => {
    const url = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
    window.open(url, "_blank");
  }, [product.name, whatsappMessage]);

  const isInStock = product.stock > 0;

  const handleAddToCart = () => {
    if (!isInStock) return;

    const existingCart = JSON.parse(localStorage.getItem('chipper_cart') || '[]') as {
      productId: number;
      quantity: number;
    }[];

    const existingIndex = existingCart.findIndex(item => item.productId === product.id);

    if (existingIndex >= 0) {
      existingCart[existingIndex].quantity += 1;
    } else {
      existingCart.push({
        productId: product.id,
        quantity: 1,
      });
    }

    localStorage.setItem('chipper_cart', JSON.stringify(existingCart));

    // Simple browser notification (no external deps)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Added to cart!', {
        body: product.name,
        icon: product.imageUrl || undefined,
      });
    }

    // Visual feedback
    const button = document.activeElement as HTMLButtonElement;
    button?.classList.add('scale-95');
    setTimeout(() => button?.classList.remove('scale-95'), 200);
  };

  return (
    <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-100 hover:border-orange-200 transition-all duration-300 overflow-hidden flex flex-col h-full">
      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg"></div>

      {/* Product Image */}
      <Link href={`/products/${product.id}`} className="relative block">
        <div className="relative w-full aspect-square overflow-hidden bg-gray-100 rounded-t-lg">
          {!imageError ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onError={() => setImageError(true)}
              priority={false}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
          )}

          {/* Stock Badge */}
          <div className="absolute top-3 right-3 z-10">
            {isInStock ? (
              <div className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-lg">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                In Stock
              </div>
            ) : (
              <div className="px-2.5 py-1.5 bg-gray-500 text-white text-xs font-bold rounded-full shadow-lg">
                Sold Out
              </div>
            )}
          </div>

          {/* Quick View Badge */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-10">
            <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-xl flex items-center justify-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-xs font-semibold text-gray-900">Quick View</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="flex flex-col flex-grow p-3 relative z-10">
        <Link href={`/products/${product.id}`} className="flex-grow">
          <div className="mb-2">
            <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
              {product.category?.name || "Product"}
            </span>
          </div>

          <h3 className="font-bold text-base text-gray-900 mb-1.5 line-clamp-2 group-hover:text-orange-400 transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center justify-between mb-3">
            <div className="text-xl font-bold text-gray-900">
              Ksh {product.price.toLocaleString()}
            </div>
            {isInStock && product.stock <= 10 && (
              <div className="text-xs text-orange-400 font-semibold bg-orange-50 px-2 py-1 rounded-full">
                Only {product.stock} left
              </div>
            )}
          </div>
        </Link>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 mt-auto">
          {/* Add to Cart - Orange */}
          <button
            onClick={handleAddToCart}
            disabled={!isInStock}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:bg-gray-300 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            <ShoppingCart className="w-4 h-4" />
            {isInStock ? 'Add to Cart' : 'Out of Stock'}
          </button>

          {/* WhatsApp */}
          <button
            onClick={handleWhatsAppOrder}
            disabled={!isInStock}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#25D366] hover:bg-[#22c35e] disabled:bg-gray-300 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z" />
            </svg>
            Order via WhatsApp
          </button>
        </div>
      </div>

      {/* Out of Stock Overlay */}
      {!isInStock && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-lg z-20">
          <div className="text-center p-4">
            <p className="font-bold text-gray-900 text-lg">Out of Stock</p>
            <p className="text-sm text-gray-600">Check back soon</p>
          </div>
        </div>
      )}
    </div>
  );
}