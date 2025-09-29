import { Metadata } from 'next';
import ProtectedRoute from '../../components/ProtectedRoute';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Chipper',
  description: 'Manage products and orders for Chipper.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-base-100">
        <main className="container mx-auto px-4 py-8">{children}</main>
      </div>
    </ProtectedRoute>
  );
}