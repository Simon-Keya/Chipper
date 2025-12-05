'use client';

import CategoryFilter from '@/components/CategoryFilter';
import ProductCard from '@/components/ProductCard';
import { fetchCategories, fetchProducts } from '@/lib/api';
import { Category, Product } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [fetchedProducts, fetchedCategories] = await Promise.all([
          fetchProducts(selectedCategory?.toString()),
          fetchCategories(),
        ]);

        setProducts(fetchedProducts || []);
        setCategories(fetchedCategories || []);
      } catch (err) {
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedCategory]);

  const handleCategoryChange = (newCategoryId: number | null) => {
    setSelectedCategory(newCategoryId);
  };

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <p className="text-red-500">{error}</p>
        <button className="btn btn-primary" onClick={() => setSelectedCategory(null)}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 py-10 px-4">
      {/* ---------------- HERO / OFFER SECTION ---------------- */}
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-extrabold text-primary mb-4 animate-fadeIn">
          Discover the Best Deals
        </h1>
        <p className="text-lg text-neutral animate-fadeIn delay-150">
          Explore our curated selection of top-quality gadgets at unbeatable prices.
        </p>

        {/* OFFER CARD */}
        <div className="mt-8 p-6 bg-gradient-to-r from-primary/20 to-primary/5 rounded-2xl shadow-lg animate-fadeInUp">
          <h2 className="text-2xl font-bold text-primary">🔥 Weekly Special Offer</h2>
          <p className="text-neutral mt-2">
            Get amazing discounts on select accessories. Limited time only!
          </p>
        </div>
      </div>

      {/* ---------------- CATEGORY FILTER ---------------- */}
      <div className="flex justify-center mb-10 animate-fadeInUp delay-200">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onChange={handleCategoryChange}
        />
      </div>

      {/* ---------------- PRODUCTS GRID ---------------- */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <span className="loading loading-spinner text-primary"></span>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-neutral mb-4">No products found in this category.</p>
            <button
              className="btn btn-outline btn-primary"
              onClick={() => handleCategoryChange(null)}
            >
              Show All
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 animate-fadeInUp">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
