'use client';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
// Assuming fetchProductById is available in your lib/api.ts
import { fetchProduct } from '../../../lib/api';
import { Product } from '../../../lib/types';

// The WhatsApp phone number (replace with your actual number)
const WHATSAPP_NUMBER = '+254768378046'; 

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

  // Function to handle the WhatsApp order link
  const handleWhatsappOrder = () => {
    // Generate the pre-filled message
    const message = encodeURIComponent(
      `Hello, I would like to order this product: \n\n` +
      `Product: ${product.name} (ID: ${product.id})\n` +
      `Price: $${product.price.toFixed(2)}\n` +
      `URL: ${window.location.href}`
    );
    
    // Construct the WhatsApp URL
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    
    // Open the link in a new tab
    window.open(whatsappUrl, '_blank');
  };

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
              Ksh.{product.price.toFixed(2)}
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

          {/* Purchase Button - Changed to WhatsApp Order */}
          <div className="pt-4">
            <button
              className="btn btn-lg w-full rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.01] disabled:opacity-40 font-bold"
              // Custom WhatsApp green color: bg-[#25D366] hover:bg-[#1DA851] text-white
              style={{ backgroundColor: '#25D366', color: 'white' }}
              onClick={handleWhatsappOrder}
              disabled={product.stock <= 0}
            >
              {/* WhatsApp Icon SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.039 21.031c-1.571 0-3.111-.476-4.437-1.353l-4.706 1.24a.657.657 0 0 1-.84-.817l1.244-4.665c-.91-1.34-1.39-2.887-1.39-4.475C1.86 6.54 6.643 1.758 12.039 1.758c2.613 0 5.074 1.018 6.924 2.873a9.92 9.92 0 0 1 2.871 6.917c0 5.396-4.782 10.176-10.8 9.483zm.006-18.175c-4.966 0-9.006 4.04-9.006 9.006 0 1.57.411 3.09 1.18 4.47l.104.184-1.424 5.253 5.39-1.408.204.108c1.32.744 2.85 1.14 4.45 1.14 4.967 0 9.008-4.04 9.008-9.008s-4.04-9.008-9.008-9.008zm5.275 11.758c-.287-.14-.766-.379-.884-.423-.117-.044-.251-.066-.354.066-.104.132-.401.523-.492.628-.09.103-.178.115-.333.044-.155-.066-.653-.243-1.243-.765-.46-.408-.767-.912-.857-1.066-.09-.155-.011-.237.067-.303.07-.065.155-.171.229-.256.074-.085.1-.155.156-.276.056-.122.028-.228-.009-.303-.037-.074-.354-.849-.485-1.159-.131-.31-.264-.265-.354-.265-.091 0-.196-.011-.3-.011s-.251.044-.384.198c-.134.155-.509.497-.509 1.209 0 .712.52 1.397.594 1.498.073.1.206.156.401.127.195-.03.54-.183.834-.401.294-.219.508-.437.663-.647.155-.21.285-.316.438-.383.153-.067.31-.011.458.077z"/>
              </svg>
              {product.stock > 0 ? 'Order via WhatsApp' : 'Notify Me When Available'}
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
