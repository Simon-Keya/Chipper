'use client';

import { fetchOrders } from '@/lib/api';
import { Order } from '@/lib/types';
import { Edit, Eye, Package, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication required');
          return;
        }
        const data = await fetchOrders(token);
        setOrders(data);
      } catch (err) {
        setError('Failed to load orders');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    // Implement status update API call
    console.log(`Update order ${orderId} to ${newStatus}`);
    // After update, refresh the list
    const token = localStorage.getItem('token');
    if (token) {
      const updatedOrders = await fetchOrders(token);
      setOrders(updatedOrders);
    }
  };

  const deleteOrder = async (orderId: number) => {
    // Implement delete API call
    console.log(`Delete order ${orderId}`);
    // After delete, refresh the list
    const token = localStorage.getItem('token');
    if (token) {
      const updatedOrders = await fetchOrders(token);
      setOrders(updatedOrders);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Orders Management</h1>
        <Link href="/admin/dashboard">
          <button className="btn btn-ghost">Back to Dashboard</button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="font-semibold">#{order.id}</td>
                <td>{order.customerDetails}</td>
                <td>KSh {order.total.toLocaleString()}</td>
                <td>
                  <select 
                    value={order.status} 
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className="select select-bordered select-sm"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="flex gap-2">
                    <Link href={`/admin/orders/${order.id}`}>
                      <button className="btn btn-sm btn-ghost">
                        <Eye className="w-4 h-4" />
                      </button>
                    </Link>
                    <button className="btn btn-sm btn-ghost" onClick={() => updateOrderStatus(order.id, order.status)}>
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteOrder(order.id)} className="btn btn-sm btn-error btn-ghost">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-base-content/40 mx-auto mb-4" />
          <p className="text-base-content/60">No orders found.</p>
        </div>
      )}
    </div>
  );
}