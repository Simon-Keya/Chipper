"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchOrders } from "../../lib/api";
import { disconnectSocket, initSocket } from "../../lib/socket";
import { Order } from "../../lib/types";

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    const socket = initSocket();
    socket.on("new-order", (order: Order) => {
      setOrders((prev) => [order, ...prev]);
    });
    socket.on(
      "stock-update",
      ({ productId, stock }: { productId: number; stock: number }) => {
        console.log(`Product ${productId} stock updated to ${stock}`);
      }
    );

    fetchOrders(token).then(setOrders).catch(() => router.push("/admin/login"));

    return () => {
      disconnectSocket();
    };
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Page Title */}
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-base text-neutral-content">
          Manage your store products, categories, and monitor new orders in real-time.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        <Link
          href="/admin/products"
          className="card bg-base-200 border border-base-300 shadow-md hover:shadow-lg p-6 rounded-2xl transition"
        >
          <h3 className="text-xl font-semibold text-primary mb-2">📦 Manage Products</h3>
          <p className="text-sm text-neutral-content">
            Add, edit, and organize your product catalog.
          </p>
        </Link>
        <Link
          href="/admin/categories"
          className="card bg-base-200 border border-base-300 shadow-md hover:shadow-lg p-6 rounded-2xl transition"
        >
          <h3 className="text-xl font-semibold text-primary mb-2">🗂 Manage Categories</h3>
          <p className="text-sm text-neutral-content">
            Create and update product categories for better organization.
          </p>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="card bg-base-200 border border-base-300 shadow-md rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-primary">Recent Orders</h2>
          <span className="badge badge-primary badge-outline">
            {orders.length} Orders
          </span>
        </div>

        {orders.length === 0 ? (
          <p className="text-neutral-content text-center py-6">
            No recent orders yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr className="bg-base-300">
                  <th className="text-neutral font-semibold">Order ID</th>
                  <th className="text-neutral font-semibold">Product</th>
                  <th className="text-neutral font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-base-100">
                    <td className="font-semibold text-primary">#{order.id}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <Image
                          src={`${order.product.image}?w=50&h=50&c=fill&q=80`}
                          alt={order.product.name}
                          width={50}
                          height={50}
                          className="object-cover rounded-xl border border-base-300"
                        />
                        <span className="font-medium">{order.product.name}</span>
                      </div>
                    </td>
                    <td className="text-neutral-content">
                      {new Date(order.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
