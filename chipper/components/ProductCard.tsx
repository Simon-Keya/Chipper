'use client';

import { Product } from "@/lib/types";
import { ExternalLink } from "lucide-react";
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

  // Determine stock badge color
  const stockBadgeClass = product.stock > 0 
    ? 'bg-success text-success-content' 
    : 'bg-error text-error-content';

  return (
    <div className="group relative bg-base-100 border border-base-200 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden cursor-pointer">
      
      {/* Link wrapper for the main card area (Image and Info) */}
      <Link href={`/products/${product.id}`} className="block">
        
        {/* Product Image Area */}
        <figure className="relative w-full h-56 overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            priority
            className="object-cover transition-transform duration-500 group-hover:scale-105" // Subtle zoom on hover
            sizes="(max-width: 768px) 100vw, 300px"
          />
          {/* Stock Badge - moved to top right, always visible */}
          <div className={`absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full shadow-md z-10 ${stockBadgeClass}`}>
            {product.stock > 0 ? 'In Stock' : 'Sold Out'}
          </div>
        </figure>

        {/* Product Info Section */}
        <div className="p-4 flex flex-col justify-between space-y-3">
          
          {/* Title and Category */}
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium text-base-content/60 uppercase tracking-wider">
              {product.category?.name || 'Item'}
            </p>
            <h2 className="font-extrabold text-xl text-neutral-content truncate hover:text-primary transition-colors">
              {product.name}
            </h2>
          </div>

          {/* Price Tag & Stock Status */}
          <div className="flex justify-between items-center pt-2 border-t border-base-200">
             <span className="text-2xl font-black text-primary">
              KSh {product.price.toFixed(2)}
            </span>
             {product.stock > 0 && (
                <span className="text-xs font-semibold text-success bg-success/10 px-2 py-0.5 rounded-full">
                    Ready to Ship
                </span>
             )}
          </div>
          
        </div>
      </Link>
      
      {/* Action Buttons - Separated from the main link area */}
      <div className="p-4 pt-0 flex flex-col gap-3">
        {/* View Details Button (Amber) */}
        <Link
          href={`/products/${product.id}`}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-lg font-bold text-white bg-amber-500 hover:bg-amber-600 active:bg-amber-700 transition duration-200 shadow-lg rounded-lg"
        >
          <ExternalLink size={20} />
          View Details
        </Link>

        {/* WhatsApp Button (Green) */}
        <button
          onClick={handleWhatsAppOrder}
          disabled={product.stock <= 0}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-lg font-bold text-white bg-green-600 hover:bg-green-700 active:bg-green-800 transition duration-200 shadow-lg rounded-lg disabled:bg-gray-400 disabled:shadow-none"
        >
          {/* WhatsApp Icon SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 fill-white" viewBox="0 0 24 24">
            <path d="M12.039 21.031c-1.571 0-3.111-.476-4.437-1.353l-4.706 1.24a.657.657 0 0 1-.84-.817l1.244-4.665c-.91-1.34-1.39-2.887-1.39-4.475C1.86 6.54 6.643 1.758 12.039 1.758c2.613 0 5.074 1.018 6.924 2.873a9.92 9.92 0 0 1 2.871 6.917c0 5.396-4.782 10.176-10.8 9.483zm.006-18.175c-4.966 0-9.006 4.04-9.006 9.006 0 1.57.411 3.09 1.18 4.47l.104.184-1.424 5.253 5.39-1.408.204.108c1.32.744 2.85 1.14 4.45 1.14 4.967 0 9.008-4.04 9.008-9.008s-4.04-9.008-9.008-9.008zm5.275 11.758c-.287-.14-.766-.379-.884-.423-.117-.044-.251-.066-.354.066-.104.132-.401.523-.492.628-.09.103-.178.115-.333.044-.155-.066-.653-.243-1.243-.765-.46-.408-.767-.912-.857-1.066-.09-.155-.011-.237.067-.303.07-.065.155-.171.229-.256.074-.085.1-.155.156-.276.056-.122.028-.228-.009-.303-.037-.074-.354-.849-.485-1.159-.131-.31-.264-.265-.354-.265-.091 0-.196-.011-.3-.011s-.251.044-.384.198c-.134.155-.509.497-.509 1.209 0 .712.52 1.397.594 1.498.073.1.206.156.401.127.195-.03.54-.183.834-.401.294-.219.508-.437.663-.647.155-.21.285-.316.438-.383.153-.067.31-.011.458.077z"/>
          </svg>
          Order via WhatsApp
        </button>
      </div>

    </div>
  );
}
