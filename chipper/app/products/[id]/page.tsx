'use client';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchProductById } from '../../../lib/api';
import { Product } from '../../../lib/types';

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (id) {
      fetchProductById(id).then(setProduct);
    }
  }, [id]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-lg text-neutral-content">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-base-100">
      <div className="card bg-neutral shadow-xl">
        <figure>
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={600}
            height={400}
            className="object-cover w-full h-96"
          />
        </figure>
        <div className="card-body">
          <h1 className="card-title text-3xl text-neutral-content">{product.name}</h1>
          <p className="text-neutral-content">${product.price.toFixed(2)}</p>
          <p className="text-sm text-neutral-content/80">
            Category: {product.category.name}
          </p>
          {product.description && (
            <p className="mt-4 text-neutral-content">{product.description}</p>
          )}
          <p className="mt-2 text-neutral-content">
            <strong>Stock:</strong> {product.stock}
          </p>
        </div>
      </div>

      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            image: product.image,
            description: product.description,
            offers: {
              '@type': 'Offer',
              priceCurrency: 'USD',
              price: product.price,
              availability: product.stock > 0 ? 'InStock' : 'OutOfStock',
              url: `https://chipper-store.com/products/${product.id}`,
            },
          }),
        }}
      />
    </div>
  );
}
