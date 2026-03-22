"use client";

import { motion } from "framer-motion";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState } from "react";

export default function OrderSuccessPage() {
  const clearCart = useCartStore((state) => state.clearCart);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  useEffect(() => {
    const storedOrder = sessionStorage.getItem('lastOrder');
    if (storedOrder) {
      try {
        const order = JSON.parse(storedOrder);
        setOrderNumber(order.orderNumber || order._id?.toString().slice(-8).toUpperCase() || 'Unknown');
      } catch {
        setOrderNumber('Unknown');
      }
    }
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="z-10 text-center max-w-xl mx-auto"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle className="w-12 h-12 text-emerald-400" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-4xl md:text-5xl font-black uppercase tracking-widest mb-6"
        >
          Order Confirmed
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-neutral-400 text-lg mb-4 font-light"
        >
          Thank you for your purchase. Your order has been placed successfully.
        </motion.p>

        {orderNumber && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 mb-8 inline-block"
          >
            <div className="text-xs uppercase tracking-widest text-neutral-500 mb-1">Order Number</div>
            <div className="text-xl font-mono font-bold text-emerald-400">{orderNumber}</div>
          </motion.div>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-neutral-600 text-sm mb-12"
        >
          A confirmation email has been sent. You may track your order from the dashboard.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/dashboard?tab=orders">
            <Button variant="luxury" size="lg" className="px-8 gap-2 tracking-widest uppercase">
              <Package className="w-5 h-5" /> Track Order
            </Button>
          </Link>
          <Link href="/shop">
            <Button variant="outline" size="lg" className="px-8 gap-2 border-neutral-700 tracking-widest uppercase hover:bg-white hover:text-black">
              Continue Shopping <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
