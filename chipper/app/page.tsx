'use client';

import { Clock, Leaf, Search, Shield, Star, Truck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { fetchCategories, fetchProducts } from '../lib/api';
import { Category, Product } from '../lib/types';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [prod, cats] = await Promise.all([
          fetchProducts(),
          fetchCategories()
        ]);
        setProducts(prod || []);
        setCategories(cats || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Unable to load homepage content. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-base-100 flex justify-center items-center">
        <div className="text-center space-y-4 max-w-md mx-auto p-8">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-red-500 text-lg font-medium">{error}</p>
          <button 
            className="btn btn-primary" 
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-16 md:py-20 overflow-hidden">
        {/* Reduced padding on mobile */}
        <div className="absolute inset-0 bg-[url('/patterns/dots.svg')] opacity-5"></div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-blue-400 animate-pulse"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-emerald-200 text-emerald-700 font-semibold animate-pulse-slow">
              <Star className="w-4 h-4 animate-spin-slow" />
              <span>Our Collection</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-gray-900 via-emerald-700 to-blue-900 bg-clip-text text-transparent animate-fade-in-up">
              Welcome to Chipper
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-lg mx-auto leading-relaxed animate-slide-up">
              Discover premium products curated just for you. Fast delivery, secure payments, and exceptional service across Kenya.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-200">
              <Link href="/products">
                <button className="btn btn-primary btn-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Shop Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category Showcase - Reduced top padding */}
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8 md:mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">Shop by Category</h2>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto animate-fade-in-up animation-delay-200">Explore our diverse range of categories tailored to your needs</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.slice(0, 8).map((category, index) => (
            <Link 
              key={category.id} 
              href={`/products?categoryId=${category.id}`}
              className="group relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="aspect-square relative">
                <Image
                  src={category.imageUrl || '/placeholder.jpg'}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 25vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold text-base md:text-lg drop-shadow-lg group-hover:scale-105 transition-transform duration-300">
                    {category.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
          {categories.length > 8 && (
            <Link 
              href="/categories"
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center animate-fade-in-up"
              style={{ animationDelay: `${categories.length * 100}ms` }}
            >
              <span className="text-xl md:text-2xl font-bold text-gray-700 group-hover:scale-110 transition-transform duration-300">View All →</span>
            </Link>
          )}
        </div>
      </section>

      {/* Products Section */}
      <section className="container mx-auto px-4 py-12 md:py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="text-center mb-10 md:mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold animate-pulse-slow">
            <Star className="w-4 h-4 animate-spin-slow" />
            <span>Our Products</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">Best Sellers</h2>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto animate-fade-in-up animation-delay-200">Discover our top-rated and most popular products</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64 animate-fade-in">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center animate-pulse">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Products Available</h3>
            <p className="text-gray-600 mb-6">Check back soon for our latest recommendations.</p>
            <Link href="/products">
              <button className="btn btn-primary animate-bounce">Browse All Products</button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 animate-fade-in">
            {products.slice(0, 8).map((product, index) => (
              <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-10 md:mt-12 animate-fade-in">
          <Link href="/products">
            <button className="btn btn-primary btn-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              View All Products
            </button>
          </Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container mx-auto px-4 py-12 md:py-16 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-blue-50/50 animate-pulse-slow"></div>
        <div className="text-center mb-10 md:mb-12 relative z-10 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">Why Shop with Chipper?</h2>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto animate-fade-in-up animation-delay-200">Join thousands of satisfied customers who trust us for quality and service</p>
        </div>
        <div className="grid md:grid-cols-4 gap-6 md:gap-8 relative z-10 animate-fade-in">
          {[
            {
              icon: Truck,
              title: 'Fast Delivery',
              desc: 'Get your orders delivered within 24-48 hours anywhere in Kenya',
              color: 'emerald'
            },
            {
              icon: Shield,
              title: 'Secure Payments',
              desc: 'Shop with confidence using our encrypted payment system',
              color: 'blue'
            },
            {
              icon: Leaf,
              title: 'Eco-Friendly',
              desc: 'Sustainable packaging and support for local Kenyan businesses',
              color: 'green'
            },
            {
              icon: Clock,
              title: '24/7 Support',
              desc: 'Our customer service team is always ready to help you',
              color: 'purple'
            }
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="group text-center p-6 md:p-8 rounded-xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 animate-fade-in-up"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <div className={`w-16 h-16 bg-${item.color}-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-${item.color}-200 transition-colors duration-300 group-hover:scale-110`}>
                <item.icon className={`w-8 h-8 text-${item.color}-600 group-hover:scale-110 transition-transform duration-300`} />
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors duration-300">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-gradient-to-r from-emerald-600 to-blue-600 py-12 md:py-16 text-white animate-fade-in">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in-up">Stay Updated</h2>
          <p className="text-emerald-100 text-base md:text-lg mb-8 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">Subscribe to our newsletter for exclusive deals, new arrivals, and special offers</p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-2 animate-fade-in-up animation-delay-400">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-1 px-4 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white transition-all duration-300"
            />
            <button className="btn btn-secondary px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-emerald-600 transition-all duration-300 transform hover:scale-105">
              Subscribe
            </button>
          </div>
          <p className="text-sm mt-4 opacity-90 animate-fade-in-up animation-delay-600">No spam, just great deals! Unsubscribe anytime.</p>
        </div>
      </section>
    </div>
  );
}