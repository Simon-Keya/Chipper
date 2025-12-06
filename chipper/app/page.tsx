'use client';

import { useEffect, useState } from 'react';
import CategoryFilter from '../components/CategoryFilter';
import ProductCard from '../components/ProductCard';
import { fetchCategories, fetchProducts } from '../lib/api';
import { Category, Product } from '../lib/types';

export default function ProductsPage() {
  // ORIGINAL FETCHING LOGIC FROM FIRST CODE
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  };

  // ERROR STATE FROM FIRST CODE
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center space-y-4">
          <p className="text-red-500 text-lg">{error}</p>
          <button className="btn btn-primary" onClick={() => setSelectedCategory(null)}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  // STRUCTURE AND STYLING FROM SECOND CODE (HOMEPAGE)
  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      {/* Floating Background Elements - FROM HOMEPAGE */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section - FROM HOMEPAGE */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-blue-50">
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/patterns/dots.svg')] opacity-5 animate-pulse-slow"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent animate-shimmer"></div>
        </div>
        
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge with glow effect */}
            <div className="inline-flex items-center gap-2 mb-6 px-5 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold shadow-sm hover:shadow-glow transition-all duration-300 animate-fade-in cursor-default group">
              <svg className="w-4 h-4 animate-spin-slow" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="group-hover:scale-105 transition-transform inline-block">Explore Our Products</span>
            </div>
            
            {/* Animated Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in animation-delay-200">
              <span className="inline-block bg-gradient-to-r from-gray-900 via-emerald-700 to-blue-900 bg-clip-text text-transparent animate-gradient-x">
                Discover Amazing Products
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up animation-delay-400">
              Discover amazing offers, top gadgets, and exciting deals tailored just for you!
            </p>
          </div>
        </div>

        {/* Wavy Bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" className="w-full h-auto fill-white">
            <path d="M0,50 C360,90 720,10 1440,50 L1440,100 L0,100 Z"></path>
          </svg>
        </div>
      </section>

      {/* CATEGORY FILTER - POSITIONED LIKE HOMEPAGE */}
      <section className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="max-w-3xl mx-auto">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onChange={handleCategory}
          />
        </div>
      </section>

      {/* FEATURED OFFER CARDS - FROM HOMEPAGE STRUCTURE */}
      <div className="container mx-auto px-4 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group text-center p-6 rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 cursor-default relative overflow-hidden">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
            <div className="relative w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg">
              <span className="text-3xl">🔥</span>
            </div>
            <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors duration-300">Hot Deals</h3>
            <p className="text-gray-600 relative z-10">Exclusive discounts on top products. Don&apos;t miss out!</p>
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>

          <div className="group text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 cursor-default relative overflow-hidden">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
            <div className="relative w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg">
              <span className="text-3xl">🚚</span>
            </div>
            <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors duration-300">Free Delivery</h3>
            <p className="text-gray-600 relative z-10">Enjoy fast & free delivery on select items.</p>
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>

          <div className="group text-center p-6 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 cursor-default relative overflow-hidden">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
            <div className="relative w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg">
              <span className="text-3xl">⭐</span>
            </div>
            <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors duration-300">Top Rated</h3>
            <p className="text-gray-600 relative z-10">Browse our bestselling and top-reviewed items.</p>
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        </div>
      </div>

      {/* PRODUCTS SECTION - HOMEPAGE STYLING WITH FIRST CODE LOGIC */}
      <section className="container mx-auto px-4 py-16 bg-gradient-to-b from-white to-gray-50 relative">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg text-emerald-600"></span>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-neutral-content text-lg mb-4">
              No products found in this category.
            </p>
            <button
              onClick={() => handleCategory(null)}
              className="btn btn-lg bg-emerald-600 hover:bg-emerald-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Show All Products
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <div className="inline-block mb-4 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold animate-bounce-in">
                ⭐ {products.length} Products Available
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 hover:scale-105 transition-transform duration-300 inline-block">
                {selectedCategory
                  ? `${categories.find(c => c.id === selectedCategory)?.name ?? 'Products'}`
                  : 'All Products'}
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Check out our collection of quality products
              </p>
            </div>

            {/* PRODUCTS GRID - HOMEPAGE CARD STYLE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  style={{ animationDelay: `${index * 75}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* WHY CHOOSE US SECTION - FROM HOMEPAGE */}
      <section className="container mx-auto px-4 py-16 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="text-center mb-12 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 hover:scale-105 transition-transform duration-300 inline-block">
            Why Choose Chipper?
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            We&apos;re committed to providing the best shopping experience in Kenya
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {[
            { icon: 'check', title: 'Quality Products', desc: '100% authentic products from trusted suppliers', color: 'emerald', gradient: 'from-emerald-50 to-green-50' },
            { icon: 'clock', title: 'Fast Delivery', desc: 'Quick delivery to your doorstep within 24-48 hours', color: 'blue', gradient: 'from-blue-50 to-indigo-50' },
            { icon: 'whatsapp', title: 'WhatsApp Orders', desc: 'Easy ordering through WhatsApp for your convenience', color: 'purple', gradient: 'from-purple-50 to-pink-50' },
            { icon: 'support', title: '24/7 Support', desc: 'Always here to help with your queries and concerns', color: 'amber', gradient: 'from-amber-50 to-orange-50' }
          ].map((item, idx) => (
            <div key={idx} className={`group text-center p-6 rounded-xl bg-gradient-to-br ${item.gradient} hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 cursor-default relative overflow-hidden`}>
              {/* Animated border */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              
              <div className={`relative w-16 h-16 bg-${item.color}-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg`}>
                <svg className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {item.icon === 'check' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />}
                  {item.icon === 'clock' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
                  {item.icon === 'support' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />}
                </svg>
                {item.icon === 'whatsapp' && (
                  <svg className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z"/>
                  </svg>
                )}
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors duration-300">{item.title}</h3>
              <p className="text-gray-600 relative z-10">{item.desc}</p>
              
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}