import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Chipper - Profile',
  description: 'Manage your account, orders, and wishlist',
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
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