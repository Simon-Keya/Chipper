"use client";

import { useAuth } from '@/hooks/useAuth';
import { HelpCircle, Home, LogIn, LogOut, Menu, Package, Search, ShoppingBag, ShoppingCart, User, UserPlus, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  const loadCartCount = useCallback(async () => {
    if (!user) {
      setCartCount(0);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCartCount(data.items?.length || 0);
      } else {
        setCartCount(0);
      }
    } catch (error) {
      console.warn('Failed to load cart count from backend:', error);
      setCartCount(0);
    }
  }, [user]);

  // Load on mount and when user changes
  useEffect(() => {
    loadCartCount();
  }, [loadCartCount]);

  // Listen for cart updates from other components
  useEffect(() => {
    const handleUpdate = () => loadCartCount();
    window.addEventListener('cart-updated', handleUpdate);
    return () => window.removeEventListener('cart-updated', handleUpdate);
  }, [loadCartCount]);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products?search=${encodeURIComponent(search)}`);
      setSearch("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setCartCount(0);
    window.dispatchEvent(new Event('auth-change'));
    router.push('/');
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-white shadow-md"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Left */}
          <div className="flex items-center gap-4 lg:gap-8">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
            </button>

            <Link href="/" className="flex items-center gap-2 group" aria-label="Chipper Home">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-emerald-200 transition-all group-hover:scale-110">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                  Chipper
                </h1>
                <p className="text-[10px] text-gray-500 -mt-1 font-medium">Quality Products</p>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              <Link href="/" className="px-4 py-2 rounded-lg text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all font-medium flex items-center gap-2 group">
                <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Home
              </Link>
              <Link href="/products" className="px-4 py-2 rounded-lg text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all font-medium flex items-center gap-2 group">
                <Package className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Products
              </Link>
            </nav>
          </div>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-4 lg:mx-8">
            <form onSubmit={handleSearch} className="relative w-full group">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for products..."
                className="w-full h-11 pl-11 pr-4 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100 transition-all"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
              {search && (
                <button type="button" onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              )}
            </form>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={() => document.getElementById("mobile-search")?.focus()} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
              <Search className="w-5 h-5 text-gray-600" />
            </button>

            <Link href="/cart" className="relative p-2 rounded-lg hover:bg-emerald-50 group">
              <ShoppingCart className="w-5 h-5 lg:w-6 lg:h-6 text-gray-700 group-hover:text-emerald-600 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-600 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce-in">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden lg:block text-sm font-medium text-gray-700">{user.username}</span>
                </button>

                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user.username}</p>
                        <p className="text-xs text-gray-500 mt-1">Manage your account</p>
                      </div>
                      <Link href="/profile" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600">
                        <User className="w-4 h-4" />
                        My Profile
                      </Link>
                      <Link href="/orders" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600">
                        <Package className="w-4 h-4" />
                        My Orders
                      </Link>
                      <Link href="/cart" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600">
                        <ShoppingCart className="w-4 h-4" />
                        My Cart ({cartCount})
                      </Link>
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full">
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/auth/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
                <Link href="/auth/register" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </Link>
              </div>
            )}

            <Link href="/help" className="group relative px-3 lg:px-4 py-2 lg:py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg flex items-center gap-2 overflow-hidden">
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></span>
              <HelpCircle className="w-4 h-4 lg:w-5 lg:h-5 group-hover:rotate-12 transition-transform" />
              <span className="hidden lg:inline">Help</span>
            </Link>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              id="mobile-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full h-11 pl-11 pr-10 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100 transition-all"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            {search && (
              <button type="button" onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" onClick={closeMenu} />
          <div className="fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 lg:hidden overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">Chipper</h2>
                    <p className="text-xs text-gray-500">Navigation</p>
                  </div>
                </div>
                <button onClick={closeMenu} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {user ? (
                <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{user.username}</p>
                      <p className="text-xs text-gray-600">Welcome back!</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-6 space-y-2">
                  <Link href="/auth/login" onClick={closeMenu} className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold">
                    <LogIn className="w-5 h-5" />
                    Login
                  </Link>
                  <Link href="/auth/register" onClick={closeMenu} className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 rounded-xl font-semibold">
                    <UserPlus className="w-5 h-5" />
                    Sign Up
                  </Link>
                </div>
              )}

              <nav className="space-y-2">
                <Link href="/" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 group">
                  <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center group-hover:bg-emerald-100">
                    <Home className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Home</div>
                    <div className="text-xs text-gray-500">Main page</div>
                  </div>
                </Link>

                <Link href="/products" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 group">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Products</div>
                    <div className="text-xs text-gray-500">Browse catalog</div>
                  </div>
                </Link>

                {user && (
                  <>
                    <Link href="/cart" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 group relative">
                      <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center group-hover:bg-purple-100 relative">
                        <ShoppingCart className="w-5 h-5 text-purple-600" />
                        {cartCount > 0 && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                            {cartCount}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold">My Cart</div>
                        <div className="text-xs text-gray-500">{cartCount} items</div>
                      </div>
                    </Link>

                    <Link href="/orders" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 group">
                      <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center group-hover:bg-indigo-100">
                        <Package className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <div className="font-semibold">My Orders</div>
                        <div className="text-xs text-gray-500">Track orders</div>
                      </div>
                    </Link>
                  </>
                )}

                <Link href="/help" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:text-amber-600 hover:bg-amber-50 group">
                  <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center group-hover:bg-amber-100">
                    <HelpCircle className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Help & Support</div>
                    <div className="text-xs text-gray-500">Get assistance</div>
                  </div>
                </Link>

                {user && (
                  <button onClick={() => { handleLogout(); closeMenu(); }} className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 group w-full">
                    <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100">
                      <LogOut className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <div className="font-semibold">Logout</div>
                      <div className="text-xs text-red-500">Sign out</div>
                    </div>
                  </button>
                )}
              </nav>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;