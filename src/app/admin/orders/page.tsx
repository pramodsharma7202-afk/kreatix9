"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Edit, Eye } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { useSocket } from "@/components/providers/SocketProvider";

const STATUS_COLORS: Record<string, string> = {
  delivered: "bg-green-500/10 border-green-500/30 text-green-400",
  processing: "bg-blue-500/10 border-blue-500/30 text-blue-400",
  shipped: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400",
  pending: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
  cancelled: "bg-red-500/10 border-red-500/30 text-red-400",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { socket } = useSocket();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (!socket) return;
    
    const handleUpdate = () => {
      fetchOrders();
    };

    socket.on("order:new", handleUpdate);
    // don't really need order:status because admin triggers it, but just in case another admin changes it
    socket.on("order:status", handleUpdate);

    return () => {
      socket.off("order:new", handleUpdate);
      socket.off("order:status", handleUpdate);
    };
  }, [socket]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status: newStatus } : o));
        if (socket) {
          socket.emit("order:status", { orderId, status: newStatus });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = orders.filter((o) => {
    const customerName = o.user?.name || "Guest";
    const matchesSearch = customerName.toLowerCase().includes(search.toLowerCase()) || o._id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || o.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <Link href="/admin" className="text-xs text-neutral-500 uppercase tracking-widest hover:text-white mb-2 flex items-center gap-1">← Admin</Link>
            <h1 className="text-3xl font-black uppercase tracking-widest">Order Management</h1>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-neutral-600 text-white placeholder:text-neutral-600"
            />
          </div>
          {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-lg text-xs uppercase tracking-widest border transition-all ${
                statusFilter === s ? "bg-white text-black border-white" : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 text-xs uppercase tracking-widest">
                <th className="py-4 px-6 text-left">Order ID</th>
                <th className="py-4 px-6 text-left">Customer</th>
                <th className="py-4 px-6 text-left">Items</th>
                <th className="py-4 px-6 text-left">Total</th>
                <th className="py-4 px-6 text-left">Status</th>
                <th className="py-4 px-6 text-left">Date</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-neutral-500">Loading Orders...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center text-neutral-600 text-sm">No orders match your filter.</td>
                </tr>
              ) : filtered.map((order, i) => (
                <motion.tr
                  key={order._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-neutral-800/60 hover:bg-neutral-800/20 transition-colors"
                >
                  <td className="py-4 px-6 font-mono text-xs text-neutral-300">{order._id.substring(0,8)}...</td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-white">{order.user?.name || "Guest"}</div>
                    <div className="text-neutral-500 text-xs">{order.user?.email || "No email"}</div>
                  </td>
                  <td className="py-4 px-6 text-neutral-400">{order.orderItems?.length || 0}</td>
                  <td className="py-4 px-6 text-white">{formatPrice(order.totalPrice || 0)}</td>
                  <td className="py-4 px-6">
                    <select
                      value={order.status.toLowerCase()}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border appearance-none cursor-pointer focus:outline-none ${STATUS_COLORS[order.status.toLowerCase()] || 'bg-neutral-800 text-white'}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-4 px-6 text-neutral-500 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-3">
                      <button className="text-neutral-500 hover:text-white p-1.5 hover:bg-neutral-800 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
