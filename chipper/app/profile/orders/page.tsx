'use client';

import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Order {
  id: number;
  orderNumber: string;
  date: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  items: number;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      orderNumber: '#ORD-001',
      date: 'Dec 1, 2024',
      status: 'Delivered',
      total: 25000,
      items: 3,
    },
    {
      id: 2,
      orderNumber: '#ORD-002',
      date: 'Nov 28, 2024',
      status: 'Shipped',
      total: 15000,
      items: 1,
    },
    {
      id: 3,
      orderNumber: '#ORD-003',
      date: 'Nov 25, 2024',
      status: 'Processing',
      total: 45000,
      items: 5,
    },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch orders from API
    // const fetchOrders = async () => {
    //   const token = localStorage.getItem('token');
    //   const response = await fetch('/api/orders', {
    //     headers: { Authorization: `Bearer ${token}` },
    //   });
    //   const data = await response.json();
    //   setOrders(data);
    //   setLoading(false);
    // };
    // fetchOrders();
    setTimeout(() => setLoading(false), 1000); // Simulate loading
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
                    <h3 className="font-semibold text-base-content">{order.orderNumber}</h3>
                    <p className="text-sm text-base-content/60">{order.date}</p>
                  </div>
                  <div className={`badge badge-lg ${order.status === 'Delivered' ? 'badge-success' : order.status === 'Shipped' ? 'badge-info' : order.status === 'Processing' ? 'badge-warning' : 'badge-error'}`}>
                    {order.status}
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm text-base-content/70 mb-3">
                  <span>{order.items} items</span>
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