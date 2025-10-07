"use client";

import { Product } from "@/lib/types";
import { MessageCircle, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const whatsappNumber = "254712345678";

  const whatsappMessage = encodeURIComponent(
    `Hello 👋! I'm interested in ordering *${product.name}* (Price: KSh ${product.price.toFixed(
      2
    )}). Could you please share more details?`
  );

  const handleWhatsAppOrder = useCallback(() => {
    console.log(`User initiated WhatsApp order for product: ${product.name}`);
    const url = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
    window.open(url, "_blank");
  }, [product.name, whatsappMessage]);

  return (
    <div className="group relative bg-base-100 border border-base-300 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* Product Image */}
      <figure className="relative w-full h-56 overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          priority
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 300px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-base-200/80 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
      </figure>

      {/* Product Info */}
      <div className="p-5 flex flex-col justify-between space-y-2">
        <h2 className="font-semibold text-lg text-base-content truncate text-center">
          {product.name}
        </h2>

        <span className="text-primary font-bold text-lg text-center">
          KSh {product.price.toFixed(2)}
        </span>

        <div className="flex flex-col gap-2 mt-2">
          {/* View Details Button (Amber color, square edges) */}
          <Link
            href={`/products/${product.id}`}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 font-medium text-white bg-amber-500 hover:bg-amber-600 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-transform hover:scale-[1.02] shadow-md"
          >
            <ShoppingBag size={16} />
            View Details
          </Link>

          {/* WhatsApp Button (Square edges) */}
          <button
            onClick={handleWhatsAppOrder}
            className="btn btn-success w-full flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform focus:ring-2 focus:ring-success/50 rounded-none"
          >
            <MessageCircle size={16} />
            Order via WhatsApp
          </button>
        </div>
      </div>

      {/* Hover Tag (Stock Info) */}
      <div className="absolute top-3 left-3 bg-primary text-primary-content px-3 py-1 text-xs rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {product.stock > 0 ? `In Stock: ${product.stock}` : "Out of Stock"}
      </div>
    </div>
  );
}
