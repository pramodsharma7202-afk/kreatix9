"use client";

import { Activity, DollarSign, Users, Package, ShoppingBag, TrendingUp, AlertTriangle, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSocket } from "@/components/providers/SocketProvider";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";

type StatsData = {
  metrics: {
    totalRevenue: number;
    totalOrders: number;
    totalUsers: number;
    totalProducts: number;
    paidOrders: number;
    pendingOrders: number;
    avgOrderValue: number;
  };
  recentOrders: any[];
  lowStockProducts: any[];
  topProducts: any[];
  recentUsers: any[];
};

export default function AdminDashboardPage() {
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { socket, isConnected } = useSocket();

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setStatsData(data);
      }
    } catch (error) {
      console.error("Failed to fetch admin stats", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (!socket) return;
    
    const handleUpdate = () => {
      fetchStats();
    };

    socket.on("product:new", handleUpdate);
    socket.on("order:new", handleUpdate);
    socket.on("order:status", handleUpdate);
    socket.on("user:new", handleUpdate);
    socket.on("product:update", handleUpdate);

    return () => {
      socket.off("product:new", handleUpdate);
      socket.off("order:new", handleUpdate);
      socket.off("order:status", handleUpdate);
      socket.off("user:new", handleUpdate);
      socket.off("product:update", handleUpdate);
    };
  }, [socket]);

  if (loading || !statsData) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500"></div>
          <p className="text-neutral-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const { metrics, recentOrders, lowStockProducts, recentUsers } = statsData;

  const statCards = [
    { title: "Total Revenue", value: formatPrice(metrics.totalRevenue), icon: DollarSign, change: "+12% from last month", color: "emerald" },
    { title: "Total Orders", value: metrics.totalOrders.toString(), icon: ShoppingBag, change: `${metrics.pendingOrders} pending`, color: "blue" },
    { title: "Total Users", value: metrics.totalUsers.toString(), icon: Users, change: "Active customers", color: "purple" },
    { title: "Total Products", value: metrics.totalProducts.toString(), icon: Package, change: "In catalog", color: "amber" },
  ];

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
    processing: "bg-blue-500/10 border-blue-500/30 text-blue-400",
    shipped: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400",
    delivered: "bg-green-500/10 border-green-500/30 text-green-400",
    cancelled: "bg-red-500/10 border-red-500/30 text-red-400",
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-widest mb-2 flex items-center gap-4">
              Admin Dashboard 
              <span className="relative flex h-3 w-3">
                {isConnected ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </>
                ) : (
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                )}
              </span>
            </h1>
            <p className="text-neutral-400 text-sm">Manage your store metrics and operations in real-time.</p>
          </div>
          <Link href="/" className="px-6 py-2 bg-neutral-900 border border-neutral-800 rounded flex items-center gap-2 hover:bg-neutral-800 transition-colors text-sm uppercase tracking-wide">
            View Store <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statCards.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-xl hover:border-neutral-700 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs uppercase tracking-widest font-bold text-neutral-400">{stat.title}</span>
                <stat.icon className={`w-5 h-5 ${
                  stat.color === 'emerald' ? 'text-emerald-400' :
                  stat.color === 'blue' ? 'text-blue-400' :
                  stat.color === 'purple' ? 'text-purple-400' : 'text-amber-400'
                }`} />
              </div>
              <div className="text-3xl font-light mb-2">{stat.value}</div>
              <div className="text-xs text-neutral-500">{stat.change}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sales Overview */}
          <div className="lg:col-span-2 bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-400">Sales Overview</h2>
              <Link href="/admin/analytics" className="text-xs text-emerald-400 hover:text-emerald-300">View Analytics</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-neutral-800/50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <div className="text-2xl font-bold">{formatPrice(metrics.avgOrderValue)}</div>
                <div className="text-xs text-neutral-500 mt-1">Avg Order Value</div>
              </div>
              <div className="text-center p-4 bg-neutral-800/50 rounded-lg">
                <ShoppingBag className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold">{metrics.paidOrders}</div>
                <div className="text-xs text-neutral-500 mt-1">Completed Orders</div>
              </div>
              <div className="text-center p-4 bg-neutral-800/50 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                <div className="text-2xl font-bold">{metrics.pendingOrders}</div>
                <div className="text-xs text-neutral-500 mt-1">Pending Orders</div>
              </div>
              <div className="text-center p-4 bg-neutral-800/50 rounded-lg">
                <Activity className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold">{formatPrice(metrics.totalRevenue / (metrics.totalOrders || 1))}</div>
                <div className="text-xs text-neutral-500 mt-1">Revenue/Order</div>
              </div>
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-6 flex items-center justify-between">
              Low Stock Alert
              <Link href="/admin/products" className="text-xs text-emerald-400 hover:text-emerald-300">View All</Link>
            </h2>
            <div className="space-y-4">
              {lowStockProducts.length === 0 ? (
                <p className="text-sm text-neutral-500 py-4 text-center">All products are well stocked!</p>
              ) : (
                lowStockProducts.map((product) => (
                  <div key={product._id} className="flex items-center justify-between py-2 border-b border-neutral-800/50 last:border-0">
                    <div>
                      <div className="text-sm font-medium">{product.name}</div>
                      <div className="text-xs text-neutral-500">Stock: {product.stock}</div>
                    </div>
                    <span className="text-amber-400 text-sm font-bold">Low</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Recent Orders */}
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-6 flex items-center justify-between">
              Recent Orders
              <Link href="/admin/orders" className="text-xs text-emerald-400 hover:text-emerald-300">View All</Link>
            </h2>
            <div className="space-y-4">
              {recentOrders.length === 0 ? (
                <p className="text-sm text-neutral-500 py-8 text-center">No orders yet</p>
              ) : (
                recentOrders.slice(0, 5).map((order) => (
                  <div key={order._id} className="flex justify-between items-center py-3 border-b border-neutral-800/50 last:border-0">
                    <div>
                      <div className="text-sm font-medium">{order.customer}</div>
                      <div className="text-xs text-neutral-500 mt-1">{order.email || 'Guest'}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{formatPrice(order.total)}</div>
                      <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${statusColors[order.status] || 'bg-neutral-800 text-neutral-400'}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-6 flex items-center justify-between">
              Recent Users
              <Link href="/admin/users" className="text-xs text-emerald-400 hover:text-emerald-300">View All</Link>
            </h2>
            <div className="space-y-4">
              {recentUsers.length === 0 ? (
                <p className="text-sm text-neutral-500 py-8 text-center">No users registered</p>
              ) : (
                recentUsers.map((user) => (
                  <div key={user._id} className="flex items-center gap-4 py-3 border-b border-neutral-800/50 last:border-0">
                    <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-sm font-bold">
                      {user.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{user.name}</div>
                      <div className="text-xs text-neutral-500">{user.email}</div>
                    </div>
                    <div className="text-xs text-neutral-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
