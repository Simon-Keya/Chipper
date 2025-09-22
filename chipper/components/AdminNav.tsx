'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminNav() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/admin/login');
  };

  return (
    <div className="navbar bg-base-100 shadow-md sticky top-0 z-50">
      <div className="navbar-start">
        <Link href="/admin/dashboard" className="btn btn-ghost text-xl text-neutral-content">Chipper Admin</Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/admin/dashboard" className="text-neutral-content">Dashboard</Link>
          </li>
          <li>
            <Link href="/admin/products" className="text-neutral-content">Products</Link>
          </li>
          <li>
            <Link href="/admin/categories" className="text-neutral-content">Categories</Link>
          </li>
          <li>
            <Link href="/admin/orders" className="text-neutral-content">Orders</Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <button onClick={handleLogout} className="btn btn-outline btn-error">
          Logout
        </button>
      </div>
    </div>
  );
}