"use client";

import { Activity, CreditCard, DollarSign, Users, Package, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSocket } from "@/components/providers/SocketProvider";

type StatsData = {
  metrics: {
    totalRevenue: string;
    activeUsers: string;
    salesCount: string;
    activeProducts: string;
  };
  recentOrders: {
    id: string;
    customer: string;
    total: string;
    status: string;
    date: string;
  }[];
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

    return () => {
      socket.off("product:new", handleUpdate);
      socket.off("order:new", handleUpdate);
      socket.off("order:status", handleUpdate);
      socket.off("user:new", handleUpdate);
    };
  }, [socket]);

  if (loading || !statsData) {
    return <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">Loading Admin Data...</div>;
  }

  const { metrics, recentOrders } = statsData;

  const statCards = [
    { title: "Total Revenue", value: metrics.totalRevenue, icon: DollarSign, change: "Live Updates Enabled" },
    { title: "Active Users", value: metrics.activeUsers, icon: Users, change: "Live Updates Enabled" },
    { title: "Total Orders", value: metrics.salesCount, icon: CreditCard, change: "Live Updates Enabled" },
    { title: "Active Products", value: metrics.activeProducts, icon: Package, change: "Live Updates Enabled" },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-widest mb-2 flex items-center gap-4">
              Admin Control 
              {isConnected ? (
                <span className="flex h-3 w-3"><span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span></span>
              ) : (
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              )}
            </h1>
            <p className="text-neutral-400 text-sm">Manage your empire's metrics and operations in real-time.</p>
          </div>
          <Link href="/" className="px-6 py-2 bg-neutral-900 border border-neutral-800 rounded flex items-center gap-2 hover:bg-neutral-800 transition-colors text-sm uppercase tracking-wide">
            View Store <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statCards.map((stat, i) => (
            <div key={i} className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-xl">
              <div className="flex justify-between items-start mb-4 text-neutral-400">
                <span className="text-xs uppercase tracking-widest font-bold">{stat.title}</span>
                <stat.icon className="w-5 h-5 text-neutral-500" />
              </div>
              <div className="text-3xl font-light mb-2">{stat.value}</div>
              <div className="text-xs text-neutral-500 text-emerald-500/80">{stat.change}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart Placeholder */}
          <div className="lg:col-span-2 bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-6">Revenue Analytics</h2>
            <div className="h-[300px] w-full bg-neutral-900/80 rounded-lg flex items-center justify-center border border-neutral-800/50">
              <Activity className="w-10 h-10 text-neutral-700 mb-4" />
              <div className="text-neutral-600 text-sm uppercase tracking-widest ml-4">Chart Data Syncing via Sockets...</div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-6 flex items-center justify-between">
              Recent Transactions
              <Link href="/admin/orders" className="text-xs text-emerald-400 hover:text-emerald-300">View All</Link>
            </h2>
            <div className="space-y-6">
              {recentOrders.length === 0 ? (
                <div className="text-sm text-neutral-500 py-4 text-center">No orders found</div>
              ) : recentOrders.map((order, i) => (
                <div key={i} className="flex justify-between items-center border-b border-neutral-800/50 pb-4 last:border-0 last:pb-0">
                  <div>
                    <div className="text-sm font-medium">{order.customer}</div>
                    <div className="text-xs text-neutral-500 mt-1">{order.id.substring(0,8)}... &bull; {order.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-light text-white">{order.total}</div>
                    <div className={`text-[10px] uppercase tracking-wider mt-1 font-bold ${
                      order.status.toLowerCase() === 'delivered' ? 'text-green-500' :
                      order.status.toLowerCase() === 'processing' ? 'text-blue-500' :
                      order.status.toLowerCase() === 'pending' ? 'text-yellow-500' : 'text-neutral-400'
                    }`}>
                      {order.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
