'use client';

import { fetchOrders } from '@/lib/api';
import { Order } from '@/lib/types';
import { ChevronRight, LayoutDashboard, ListOrdered, Package, ShoppingBag, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    revenueToday: 0,
    activeUsers: 0,
  });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    const loadData = async () => {
      try {
        const data = await fetchOrders(token);
        const sorted = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(sorted.slice(0, 10));

        const today = new Date().toDateString();
        const todayRevenue = data
          .filter(o => new Date(o.createdAt).toDateString() === today)
          .reduce((sum, o) => sum + o.total, 0);

        setStats({
          totalOrders: data.length,
          pendingOrders: data.filter(o => o.status === 'Processing' || o.status === 'Pending').length,
          revenueToday: todayRevenue,
          activeUsers: new Set(data.map(o => o.customerDetails)).size,
        });
      } catch (error) {
        console.error('Failed to load dashboard data');
      }
    };

    loadData();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-4">
            Admin Dashboard
          </h1>
          <p className="text-xl text-gray-600">Welcome back! Here is what is happening today</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-emerald-500">
            <div className="flex items-center justify-between mb-4">
              <ShoppingBag className="w-10 h-10 text-emerald-600" />
              <span className="text-3xl font-bold text-emerald-600">{stats.totalOrders}</span>
            </div>
            <p className="text-gray-600">Total Orders</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-4">
              <Package className="w-10 h-10 text-orange-600" />
              <span className="text-3xl font-bold text-orange-600">{stats.pendingOrders}</span>
            </div>
            <p className="text-gray-600">Pending Orders</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl font-bold text-green-600">KSh</span>
              </div>
              <span className="text-3xl font-bold text-green-600">
                {stats.revenueToday.toLocaleString()}
              </span>
            </div>
            <p className="text-gray-600">Today&apos;s Revenue</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-10 h-10 text-blue-600" />
              <span className="text-3xl font-bold text-blue-600">{stats.activeUsers}</span>
            </div>
            <p className="text-gray-600">Active Customers</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <Link href="/admin/products" className="group">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
              <ShoppingBag className="w-16 h-16 mb-4 opacity-90" />
              <h3 className="text-2xl font-bold mb-2">Manage Products</h3>
              <p className="opacity-90">Add, edit, and organize your inventory</p>
              <ChevronRight className="w-8 h-8 mt-6 group-hover:translate-x-2 transition" />
            </div>
          </Link>

          <Link href="/admin/orders" className="group">
            <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
              <ListOrdered className="w-16 h-16 mb-4 opacity-90" />
              <h3 className="text-2xl font-bold mb-2">View Orders</h3>
              <p className="opacity-90">Process, track, and manage customer orders</p>
              <ChevronRight className="w-8 h-8 mt-6 group-hover:translate-x-2 transition" />
            </div>
          </Link>

          <Link href="/admin/analytics" className="group">
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
              <LayoutDashboard className="w-16 h-16 mb-4 opacity-90" />
              <h3 className="text-2xl font-bold mb-2">Analytics</h3>
              <p className="opacity-90">Sales reports and business insights</p>
              <ChevronRight className="w-8 h-8 mt-6 group-hover:translate-x-2 transition" />
            </div>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest Orders</h2>
          {orders.length === 0 ? (
            <p className="text-center text-gray-500 py-12">No orders yet</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-gray-200 rounded-xl overflow-hidden">
                      <Image
                        src={order.product.imageUrl || '/placeholder.jpg'}
                        alt={order.product.name}
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{order.product.name}</h4>
                      <p className="text-gray-600">Order #{order.id} • {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">KSh {order.total.toLocaleString()}</p>
                    <span className={`badge badge-lg mt-2 ${
                      order.status === 'Delivered' ? 'badge-success' :
                      order.status === 'Shipped' ? 'badge-info' :
                      order.status === 'Processing' ? 'badge-warning' :
                      'badge-error'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}