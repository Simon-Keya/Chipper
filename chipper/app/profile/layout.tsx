import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Chipper - Profile',
  description: 'Manage your account, orders, and wishlist',
};

interface ProfileLayoutProps {
  children: React.ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  // Simple auth check - replace with actual auth logic (e.g., NextAuth)
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (!token) {
    redirect('/auth/login');
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
                <Link href="/profile" className="link link-hover">Overview</Link>
                <Link href="/profile/orders" className="link link-hover">Orders</Link>
                <Link href="/wishlist" className="link link-hover">Wishlist</Link>
                <Link href="/profile/settings" className="link link-hover">Settings</Link>
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