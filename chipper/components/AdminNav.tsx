"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";

export default function AdminNav() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/admin/login");
  };

  return (
    <nav className="navbar bg-base-100 shadow-md sticky top-0 z-50 border-b border-base-300">
      <div className="navbar-start">
        <Link
          href="/admin/dashboard"
          className="btn btn-ghost text-xl font-bold text-primary"
        >
          Chipper Admin
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 font-medium">
          <li>
            <Link href="/admin/products" className="hover:text-primary">
              Products
            </Link>
          </li>
          <li>
            <Link href="/admin/categories" className="hover:text-primary">
              Categories
            </Link>
          </li>
          <li>
            <Link href="/admin/orders" className="hover:text-primary">
              Orders
            </Link>
          </li>
        </ul>
      </div>

      {/* Mobile Menu Toggle */}
      <div className="navbar-end flex gap-2">
        <button
          onClick={handleLogout}
          className="btn btn-outline btn-error hidden lg:flex"
        >
          Logout
        </button>
        <button
          className="btn btn-ghost lg:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu className="w-6 h-6 text-neutral-content" />
        </button>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-base-100 border-t border-base-300 shadow-lg lg:hidden">
          <ul className="menu p-4 space-y-2">
            <li>
              <Link
                href="/admin/products"
                onClick={() => setMenuOpen(false)}
                className="hover:text-primary"
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                href="/admin/categories"
                onClick={() => setMenuOpen(false)}
                className="hover:text-primary"
              >
                Categories
              </Link>
            </li>
            <li>
              <Link
                href="/admin/orders"
                onClick={() => setMenuOpen(false)}
                className="hover:text-primary"
              >
                Orders
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="btn btn-error w-full"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
