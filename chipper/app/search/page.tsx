'use client';

import { fetchOrders } from '@/lib/api';
import { Order } from '@/lib/types';
import { ShoppingBag } from 'lucide-react';
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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <ShoppingBag className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold text-base-content">Order History</h2>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="w-16 h-16 text-base-content/40 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-base-content mb-2">No Orders Yet</h3>
          <p className="text-base-content/60 mb-6">Start shopping to see your orders here.</p>
          <Link href="/products">
            <button className="btn btn-primary">Start Shopping</button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="card bg-base-200 shadow-sm">
              <div className="card-body p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-base-content">#{order.id}</h3>
                    <p className="text-sm text-base-content/60">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className={`badge badge-lg ${order.status === 'Delivered' ? 'badge-success' : order.status === 'Shipped' ? 'badge-info' : order.status === 'Processing' ? 'badge-warning' : 'badge-error'}`}>
                    {order.status}
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm text-base-content/70 mb-3">
                  <span>1 item</span>
                  <span>KSh {order.total.toLocaleString()}</span>
                </div>
                <div className="flex gap-2">
                  <Link href={`/profile/orders/${order.id}`} className="btn btn-sm btn-outline btn-primary flex-1">
                    View Details
                  </Link>
                  {order.status === 'Processing' && (
                    <button className="btn btn-sm btn-secondary flex-1">
                      Track Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}