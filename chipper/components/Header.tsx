
"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      console.log("Searching for:", search);
      // Replace with actual search logic or navigation
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
      <div className="navbar max-w-7xl mx-auto px-4">
        {/* Left: Branding + Mobile Menu */}
        <div className="navbar-start flex items-center gap-6">
          <div className="dropdown lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="btn btn-ghost"
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <ul
              className={`menu menu-sm dropdown-content mt-3 p-2 shadow-lg bg-white rounded-box w-52 border border-gray-200 ${
                isMenuOpen ? "" : "hidden"
              }`}
            >
              <li>
                <Link href="/" className="hover:text-emerald-600">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-emerald-600">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-emerald-600">
                  Help
                </Link>
              </li>
            </ul>
          </div>

          {/* Branding */}
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-wide text-emerald-600"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            CHIPPER ECOMMERCE
          </Link>

          {/* Inline Nav Links (Desktop only) */}
          <nav className="hidden lg:flex gap-8 font-medium text-gray-900 ml-6">
            <Link href="/" className="hover:text-emerald-600">
              Home
            </Link>
            <Link href="/products" className="hover:text-emerald-600">
              Products
            </Link>
          </nav>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-2xl mx-6">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="input input-bordered w-full rounded-md pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </form>
        </div>

        {/* Right: Help Button */}
        <div className="navbar-end hidden lg:flex">
          <Link
            href="/help"
            className="btn bg-amber-500 border-none hover:bg-amber-600 text-white text-lg px-6 py-3 rounded-lg shadow-md"
          >
            Help
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
