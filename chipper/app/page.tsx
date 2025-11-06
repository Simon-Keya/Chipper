// app/page.tsx - Enhanced homepage with CSS animations and visual effects

import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { fetchCategories, fetchProducts } from '../lib/api';
import { Category, Product } from '../lib/types';

export const metadata: Metadata = {
  title: 'Chipper - Your One-Stop Shop for Quality Products',
  description: 'Explore a wide range of premium products at Chipper - from cutting-edge electronics to stylish fashion. Shop with confidence and enjoy fast delivery across Kenya.',
  keywords: 'ecommerce, online shopping, electronics, fashion, home goods, Kenya, Chipper, quality products',
  openGraph: {
    title: 'Chipper - Premium Online Shopping in Kenya',
    description: 'Discover quality products for all your needs. Fast delivery, secure payments, exceptional service.',
    url: 'https://chipper-store.com',
    images: ['/images/og-image.jpg'],
    type: 'website',
  },
};

export default async function Home() {
  const [products, categories]: [Product[], Category[]] = await Promise.all([
    fetchProducts(),
    fetchCategories(),
  ]);

  const displayProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
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
              <span className="group-hover:scale-105 transition-transform inline-block">New Arrivals Every Week</span>
            </div>
            
            {/* Animated Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in animation-delay-200">
              <span className="inline-block bg-gradient-to-r from-gray-900 via-emerald-700 to-blue-900 bg-clip-text text-transparent animate-gradient-x">
                Welcome to Chipper
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up animation-delay-400">
              Discover quality products for every need, from electronics to fashion. 
              Shop with confidence and enjoy seamless ordering via WhatsApp.
            </p>
            
            {/* CTA Buttons with hover effects */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up animation-delay-600">
              <Link 
                href="/products" 
                className="group relative btn btn-lg bg-emerald-600 hover:bg-emerald-700 text-white border-0 shadow-lg hover:shadow-glow-lg transform hover:scale-105 transition-all duration-300 min-w-[200px] overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="relative">Shop Now</span>
              </Link>
              
              <Link 
                href="#categories" 
                className="group btn btn-lg bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-300 hover:border-emerald-600 min-w-[200px] transition-all duration-300 shadow-sm hover:shadow-md relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-emerald-50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                <span className="relative">Browse Categories</span>
              </Link>
            </div>

            {/* Trust Badges with stagger animation */}
            <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {[
                { icon: 'truck', title: 'Fast Delivery', desc: 'Within 24-48 hours', color: 'emerald', delay: '800' },
                { icon: 'shield', title: 'Secure Orders', desc: 'WhatsApp verified', color: 'blue', delay: '1000' },
                { icon: 'star', title: 'Quality Assured', desc: '100% authentic', color: 'amber', delay: '1200' }
              ].map((badge, idx) => (
                <div 
                  key={idx}
                  className={`group flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-scale-in cursor-default`}
                  style={{ animationDelay: `${badge.delay}ms` }}
                >
                  <div className={`w-12 h-12 bg-${badge.color}-100 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    {badge.icon === 'truck' && (
                      <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                      </svg>
                    )}
                    {badge.icon === 'shield' && (
                      <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                    {badge.icon === 'star' && (
                      <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    )}
                  </div>
                  <span className="font-semibold text-gray-800 group-hover:text-emerald-700 transition-colors">{badge.title}</span>
                  <span className="text-sm text-gray-600">{badge.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wavy Bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" className="w-full h-auto fill-white">
            <path d="M0,50 C360,90 720,10 1440,50 L1440,100 L0,100 Z"></path>
          </svg>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="container mx-auto px-4 py-16 bg-white relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 hover:scale-105 transition-transform duration-300 inline-block">
            Shop by Category
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Browse through our carefully curated categories to find exactly what you need
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/products?categoryId=${category.id}`}
              className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-sm hover:shadow-2xl p-6 border border-gray-200 hover:border-emerald-400 transition-all duration-500 transform hover:-translate-y-2 hover:rotate-1"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Floating circle */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-100 rounded-full blur-2xl group-hover:bg-emerald-200 transition-colors duration-500 opacity-50"></div>
              
              <div className="relative z-10 flex flex-col items-center text-center gap-3">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-xl flex items-center justify-center group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-soft">
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                    {category.name.includes('Electronics') && '📱'}
                    {category.name.includes('Fashion') && '👔'}
                    {category.name.includes('Home') && '🏠'}
                    {category.name.includes('Beauty') && '💄'}
                    {category.name.includes('Sports') && '⚽'}
                    {!['Electronics', 'Fashion', 'Home', 'Beauty', 'Sports'].some(c => category.name.includes(c)) && '🛍️'}
                  </span>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-emerald-700 transition-colors duration-300">
                    {category.name}
                  </h3>
                </div>
                
                <div className="text-xs text-emerald-600 font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  Explore →
                </div>
              </div>

              {/* Sparkle effect */}
              <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping"></div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container mx-auto px-4 py-16 bg-gradient-to-b from-white to-gray-50 relative">
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold animate-bounce-in">
            ⭐ Handpicked for You
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 hover:scale-105 transition-transform duration-300 inline-block">
            Featured Products
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Check out our most popular items, loved by customers across Kenya
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayProducts.map((product, index) => (
            <div 
              key={product.id} 
              className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-emerald-300 transform hover:-translate-y-3 hover:rotate-1"
              style={{ animationDelay: `${index * 75}ms` }}
            >
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-125 group-hover:rotate-3 transition-all duration-700"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  priority={index < 4}
                />
                
                {/* Stock Badge */}
                <div className="absolute top-3 left-3 flex flex-col gap-2 animate-slide-down">
                  {product.stock > 0 ? (
                    <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full shadow-lg backdrop-blur-sm bg-opacity-90 hover:scale-110 transition-transform duration-300">
                      ✓ In Stock
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-gray-500 text-white text-xs font-semibold rounded-full shadow-lg backdrop-blur-sm bg-opacity-90">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Quick View Overlay with ripple effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                  <Link 
                    href={`/products/${product.id}`}
                    className="relative bg-white text-gray-900 px-6 py-3 rounded-full font-semibold shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:scale-110 hover:shadow-glow-lg overflow-hidden"
                  >
                    <span className="relative z-10">Quick View</span>
                    <span className="absolute inset-0 bg-emerald-100 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
                  </Link>
                </div>

                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-emerald-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              
              <div className="p-5 relative">
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-2xl"></div>
                
                <div className="relative z-10">
                  <div className="mb-2">
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full group-hover:scale-105 transition-transform duration-300">
                      {product.category.name}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors duration-300">
                    {product.name}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {product.description || 'High quality product available now'}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 inline-block">
                        Ksh. {product.price.toLocaleString()}
                      </div>
                      {product.stock <= 5 && product.stock > 0 && (
                        <div className="text-xs text-orange-600 font-medium mt-1 animate-pulse">
                          ⚡ Only {product.stock} left!
                        </div>
                      )}
                    </div>
                    
                    <Link 
                      href={`/products/${product.id}`}
                      className="btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white border-0 shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300"
                    >
                      View
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Products Button */}
        <div className="text-center mt-12">
          <Link 
            href="/products"
            className="group inline-flex items-center gap-2 btn btn-lg bg-white hover:bg-emerald-50 text-gray-800 border-2 border-gray-300 hover:border-emerald-600 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
            <span className="relative">View All Products</span>
            <svg className="w-5 h-5 relative group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Why Choose Us Section */}
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
                <svg className="w-8 h-8 text-black group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {item.icon === 'check' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />}
                  {item.icon === 'clock' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
                  {item.icon === 'support' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />}
                </svg>
                {item.icon === 'whatsapp' && (
                  <svg className="w-8 h-8 text-green-500 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
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