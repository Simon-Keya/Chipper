'use client';
import { ChevronLeft, ChevronRight, Filter, Search, Star } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import CategoryFilter from '../../components/CategoryFilter';
import ProductCard from '../../components/ProductCard';
import { fetchCategories, fetchProducts } from '../../lib/api';
import { Category, Product } from '../../lib/types';

export default function ProductsPage() {
  
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating'>('name');
  const [searchQuery, setSearchQuery] = useState('');
  const productsPerPage = 12;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [prod, cats] = await Promise.all([
          fetchProducts(selectedCategory?.toString()),
          fetchCategories()
        ]);
        setProducts(prod || []);
        setCategories(cats || []);
      } catch (err) {
        console.error(err);
        setError('Unable to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [selectedCategory]);

  const handleCategory = (id: number | null) => {
    setSelectedCategory(id);
    setCurrentPage(1); // Reset pagination on category change
  };

  // Filter and sort products
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    return a.name.localeCompare(b.name);
  });

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // ERROR STATE FROM FIRST CODE
  if (error) {
    return (
      <div className="min-h-screen bg-base-100 flex justify-center items-center">
        <div className="text-center space-y-4 max-w-md mx-auto p-8">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-red-500 text-lg font-medium">{error}</p>
          <button 
            className="btn btn-primary" 
            onClick={() => setSelectedCategory(null)}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-700">Products</span>
          </div>
        </div>
      </nav>

      {/* Main Content: Filters and Products */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2 text-emerald-600" />
                Categories
              </h3>
              <CategoryFilter 
                categories={categories} 
                selectedCategory={selectedCategory} 
                onChange={handleCategory} 
              />
            </div>

            {/* Price Filter */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Price Range</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input type="radio" name="price" value="under-50" className="rounded" onChange={() => {}} />
                  <span className="text-sm text-gray-700">Under KSh 5,000</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="price" value="50-200" className="rounded" onChange={() => {}} />
                  <span className="text-sm text-gray-700">KSh 5,000 - 20,000</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="price" value="over-200" className="rounded" onChange={() => {}} />
                  <span className="text-sm text-gray-700">Over KSh 20,000</span>
                </label>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Customer Rating</h3>
              <div className="space-y-2">
                {[5, 4, 3].map((stars) => (
                  <label key={stars} className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" onChange={() => {}} />
                    <div className="flex items-center">
                      <div className="flex text-yellow-400">
                        {[...Array(stars)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                        <Star className="w-4 h-4 text-gray-300" />
                      </div>
                      <span className="text-sm text-gray-700 ml-1">& Up</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {/* Sorting and Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Showing {currentProducts.length} of {filteredProducts.length} results</span>
              </div>
              <div className="flex items-center space-x-4">
                <label className="text-sm text-gray-700">Sort by:</label>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'rating')}
                  className="border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="name">Name</option>
                  <option value="price">Price Low to High</option>
                  <option value="rating">Customer Rating</option>
                </select>
              </div>
            </div>

            {/* Products Loading */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
              </div>
            ) : currentProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Products Found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search or filters.</p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory(null);
                    setSortBy('name');
                  }} 
                  className="btn btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
                  {currentProducts.map((product, index) => (
                    <div key={product.id} className={`animate-fade-in-up`} style={{ animationDelay: `${index * 50}ms` }}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-12">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="btn btn-outline btn-sm disabled:opacity-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`btn btn-sm ${currentPage === page ? 'btn-primary' : 'btn-outline'}`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="btn btn-outline btn-sm disabled:opacity-50"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </section>

      {/* Upsell Section */}
      <section className="bg-gradient-to-r from-emerald-50 to-blue-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Shop?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">Join thousands of satisfied customers who trust Chipper for their online shopping needs.</p>
          <button className="btn btn-primary btn-lg shadow-lg hover:shadow-xl transition-all duration-300">
            Start Shopping Now
          </button>
        </div>
      </section>
    </div>
  );
}