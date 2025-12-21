'use client';

import { deleteOrder, fetchOrders, updateOrderStatus } from '@/lib/api';
import { Order } from '@/lib/types';
import { Eye, Package, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login as admin');
        setLoading(false);
        return;
      }
      const data = await fetchOrders(token);
      // Sort by newest first
      data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(data);
    } catch (err) {
      setError('Failed to load orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await updateOrderStatus(orderId, newStatus, token);
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (orderId: number) => {
    if (!confirm('Delete this order permanently?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await deleteOrder(orderId, token);
      setOrders(prev => prev.filter(order => order.id !== orderId));
    } catch (err) {
      alert('Failed to delete order');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="alert alert-error max-w-md">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <Package className="w-12 h-12 text-emerald-600" />
              <h1 className="text-4xl font-bold text-gray-900">Orders Management</h1>
            </div>
            <span className="badge badge-lg badge-primary text-white">
              {orders.length} Total Orders
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-32 h-32 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Orders Yet</h3>
              <p className="text-gray-600">Orders will appear here when customers purchase</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left">Order ID</th>
                    <th className="text-left">Customer</th>
                    <th className="text-left">Date</th>
                    <th className="text-left">Total</th>
                    <th className="text-left">Status</th>
                    <th className="text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition">
                      <td className="font-bold text-primary">#{order.id}</td>
                      <td>{order.customerDetails || 'N/A'}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="font-bold">KSh {order.total.toLocaleString()}</td>
                      <td>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="select select-bordered select-sm"
                        >
                          <option>Pending</option>
                          <option>Processing</option>
                          <option>Shipped</option>
                          <option>Delivered</option>
                          <option>Cancelled</option>
                        </select>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <Link href={`/admin/orders/${order.id}`}>
                            <button className="btn btn-sm btn-ghost text-info">
                              <Eye className="w-4 h-4" />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(order.id)}
                            className="btn btn-sm btn-ghost text-error"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
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