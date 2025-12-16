import { useAuth } from '@/hooks/useAuth';
import { Metadata } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const metadata: Metadata = {
  title: 'Chipper - Profile',
  description: 'Manage your account, orders, and wishlist',
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  // Use client-side auth check only
  'use client';

  const { user, loading } = useAuth();
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
          <p className="mt-4 text-base-content">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Redirecting...
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 space-y-4">
            <div className="bg-base-100 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">My Account</h3>
              <nav className="space-y-2">
                <Link href="/profile" className="block py-2 px-4 rounded-lg hover:bg-base-200 transition-colors font-medium">
                  Overview
                </Link>
                <Link href="/profile/orders" className="block py-2 px-4 rounded-lg hover:bg-base-200 transition-colors">
                  Orders
                </Link>
                <Link href="/wishlist" className="block py-2 px-4 rounded-lg hover:bg-base-200 transition-colors">
                  Wishlist
                </Link>
                <Link href="/profile/settings" className="block py-2 px-4 rounded-lg hover:bg-base-200 transition-colors">
                  Settings
                </Link>
              </nav>
            </div>
          </aside>
          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}