'use client';

import { deleteOrder, fetchOrders, updateOrderStatus } from '@/lib/api'; // Assume updateOrderStatus and deleteOrder exist
import { Order } from '@/lib/types';
import { ArrowLeft, CreditCard, Edit, MapPin, Trash2, User } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication required');
          return;
        }
        // Fetch specific order - assume API supports /api/orders/:id
        const orders = await fetchOrders(token);
        const foundOrder = orders.find(o => o.id.toString() === orderId);
        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          setError('Order not found');
        }
      } catch (err) {
        setError('Failed to load order');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  const handleStatusUpdate = async (newStatus: string) => {
    if (!order) return;
    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Assume updateOrderStatus API call
        await updateOrderStatus(order.id, newStatus, token);
        setOrder({ ...order, status: newStatus });
      }
    } catch (err) {
      setError('Failed to update status');
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!order || !confirm('Are you sure you want to delete this order?')) return;
    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await deleteOrder(order.id, token);
        router.push('/admin/orders');
      }
    } catch (err) {
      setError('Failed to delete order');
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="alert alert-error">
          <span>{error || 'Order not found'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders">
            <button className="btn btn-ghost">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Order #{order.id}</h1>
            <p className="text-base-content/60">Order details and management</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => handleDelete()} 
            className="btn btn-error btn-sm"
            disabled={updating}
          >
            <Trash2 className="w-4 h-4" />
            Delete Order
          </button>
          <button className="btn btn-primary btn-sm" disabled={updating}>
            <Edit className="w-4 h-4" />
            Edit Order
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Summary */}
        <div className="lg:col-span-2">
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Order ID:</span>
                  <span className="font-semibold">#{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <select 
                    value={order.status} 
                    onChange={(e) => handleStatusUpdate(e.target.value)}
                    className="select select-bordered select-sm"
                    disabled={updating}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="divider"></div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>KSh {order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="card bg-base-100 shadow-sm mt-6">
            <div className="card-body">
              <h2 className="card-title">Order Items</h2>
              <div className="overflow-x-auto">
                <table className="table table-compact w-full">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Assuming order.items exists; adjust based on your Order type */}
                    {order.items ? (
                      order.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.product.name}</td>
                          <td>{item.quantity}</td>
                          <td>KSh {item.product.price.toLocaleString()}</td>
                          <td>KSh {(item.product.price * item.quantity).toLocaleString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center text-base-content/60">
                          No items in this order
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Customer & Shipping Info */}
        <div>
          <div className="card bg-base-100 shadow-sm mb-6">
            <div className="card-body">
              <h2 className="card-title">Customer Information</h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{order.customerDetails}</span>
                </div>
                {/* Add more customer details if available */}
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Shipping Information</h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{order.shippingAddress?.line1 || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{order.shippingAddress?.city || 'N/A'}</span>
                </div>
                {/* Add more shipping details */}
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm mt-6">
            <div className="card-body">
              <h2 className="card-title">Payment Information</h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  <span>Paid: {order.paymentStatus || 'Completed'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  <span>Method: {order.paymentMethod || 'M-Pesa'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}