"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CategoryFilter from "../../components/CategoryFilter";
import ProductCard from "../../components/ProductCard";
import { fetchCategories, fetchProducts } from "../../lib/api";
import { Category, Product } from "../../lib/types";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId")
    ? Number(searchParams.get("categoryId"))
    : null;

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [fetchedProducts, fetchedCategories] = await Promise.all([
          fetchProducts(categoryId?.toString()),
          fetchCategories(),
        ]);
        setProducts(fetchedProducts);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching data:", error);
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
    setProducts([]); // Clear while fetching
    fetchProducts(newCategoryId?.toString()).then(setProducts);
  };

  return (
    <div className="container mx-auto px-4 py-10 bg-base-100 min-h-screen">
      {/* Page Title */}
      <h1 className="text-4xl font-extrabold text-center mb-10 text-primary">
        Explore Our Products
      </h1>

      {/* Category Filter */}
      <div className="flex justify-center mb-8">
        <CategoryFilter
          categories={categories}
          selectedCategory={categoryId}
          onChange={handleCategoryChange}
        />
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner text-primary"></span>
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-neutral-content text-lg">
          No products found in this category.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: products.map((product, index) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "Product",
                name: product.name,
                url: `https://chipper-store.com/products/${product.id}`,
                image: product.imageUrl,
                description: product.description,
                offers: {
                  "@type": "Offer",
                  priceCurrency: "USD",
                  price: product.price,
                  availability: "https://schema.org/InStock",
                },
              },
            })),
          }),
        }}
      />
    </div>
  );
}
