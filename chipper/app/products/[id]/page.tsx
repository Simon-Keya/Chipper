'use client';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchCategories, fetchProducts } from '../lib/api';
import { Category, Product } from '../lib/types';

export const metadata: Metadata = {
  title: 'Products - Chipper',
  description: 'Browse our full range of products at Chipper.',
  keywords: 'products, Chipper, ecommerce, shopping',
  openGraph: {
    title: 'Products - Chipper',
    description: 'Browse our full range of products at Chipper.',
    url: 'https://chipper-store.com/products',
    images: [`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1234567890/chipper/og-image.jpg`],
  },
};

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('categoryId');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [fetchedProducts, fetchedCategories] = await Promise.all([
        fetchProducts(categoryId || undefined),
        fetchCategories(),
      ]);
      setProducts(fetchedProducts);
      setCategories(fetchedCategories);
    };
    loadData();
  }, [categoryId]);

  return (
    <div className="container mx-auto px-4 py-8 bg-base-100">
      <h1 className="text-4xl font-bold text-center mb-8 text-neutral-content">Our Products</h1>
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <Link
          href="/products"
          className={`btn btn-outline btn-primary hover:bg-primary hover:text-base-100 transition-colors duration-300 ${
            !categoryId ? 'btn-active' : ''
          }`}
          aria-label="Show all products"
        >
          All Products
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/products?categoryId=${category.id}`}
            className={`btn btn-outline btn-primary hover:bg-primary hover:text-base-100 transition-colors duration-300 ${
              categoryId === String(category.id) ? 'btn-active' : ''
            }`}
            aria-label={`Filter by ${category.name}`}
          >
            {category.name}
          </Link>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="card bg-neutral shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <figure>
              <Image
                src={`${product.imageUrl}?w=300&h=200&c=fill&q=80`}
                alt={product.name}
                width={300}
                height={200}
                className="object-cover w-full h-48"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title text-lg text-neutral-content">{product.name}</h2>
              <p className="text-neutral-content">${product.price.toFixed(2)}</p>
              <p className="text-sm text-neutral-content/80">{product.category.name}</p>
              <div className="card-actions justify-end">
                <Link href={`/products/${product.id}`} className="btn btn-primary btn-sm">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            itemListElement: products.map((product, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              item: {
                '@type': 'Product',
                name: product.name,
                url: `https://chipper-store.com/products/${product.id}`,
                image: `${product.imageUrl}?w=300&h=200&c=fill&q=80`,
                description: product.description,
              },
            })),
          }),
        }}
      />
    </div>
  );
}