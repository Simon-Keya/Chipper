'use client';

import { fetchOrders } from '@/lib/api';
import { Order } from '@/lib/types';
import { Boxes, ChevronRight, LayoutDashboard, ListOrdered, Package, ShoppingBag, Users } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-600">Welcome back! Here&apos;s your store overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-emerald-500">
            <div className="flex items-center justify-between mb-3">
              <ShoppingBag className="w-8 h-8 text-emerald-600" />
              <span className="text-2xl font-bold text-emerald-600">{stats.totalOrders}</span>
            </div>
            <p className="text-gray-600 font-medium">Total Orders</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-3">
              <Package className="w-8 h-8 text-orange-600" />
              <span className="text-2xl font-bold text-orange-600">{stats.pendingOrders}</span>
            </div>
            <p className="text-gray-600 font-medium">Pending Orders</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-green-600">KSh</span>
              </div>
              <span className="text-2xl font-bold text-green-600">
                {stats.revenueToday.toLocaleString()}
              </span>
            </div>
            <p className="text-gray-600 font-medium">Today&apos;s Revenue</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-3">
              <Users className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">{stats.activeUsers}</span>
            </div>
            <p className="text-gray-600 font-medium">Active Customers</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Link href="/admin/products" className="group">
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <ShoppingBag className="w-10 h-10 text-emerald-600" />
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Manage Products</h3>
              <p className="text-gray-600 text-sm">Add, edit, and organize inventory</p>
            </div>
          </Link>

          <Link href="/admin/categories" className="group">
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <Boxes className="w-10 h-10 text-purple-600" />
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Manage Categories</h3>
              <p className="text-gray-600 text-sm">Create and organize product categories</p>
            </div>
          </Link>

          <Link href="/admin/orders" className="group">
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <ListOrdered className="w-10 h-10 text-orange-600" />
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 transition" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">View Orders</h3>
              <p className="text-gray-600 text-sm">Process and track customer orders</p>
            </div>
          </Link>

          <Link href="/admin/analytics" className="group">
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <LayoutDashboard className="w-10 h-10 text-indigo-600" />
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Analytics</h3>
              <p className="text-gray-600 text-sm">Sales reports and insights</p>
            </div>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Orders</h2>
          {orders.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No orders yet — start selling!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                  <div className="flex items-center gap-5 mb-4 sm:mb-0">
                    <div className="w-14 h-14 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={order.product.imageUrl || '/placeholder.jpg'}
                        alt={order.product.name}
                        width={56}
                        height={56}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{order.product.name}</h4>
                      <p className="text-sm text-gray-600">Order #{order.id} • {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-6">
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">KSh {order.total.toLocaleString()}</p>
                      <span className={`badge mt-1 ${
                        order.status === 'Delivered' ? 'badge-success' :
                        order.status === 'Shipped' ? 'badge-info' :
                        order.status === 'Processing' ? 'badge-warning' :
                        'badge-error'
                      }`}>
                        {order.status}
                      </span>
                    </div>
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