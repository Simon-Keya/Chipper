'use client';

import { fetchOrders } from '@/lib/api';
import { Order } from '@/lib/types';
import { DollarSign, ShoppingBag, TrendingUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  ordersByStatus: { name: string; count: number }[];
  recentOrders: Order[];
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
    ordersByStatus: [],
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const orders = await fetchOrders(token);

        const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
        const totalOrders = orders.length;
        const uniqueCustomers = new Set(orders.map(order => order.customerDetails || order.id)).size;
        const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

        // Status breakdown
        const statusCount = orders.reduce((acc, order) => {
          const status = order.status || 'Unknown';
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const ordersByStatus = Object.entries(statusCount).map(([name, count]) => ({
          name,
          count,
        }));

        const recentOrders = orders
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 8);

        setAnalytics({
          totalRevenue,
          totalOrders,
          totalCustomers: uniqueCustomers,
          averageOrderValue,
          ordersByStatus,
          recentOrders,
        });
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center">Analytics Dashboard</h1>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-emerald-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-emerald-600 mt-2">
                  KSh {analytics.totalRevenue.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-12 h-12 text-emerald-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-medium">Total Orders</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">{analytics.totalOrders}</p>
              </div>
              <ShoppingBag className="w-12 h-12 text-orange-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-medium">Unique Customers</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{analytics.totalCustomers}</p>
              </div>
              <Users className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-medium">Avg Order Value</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  KSh {analytics.averageOrderValue.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-purple-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Orders by Status</h3>
          {analytics.ordersByStatus.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {analytics.ordersByStatus.map((status) => (
                <div key={status.name} className="text-center p-6 bg-gray-50 rounded-xl">
                  <p className="text-4xl font-bold text-gray-900">{status.count}</p>
                  <p className="text-gray-600 mt-2">{status.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-20">No order data yet</p>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Orders</h3>
          {analytics.recentOrders.length === 0 ? (
            <p className="text-center text-gray-500 py-12">No orders yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="font-bold">#{order.id}</td>
                      <td>{order.customerDetails || 'N/A'}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${
                          order.status === 'Delivered' ? 'badge-success' :
                          order.status === 'Shipped' ? 'badge-info' :
                          order.status === 'Processing' ? 'badge-warning' :
                          'badge-error'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="font-bold">KSh {order.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}