'use client';

import { Search as SearchIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProductCard from '../../components/ProductCard';
import { Product } from '../../lib/types';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setLoading(false);
      return;
    }

    const searchProducts = async () => {
      setLoading(true);
      try {
        // Fetch search results from API
        const response = await fetch(`/api/products?search=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Search failed');
        const data = await response.json();
        setResults(data);
        setNoResults(data.length === 0);
      } catch (err) {
        console.error('Search error:', err);
        setNoResults(true);
      } finally {
        setLoading(false);
      }
    };

    searchProducts();
  }, [query]);

  if (!query) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <SearchIcon className="w-16 h-16 text-base-content/40 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-base-content mb-2">Search Products</h2>
          <p className="text-base-content/60">Enter a keyword to start searching</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-base-content mb-2">Search Results for "{query}"</h1>
        <p className="text-base-content/60">{results.length} results found</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      ) : noResults ? (
        <div className="text-center py-16">
          <SearchIcon className="w-16 h-16 text-base-content/40 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-base-content mb-2">No Products Found</h3>
          <p className="text-base-content/60 mb-6">Try searching with different keywords.</p>
          <Link href="/products">
            <button className="btn btn-primary">Browse All Products</button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}