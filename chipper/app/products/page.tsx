'use client';
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CategoryFilter from "../../components/CategoryFilter";
import ProductCard from "../../components/ProductCard";
import { fetchCategories, fetchProducts } from "../../lib/api";
import { Category, Product } from "../../lib/types";

// Force dynamic rendering to avoid prerendering errors on Vercel
export const dynamic = 'force-dynamic';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId")
    ? Number(searchParams.get("categoryId"))
    : null;
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on the client only
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use environment variable for API base URL to avoid build-time issues
        const apiBase = process.env.NEXT_PUBLIC_API_URL;
        const [fetchedProducts, fetchedCategories] = await Promise.all([
          fetchProducts(categoryId?.toString()),
          fetchCategories(),
        ]);
        setProducts(fetchedProducts || []);
        setCategories(fetchedCategories || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load products. Please check your connection and try again.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [categoryId]);

  const handleCategoryChange = (newCategoryId: number | null) => {
    const url = newCategoryId
      ? `/products?categoryId=${newCategoryId}`
      : "/products";
    window.history.pushState({}, "", url);
    setProducts([]);
    fetchProducts(newCategoryId?.toString())
      .then(setProducts)
      .catch(() => setError("Failed to load products for this category."));
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 bg-base-100 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-primary">
        Explore Our Products
      </h1>
      <div className="flex justify-center mb-8">
        <CategoryFilter
          categories={categories}
          selectedCategory={categoryId}
          onChange={handleCategoryChange}
        />
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-neutral-content text-lg mb-4">
            No products found in this category.
          </p>
          <button onClick={() => handleCategoryChange(null)} className="btn btn-outline btn-primary">
            Show All Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}