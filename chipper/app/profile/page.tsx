
'use client';

import { useAuth } from '@/hooks/useAuth';
import { Package, Settings, ShoppingBag, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-base-content">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center sticky top-24">
              <div className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <User className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{user.username}</h2>
              <p className="text-gray-600 mb-1">{user.email || 'No email provided'}</p>
              <p className="text-sm text-gray-500">Member since December 2025</p>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4">
                  <ShoppingBag className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">12</div>
                  <p className="text-sm text-gray-600">Orders</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4">
                  <Package className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">5</div>
                  <p className="text-sm text-gray-600">Wishlist</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="mt-8 btn btn-outline btn-error w-full hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-2 space-y-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">My Account</h1>

            <div className="grid md:grid-cols-2 gap-6">
              <Link href="/profile/orders">
                <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">Order History</h3>
                        <p className="text-gray-600">View and track your orders</p>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>

              <Link href="/wishlist">
                <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                        <Package className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">My Wishlist</h3>
                        <p className="text-gray-600">Saved items for later</p>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>

              <Link href="/profile/settings">
                <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Settings className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">Account Settings</h3>
                        <p className="text-gray-600">Update profile and preferences</p>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}