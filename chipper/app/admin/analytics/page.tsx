'use client';

import { fetchOrders } from '@/lib/api';
import { Order } from '@/lib/types';
import { CheckCircle, DollarSign, ShoppingBag, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  ordersByStatus: { [key: string]: number };
  recentOrders: Order[];
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
    ordersByStatus: {},
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const orders = await fetchOrders(token);

        // Mock analytics calculation
        const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
        const totalOrders = orders.length;
        const totalCustomers = new Set(orders.map(order => order.customerDetails)).size;
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        const ordersByStatus = orders.reduce((acc, order) => {
          acc[order.status] = (acc[order.status] || 0) + 1;
          return acc;
        }, {} as { [key: string]: number });

        const recentOrders = orders.slice(0, 5).reverse(); // Last 5 orders

        setAnalytics({
          totalRevenue,
          totalOrders,
          totalCustomers,
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
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-success" />
              <div>
                <h3 className="text-lg font-semibold">Total Revenue</h3>
                <p className="text-2xl font-bold text-success">KSh {analytics.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-8 h-8 text-primary" />
              <div>
                <h3 className="text-lg font-semibold">Total Orders</h3>
                <p className="text-2xl font-bold text-primary">{analytics.totalOrders}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-warning" />
              <div>
                <h3 className="text-lg font-semibold">Avg Order Value</h3>
                <p className="text-2xl font-bold text-warning">KSh {analytics.averageOrderValue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-info" />
              <div>
                <h3 className="text-lg font-semibold">Completed Orders</h3>
                <p className="text-2xl font-bold text-info">{analytics.ordersByStatus.Delivered || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div className="card bg-base-100 shadow-sm mb-6">
        <div className="card-body">
          <h2 className="card-title">Order Status Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(analytics.ordersByStatus).map(([status, count]) => (
                  <tr key={status}>
                    <td>{status}</td>
                    <td>{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="table table-compact w-full">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {analytics.recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${
                        order.status === 'Delivered' ? 'badge-success' :
                        order.status === 'Shipped' ? 'badge-info' :
                        order.status === 'Processing' ? 'badge-warning' : 'badge-error'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td>KSh {order.total.toLocaleString()}</td>
                  </tr>
                ))}
                {analytics.recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center text-base-content/60">
                      No recent orders
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}