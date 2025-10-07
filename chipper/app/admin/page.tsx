'use client';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// Import Lucide Icons for better UI/UX
import { Boxes, ChevronRight, LayoutDashboard, ListOrdered, ShoppingBag } from "lucide-react"; // Removed AlertTriangle

import { fetchOrders } from "../../lib/api";
import { disconnectSocket, initSocket } from "../../lib/socket";
import { Order } from "../../lib/types";

// Helper function to mock status for visual enhancement
// NOTE: You should map this to actual order statuses in a real backend.
const getOrderStatus = (orderId: number) => {
    // Simple logic based on ID for visual diversity
    if (orderId % 3 === 0) return { label: 'Completed', color: 'badge-success' };
    if (orderId % 3 === 1) return { label: 'Processing', color: 'badge-warning' };
    return { label: 'Shipped', color: 'badge-info' };
};

export default function AdminDashboard() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/admin/login");
            return;
        }

        const socket = initSocket();
        socket.on("connect", () => setIsSocketConnected(true));
        socket.on("disconnect", () => setIsSocketConnected(false));
        
        socket.on("new-order", (order: Order) => {
            console.log("New order received via socket:", order.id);
            // Prepending new order for real-time visibility
            setOrders((prev) => [order, ...prev]);
        });
        
        socket.on(
            "stock-update",
            ({ productId, stock }: { productId: number; stock: number }) => {
                console.log(`Product ${productId} stock updated to ${stock}`);
            }
        );

        // Fetch initial orders
        fetchOrders(token)
            .then(setOrders)
            .catch(() => router.push("/admin/login"));

        return () => {
            disconnectSocket();
        };
    }, [router]);

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 min-h-screen bg-base-100">
            
            {/* Header and Socket Status */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 border-b pb-4 border-base-200">
                <div className="flex items-center gap-3 mb-4 sm:mb-0">
                    <LayoutDashboard size={40} className="text-warning" /> {/* Using warning/amber as primary accent */}
                    <h1 className="text-4xl md:text-5xl font-black text-neutral-content">
                        Admin Dashboard
                    </h1>
                </div>
                {/* Live Socket Status Badge */}
                <div className={`badge badge-lg ${isSocketConnected ? 'badge-success' : 'badge-error'} text-white font-semibold shadow-md`}>
                    {isSocketConnected ? 'Live Feed Active' : 'Offline'}
                </div>
            </header>

            {/* Quick Management Section (Now full width) */}
            <section className="space-y-8 mb-12">
                
                <h2 className="text-2xl font-bold text-neutral-content border-b border-base-200 pb-2">Quick Management</h2>

                {/* Quick Action Cards - Adjusted to a 3-column grid for spacious layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Manage Products Card (Amber accent) */}
                    <Link
                        href="/admin/products"
                        className="card bg-base-200 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-6 rounded-2xl border-l-4 border-amber-500 flex items-center justify-between group"
                    >
                        <div>
                            <ShoppingBag size={36} className="text-amber-500 mb-2" />
                            <h3 className="text-2xl font-bold text-neutral-content group-hover:text-amber-600 transition">Manage Products</h3>
                            <p className="text-sm text-neutral-content/70 mt-1">
                                Add, edit, and update your product catalog.
                            </p>
                        </div>
                        <ChevronRight size={28} className="text-amber-500 group-hover:translate-x-1 transition duration-200" />
                    </Link>
                    
                    {/* Manage Categories Card (Green accent) */}
                    <Link
                        href="/admin/categories"
                        className="card bg-base-200 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-6 rounded-2xl border-l-4 border-green-600 flex items-center justify-between group"
                    >
                        <div>
                            <Boxes size={36} className="text-green-600 mb-2" />
                            <h3 className="text-2xl font-bold text-neutral-content group-hover:text-green-700 transition">Manage Categories</h3>
                            <p className="text-sm text-neutral-content/70 mt-1">
                                Organize products by creating and editing categories.
                            </p>
                        </div>
                        <ChevronRight size={28} className="text-green-600 group-hover:translate-x-1 transition duration-200" />
                    </Link>
                    
                    {/* Placeholder for a third action card */}
                    <Link
                        href="/admin/reports" // Placeholder link
                        className="card bg-base-200 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-6 rounded-2xl border-l-4 border-info flex items-center justify-between group"
                    >
                        <div>
                            <LayoutDashboard size={36} className="text-info mb-2" />
                            <h3 className="text-2xl font-bold text-neutral-content group-hover:text-info-content transition">View Reports</h3>
                            <p className="text-sm text-neutral-content/70 mt-1">
                                Access sales data and customer reports (Placeholder).
                            </p>
                        </div>
                        <ChevronRight size={28} className="text-info group-hover:translate-x-1 transition duration-200" />
                    </Link>
                </div>
            </section>

            {/* Recent Orders Section (Full Width) */}
            <section className="mt-12">
                <div className="card bg-base-200 shadow-2xl rounded-2xl p-4 md:p-6">
                    <div className="flex items-center justify-between mb-6 border-b pb-4 border-base-300">
                        <h2 className="text-2xl md:text-3xl font-bold text-neutral-content flex items-center gap-3">
                            <ListOrdered size={28} className="text-warning"/> Real-Time Orders
                        </h2>
                        <span className="badge badge-lg badge-warning text-white font-bold shadow-md">
                            {orders.length} Orders
                        </span>
                    </div>

                    {orders.length === 0 ? (
                        <div className="text-neutral-content text-center py-10 bg-base-100 rounded-xl border border-dashed border-base-300">
                            <p className="text-lg">
                                No recent orders yet. Real-time feed is active!
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                {/* Table Header */}
                                <thead>
                                    <tr className="bg-base-300/80">
                                        <th className="text-neutral-content font-bold text-sm rounded-tl-xl">Order ID</th>
                                        <th className="text-neutral-content font-bold text-sm">Product</th>
                                        <th className="text-neutral-content font-bold text-sm">Status</th>
                                        <th className="text-neutral-content font-bold text-sm rounded-tr-xl">Date/Time</th>
                                    </tr>
                                </thead>
                                {/* Table Body */}
                                <tbody>
                                    {orders.map((order) => {
                                        const status = getOrderStatus(order.id);
                                        return (
                                            <tr key={order.id} className="hover:bg-base-300/50 transition">
                                                <td className="font-extrabold text-lg text-warning">#{order.id}</td>
                                                <td>
                                                    <div className="flex items-center gap-3">
                                                        <Image
                                                            // Note: using 'imageUrl' which was inferred from ProductCard context
                                                            src={order.product.imageUrl || `https://placehold.co/60x60/f0f0f0/666666?text=No+Img`} 
                                                            alt={order.product.name}
                                                            width={60}
                                                            height={60}
                                                            className="object-cover rounded-xl border border-base-300 flex-shrink-0"
                                                        />
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold text-neutral-content">{order.product.name}</span>
                                                            <span className="text-sm text-neutral-content/70">KSh {order.product.price.toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`badge ${status.color} text-white font-medium shadow-sm`}>
                                                        {status.label}
                                                    </span>
                                                </td>
                                                <td className="text-neutral-content text-sm">
                                                    {new Date(order.createdAt).toLocaleDateString("en-GB", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
