'use client';

import { fetchOrders } from '@/lib/api';
import { Order } from '@/lib/types';
import { Package, ShoppingBag, Truck } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }
        const data = await fetchOrders(token);
        setOrders(data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
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
      <div className="container mx-auto max-w-5xl">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">My Orders</h1>
              <p className="text-gray-600">Track and manage your purchases</p>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-16 h-16 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Orders Yet</h3>
              <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                Start shopping and your orders will appear here
              </p>
              <Link href="/products">
                <button className="btn btn-primary btn-lg">
                  Start Shopping
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const statusColor = 
                  order.status === 'Delivered' ? 'badge-success' :
                  order.status === 'Shipped' ? 'badge-info' :
                  order.status === 'Processing' ? 'badge-warning' :
                  'badge-error';

                return (
                  <div key={order.id} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 hover:shadow-lg transition-shadow border border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <h3 className="text-xl font-bold text-gray-900">Order #{order.id}</h3>
                          <div className={`badge badge-lg ${statusColor}`}>
                            {order.status}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <p className="font-medium">Date Placed</p>
                            <p>{new Date(order.createdAt).toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                          </div>
                          <div>
                            <p className="font-medium">Total Amount</p>
                            <p className="text-xl font-bold text-gray-900">KSh {order.total.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Link href={`/profile/orders/${order.id}`}>
                          <button className="btn btn-outline btn-primary">
                            View Details
                          </button>
                        </Link>
                        {order.status === 'Shipped' && (
                          <button className="btn btn-success">
                            <Truck className="w-4 h-4 mr-2" />
                            Track
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}