'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Order } from '../../../lib/types';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/admin/login');

    const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000');
    socket.on('new-order', (order: Order) => {
      setOrders((prev) => [order, ...prev]);
    });
    socket.on('stock-update', ({ productId, stock }: { productId: number; stock: number }) => {
      console.log(`Product ${productId} stock updated to ${stock}`);
    });

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch(() => router.push('/admin/login'));

    return () => {
      socket.disconnect();
    };
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-neutral-content">Chipper Admin Dashboard</h1>
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Link href="/admin/products" className="btn btn-primary">
          Manage Products
        </Link>
        <Link href="/admin/categories" className="btn btn-primary">
          Manage Categories
        </Link>
      </div>
      <h2 className="text-2xl font-semibold mb-4 text-neutral-content">Recent Orders</h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full bg-neutral">
          <thead>
            <tr>
              <th className="text-neutral-content">ID</th>
              <th className="text-neutral-content">Product</th>
              <th className="text-neutral-content">Customer</th>
              <th className="text-neutral-content">Status</th>
              <th className="text-neutral-content">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <Image
                      src={`${order.product.imageUrl}?w=50&h=50&c=fill&q=80`}
                      alt={order.product.name}
                      width={50}
                      height={50}
                      className="object-cover rounded"
                    />
                    {order.product.name}
                  </div>
                </td>
                <td>{order.customerDetails}</td>
                <td>
                  <span className={`badge ${order.status === 'Pending' ? 'badge-warning' : 'badge-success'}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm btn-outline btn-primary">Update Status</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}