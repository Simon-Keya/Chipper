'use client';

import { Heart, Settings, ShoppingBag, User } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    joined: 'January 2024',
    orders: 12,
    wishlist: 5,
  });

  useEffect(() => {
    // Fetch user data from API
    // const fetchUserData = async () => {
    //   const token = localStorage.getItem('token');
    //   const response = await fetch('/api/auth/profile', {
    //     headers: { Authorization: `Bearer ${token}` },
    //   });
    //   const data = await response.json();
    //   setUserData(data);
    // };
    // fetchUserData();
  }, []);

  return (
    <div className="bg-base-100 rounded-xl shadow-sm p-6">
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-12 h-12 text-primary-content" />
        </div>
        <h2 className="text-2xl font-bold text-base-content mb-1">{userData.name}</h2>
        <p className="text-base-content/60 mb-4">{userData.email}</p>
        <p className="text-sm text-base-content/50">Member since {userData.joined}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="text-center p-4 bg-base-200 rounded-xl">
          <ShoppingBag className="w-8 h-8 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold text-base-content">{userData.orders}</div>
          <p className="text-sm text-base-content/60">Orders</p>
        </div>
        <div className="text-center p-4 bg-base-200 rounded-xl">
          <Heart className="w-8 h-8 text-secondary mx-auto mb-2" />
          <div className="text-2xl font-bold text-base-content">{userData.wishlist}</div>
          <p className="text-sm text-base-content/60">Wishlist</p>
        </div>
        <div className="text-center p-4 bg-base-200 rounded-xl">
          <svg className="w-8 h-8 text-accent mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <div className="text-2xl font-bold text-base-content">0</div>
          <p className="text-sm text-base-content/60">Reviews</p>
        </div>
        <div className="text-center p-4 bg-base-200 rounded-xl col-span-1 md:col-span-1">
          <Settings className="w-8 h-8 text-info mx-auto mb-2" />
          <div className="text-2xl font-bold text-base-content">Edit</div>
          <p className="text-sm text-base-content/60">Profile</p>
        </div>
      </div>

      <div className="space-y-4">
        <Link href="/profile/orders" className="block p-4 bg-base-200 rounded-xl hover:bg-base-300 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-base-content/70" />
              <span className="font-semibold text-base-content">Order History</span>
            </div>
            <svg className="w-4 h-4 text-base-content/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>

        <Link href="/wishlist" className="block p-4 bg-base-200 rounded-xl hover:bg-base-300 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-base-content/70" />
              <span className="font-semibold text-base-content">Wishlist</span>
            </div>
            <svg className="w-4 h-4 text-base-content/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>

        <Link href="/profile/settings" className="block p-4 bg-base-200 rounded-xl hover:bg-base-300 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-base-content/70" />
              <span className="font-semibold text-base-content">Account Settings</span>
            </div>
            <svg className="w-4 h-4 text-base-content/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      </div>

      <div className="mt-8 pt-6 border-t border-base-300">
        <button className="btn btn-outline btn-error w-full">
          Logout
        </button>
      </div>
    </div>
  );
}