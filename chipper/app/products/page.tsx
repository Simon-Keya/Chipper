'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import CategoryFilter from '../../components/CategoryFilter';
import { fetchCategories, fetchProducts } from '../../lib/api';
import { Category, Product } from '../../lib/types';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('categoryId')
    ? Number(searchParams.get('categoryId'))
    : null;

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [fetchedProducts, fetchedCategories] = await Promise.all([
        fetchProducts(categoryId?.toString()),
        fetchCategories(),
      ]);
      setProducts(fetchedProducts);
      setCategories(fetchedCategories);
    };
    loadData();
  }, [categoryId]);

  const handleCategoryChange = (newCategoryId: number | null) => {
    const url = newCategoryId ? `/products?categoryId=${newCategoryId}` : '/products';
    window.history.pushState({}, '', url);
    setProducts([]); // Clear while fetching
    fetchProducts(newCategoryId?.toString()).then(setProducts);
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-base-100">
      <h1 className="text-4xl font-bold text-center mb-8 text-neutral-content">
        Our Products
      </h1>

      <CategoryFilter
        categories={categories}
        selectedCategory={categoryId}
        onChange={handleCategoryChange}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="card bg-neutral shadow-xl hover:shadow-2xl transition-shadow duration-300"
          >
            <figure>
              <Image
                src={product.imageurl}
                alt={product.name}
                width={300}
                height={200}
                className="object-cover w-full h-48"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title text-lg text-neutral-content">
                {product.name}
              </h2>
              <p className="text-neutral-content">${product.price.toFixed(2)}</p>
              <p className="text-sm text-neutral-content/80">
                {product.category.name}
              </p>
              <div className="card-actions justify-end">
                <Link href={`/products/${product.id}`} className="btn btn-primary btn-sm">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SEO Structured Data */}
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
                image: product.imageurl,
                description: product.description,
              },
            })),
          }),
        }}
      />
    </div>
  );
}
