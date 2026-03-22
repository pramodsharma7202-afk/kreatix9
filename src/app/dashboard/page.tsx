"use client";

import { useState, useEffect } from "react";
import { User, Package, MapPin, Heart, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSocket } from "@/components/providers/SocketProvider";

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const { socket } = useSocket();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchOrders();
    }
  }, [status]);

  useEffect(() => {
    if (!socket || status !== "authenticated") return;
    
    const handleOrderStatus = (updatedOrder: any) => {
      // Refresh orders if socket says there's a status update
      // Only refresh if order belongs to user or refresh all
      fetchOrders();
    };

    socket.on("order:status", handleOrderStatus);
    return () => {
      socket.off("order:status", handleOrderStatus);
    };
  }, [socket, status]);

  if (status === "loading" || status === "unauthenticated") {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  }

  const tabs = [
    { id: "profile", label: "Profile Details", icon: User },
    { id: "orders", label: "Order History", icon: Package },
    { id: "addresses", label: "Saved Addresses", icon: MapPin },
    { id: "wishlist", label: "Wishlist", icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-10 px-4 md:px-8 pb-32">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-[0.1em] mb-12 drop-shadow-lg border-b border-neutral-800 pb-8 text-white">
          My Account
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Sidebar */}
          <div className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-lg text-sm tracking-widest uppercase transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-neutral-900 border border-neutral-700 text-white origin-left scale-105"
                      : "text-neutral-500 hover:text-white hover:bg-neutral-900/50"
                  }`}
                >
                  <Icon className="w-5 h-5" /> {tab.label}
                </button>
              );
            })}
            
            <button 
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full flex items-center gap-4 px-6 py-4 rounded-lg text-sm tracking-widest uppercase text-red-500 hover:bg-neutral-900/50 transition-colors mt-8"
            >
              <LogOut className="w-5 h-5" /> Sign Out
            </button>
          </div>

          {/* Content Area */}
          <div className="md:col-span-3 bg-neutral-900/30 border border-neutral-800 rounded-2xl p-8 min-h-[500px]">
            {activeTab === "profile" && (
              <div>
                <h2 className="text-xl font-bold uppercase tracking-widest mb-8 border-b border-neutral-800 pb-4">Personal Details</h2>
                <div className="space-y-6 max-w-lg">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Full Name</label>
                    <input type="text" defaultValue={session?.user?.name || ""} disabled className="w-full bg-black/50 border border-neutral-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neutral-500 text-neutral-400 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Email Address</label>
                    <input type="email" defaultValue={session?.user?.email || ""} disabled className="w-full bg-black/50 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-neutral-400 cursor-not-allowed" />
                    <p className="text-xs text-neutral-600 mt-2">Email changes require support verification.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div>
                <h2 className="text-xl font-bold uppercase tracking-widest mb-8 border-b border-neutral-800 pb-4">Order History</h2>
                {loadingOrders ? (
                  <div className="text-center py-10 text-neutral-500">Loading orders...</div>
                ) : orders.length === 0 ? (
                  <div className="text-neutral-500 text-sm py-10 text-center bg-black/40 rounded-lg border border-neutral-800">
                    <Package className="w-12 h-12 mx-auto mb-4 text-neutral-700" />
                    No previous orders found. Discover our collection to place your first order.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order, index) => (
                      <div key={index} className="flex justify-between items-center bg-black/30 p-5 rounded-xl border border-neutral-800">
                        <div>
                          <p className="text-sm font-bold tracking-wider uppercase mb-1">{order._id.substring(0,8)}...</p>
                          <p className="text-xs text-neutral-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium mb-1">${order.totalPrice.toFixed(2)}</p>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm ${
                            order.status.toLowerCase() === 'delivered' ? 'bg-green-900/40 text-green-400' :
                            order.status.toLowerCase() === 'processing' ? 'bg-blue-900/40 text-blue-400' :
                            order.status.toLowerCase() === 'pending' ? 'bg-yellow-900/40 text-yellow-500' : 'bg-neutral-800 text-neutral-400'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "addresses" && (
              <div>
                <h2 className="text-xl font-bold uppercase tracking-widest mb-8 border-b border-neutral-800 pb-4">Saved Addresses</h2>
                <Button variant="outline" className="border-neutral-700 hover:text-black hover:bg-white text-white">Add New Address +</Button>
              </div>
            )}

            {activeTab === "wishlist" && (
              <div>
                <h2 className="text-xl font-bold uppercase tracking-widest mb-8 border-b border-neutral-800 pb-4">Your Wishlist</h2>
                <div className="text-neutral-500 text-sm py-10 text-center bg-black/40 rounded-lg border border-neutral-800">
                  <Heart className="w-12 h-12 mx-auto mb-4 text-neutral-700" />
                  Your wishlist is empty.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
