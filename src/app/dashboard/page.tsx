"use client";

import { useState, useEffect, Suspense } from "react";
import { User, Package, MapPin, Heart, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSocket } from "@/components/providers/SocketProvider";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams?.get("tab") || "orders");
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const { socket } = useSocket();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/dashboard");
    }
  }, [status, router]);

  useEffect(() => {
    const tab = searchParams?.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

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
    
    const handleOrderStatus = () => {
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
    { id: "orders", label: "Orders", icon: Package },
    { id: "profile", label: "Profile", icon: User },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "addresses", label: "Addresses", icon: MapPin },
  ];

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
    processing: "bg-blue-500/10 border-blue-500/30 text-blue-400",
    shipped: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400",
    delivered: "bg-green-500/10 border-green-500/30 text-green-400",
    cancelled: "bg-red-500/10 border-red-500/30 text-red-400",
  };

  return (
    <div className="min-h-screen bg-black text-white pt-10 px-4 md:px-8 pb-32">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <div className="lg:w-64 shrink-0">
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 sticky top-24">
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-neutral-800">
                <div className="w-14 h-14 rounded-full bg-neutral-800 flex items-center justify-center text-xl font-bold">
                  {session?.user?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <div className="font-medium">{session?.user?.name}</div>
                  <div className="text-sm text-neutral-500">{session?.user?.email}</div>
                </div>
              </div>

              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                        activeTab === tab.id
                          ? "bg-white text-black font-semibold"
                          : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
                <button 
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === "orders" && (
              <div>
                <h1 className="text-3xl font-black uppercase tracking-widest mb-8">My Orders</h1>
                
                {loadingOrders ? (
                  <div className="text-center py-12 text-neutral-500">Loading orders...</div>
                ) : orders.length === 0 ? (
                  <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-12 text-center">
                    <Package className="w-16 h-16 mx-auto text-neutral-800 mb-4" />
                    <h3 className="text-xl font-medium mb-2">No Orders Yet</h3>
                    <p className="text-neutral-500 mb-6">Start shopping to see your orders here.</p>
                    <Link href="/shop">
                      <Button variant="luxury">Browse Products</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order._id} className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
                        <div className="flex flex-wrap justify-between items-start gap-4 mb-4 pb-4 border-b border-neutral-800">
                          <div>
                            <div className="text-sm text-neutral-500 mb-1">Order Number</div>
                            <div className="font-mono font-medium">
                              {order.orderNumber || order._id.toString().slice(-8).toUpperCase()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-neutral-500 mb-1">Date</div>
                            <div className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-neutral-500 mb-1">Status</div>
                            <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border ${statusColors[order.status] || 'bg-neutral-800 text-neutral-400'}`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-neutral-500 mb-1">Total</div>
                            <div className="text-lg font-medium">{formatPrice(order.totalPrice)}</div>
                          </div>
                        </div>

                        <div className="flex gap-4 overflow-x-auto pb-2">
                          {order.orderItems?.slice(0, 4).map((item: any, idx: number) => (
                            <div key={idx} className="w-20 h-20 shrink-0 bg-neutral-800 rounded-lg overflow-hidden relative">
                              {item.image ? (
                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-neutral-600">
                                  <Package className="w-8 h-8" />
                                </div>
                              )}
                            </div>
                          ))}
                          {order.orderItems?.length > 4 && (
                            <div className="w-20 h-20 shrink-0 bg-neutral-800 rounded-lg flex items-center justify-center text-neutral-500 text-sm">
                              +{order.orderItems.length - 4}
                            </div>
                          )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-neutral-800 flex justify-between items-center">
                          <div className="text-sm text-neutral-500">
                            {order.shippingAddress?.city}, {order.shippingAddress?.country}
                          </div>
                          <div className="text-sm text-neutral-400">
                            {order.orderItems?.length} item{order.orderItems?.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "profile" && (
              <div>
                <h1 className="text-3xl font-black uppercase tracking-widest mb-8">My Profile</h1>
                
                <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-8">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-24 h-24 rounded-full bg-neutral-800 flex items-center justify-center text-3xl font-bold">
                      {session?.user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <h2 className="text-2xl font-medium">{session?.user?.name}</h2>
                      <p className="text-neutral-500">{session?.user?.email}</p>
                      <span className="inline-block mt-2 px-3 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs rounded-full uppercase tracking-wider">
                        {(session?.user as any)?.role || 'user'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-6 max-w-lg">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Full Name</label>
                      <input type="text" defaultValue={session?.user?.name || ""} className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neutral-500" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Email Address</label>
                      <input type="email" defaultValue={session?.user?.email || ""} disabled className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-500 cursor-not-allowed" />
                    </div>
                  </div>

                  <div className="mt-8">
                    <Button variant="luxury" className="px-8">Save Changes</Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "wishlist" && (
              <div>
                <h1 className="text-3xl font-black uppercase tracking-widest mb-8">My Wishlist</h1>
                
                <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-12 text-center">
                  <Heart className="w-16 h-16 mx-auto text-neutral-800 mb-4" />
                  <h3 className="text-xl font-medium mb-2">Your Wishlist is Empty</h3>
                  <p className="text-neutral-500 mb-6">Save items you love by clicking the heart icon on products.</p>
                  <Link href="/shop">
                    <Button variant="luxury">Browse Products</Button>
                  </Link>
                </div>
              </div>
            )}

            {activeTab === "addresses" && (
              <div>
                <h1 className="text-3xl font-black uppercase tracking-widest mb-8">My Addresses</h1>
                
                <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-12 text-center">
                  <MapPin className="w-16 h-16 mx-auto text-neutral-800 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Saved Addresses</h3>
                  <p className="text-neutral-500 mb-6">Add an address for faster checkout.</p>
                  <Button variant="luxury">Add New Address</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UserDashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white"></div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
