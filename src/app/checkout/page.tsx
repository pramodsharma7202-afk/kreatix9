"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Lock, CreditCard, ChevronRight } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSocket } from "@/components/providers/SocketProvider";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const { socket } = useSocket();

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    country: "",
    zipCode: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    if (status !== "authenticated") {
      router.push("/login?callbackUrl=/checkout");
      return;
    }

    setLoading(true);
    
    try {
      const payload = {
        orderItems: items.map(i => ({
          product: i.id,
          name: i.name,
          qty: i.qty,
          price: i.price,
          image: i.image
        })),
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          country: formData.country,
          postalCode: formData.zipCode
        },
        paymentMethod: "Stripe",
        itemsPrice: totalPrice,
        taxPrice: 0,
        shippingPrice: 0,
        totalPrice: totalPrice,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create order");
      
      const newOrder = await res.json();
      if (socket) socket.emit("order:new", newOrder);
      
      clearCart();
      router.push("/order-success");
      
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white pt-32 text-center">
        <h1 className="text-3xl font-light mb-6 uppercase tracking-widest">Cart is Empty</h1>
        <Link href="/shop">
          <Button variant="outline" className="text-white border-neutral-700 hover:bg-white hover:text-black">
            Return to Shop
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-10 px-4 md:px-8 pb-32">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center gap-2 text-sm text-neutral-500 uppercase tracking-widest mb-12">
          <Link href="/cart" className="hover:text-white transition-colors">Cart</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white">Checkout</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Shipping Form */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-2xl font-black uppercase tracking-widest mb-8 pb-4 border-b border-neutral-800 text-white">
              Shipping & Payment
            </h2>
            
            <form onSubmit={handleCheckout} className="space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-4">Contact Information</h3>
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={session?.user?.email || "Email Address"} 
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 focus:outline-none focus:border-neutral-500 transition-colors text-white placeholder:text-neutral-600"
                />
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-4">Shipping Address</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input 
                    type="text" 
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First Name" 
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 focus:outline-none focus:border-neutral-500 transition-colors text-white placeholder:text-neutral-600"
                  />
                  <input 
                    type="text" 
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name" 
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 focus:outline-none focus:border-neutral-500 transition-colors text-white placeholder:text-neutral-600"
                  />
                </div>
                <input 
                  type="text" 
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Address" 
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-neutral-500 transition-colors text-white placeholder:text-neutral-600"
                />
                <div className="grid grid-cols-3 gap-4">
                  <input 
                    type="text" 
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City" 
                    className="col-span-1 border border-neutral-800 bg-neutral-900 rounded-lg px-4 py-3 focus:outline-none focus:border-neutral-500 transition-colors text-white placeholder:text-neutral-600"
                  />
                  <input 
                    type="text" 
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Country" 
                    className="col-span-1 border border-neutral-800 bg-neutral-900 rounded-lg px-4 py-3 focus:outline-none focus:border-neutral-500 transition-colors text-white placeholder:text-neutral-600"
                  />
                  <input 
                    type="text" 
                    name="zipCode"
                    required
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="Zip Code" 
                    className="col-span-1 border border-neutral-800 bg-neutral-900 rounded-lg px-4 py-3 focus:outline-none focus:border-neutral-500 transition-colors text-white placeholder:text-neutral-600"
                  />
                </div>
              </div>

              <div className="pt-8">
                <Button 
                  type="submit" 
                  variant="luxury" 
                  size="lg" 
                  className="w-full h-14 uppercase tracking-widest gap-3"
                  disabled={loading}
                >
                  {loading ? (
                    "Processing..."
                  ) : (
                    <>Pay Securely <CreditCard className="w-5 h-5 ml-2" /></>
                  )}
                </Button>
                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-neutral-500">
                  <Lock className="w-3 h-3" /> 256-bit Secure Encryption
                </div>
              </div>
            </form>
          </motion.div>

          {/* Order Summary */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-8 h-fit"
          >
            <h2 className="text-xl font-bold uppercase tracking-widest mb-8 border-b border-neutral-800 pb-4 text-white">
              Order Summary
            </h2>
            
            <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 hide-scrollbar">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-24 bg-neutral-800 rounded-lg overflow-hidden shrink-0 relative border border-neutral-700">
                    <Image src={item.image} alt={item.name} fill className="w-full h-full object-cover opacity-80" />
                    <div className="absolute top-0 right-0 bg-black/80 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-bl-lg font-bold">
                      {item.qty}
                    </div>
                  </div>
                  <div className="flex flex-col justify-center flex-1">
                    <h3 className="text-sm font-medium tracking-wide mb-1 text-white">{item.name}</h3>
                    <div className="text-neutral-400 text-sm font-light">{formatPrice(item.price)}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 mb-8 text-sm border-t border-neutral-800 pt-6">
              <div className="flex justify-between text-neutral-400">
                <span>Subtotal</span>
                <span className="text-white">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Shipping</span>
                <span className="text-white">Complimentary</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Taxes</span>
                <span className="text-white">{formatPrice(0)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-2xl font-light pt-6 border-t border-neutral-800 text-white">
              <span className="uppercase tracking-widest text-sm font-bold">Total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
