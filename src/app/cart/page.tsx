"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();

  if (!items || items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-black text-white flex flex-col items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <ShoppingBag className="w-24 h-24 mx-auto text-neutral-800 mb-8" />
          <h1 className="text-3xl font-black uppercase tracking-widest mb-4">Your Cart is Empty</h1>
          <p className="text-neutral-500 mb-8 max-w-md mx-auto">
            Discover our curated collections to find your next statement piece.
          </p>
          <Link href="/shop">
            <Button variant="luxury" size="lg" className="px-10 tracking-widest uppercase">
              Explore Collection
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-10 px-4 md:px-8 pb-32">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-[0.1em] mb-12 drop-shadow-lg border-b border-neutral-900 pb-8">
          Your Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-8">
            {items.map((item, index) => (
              <motion.div 
                key={item.product}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col sm:flex-row gap-6 p-4 border border-neutral-800 bg-neutral-900/30 rounded-xl relative group"
              >
                <div className="w-full sm:w-40 aspect-square rounded-lg overflow-hidden bg-neutral-900 shrink-0 relative">
                  <Image src={item.image} alt={item.name} fill className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 flex flex-col justify-between py-2">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-xl font-medium tracking-wide">{item.name}</h3>
                    <button 
                      aria-label={`Remove ${item.name} from cart`}
                      onClick={() => removeItem(item.product)}
                      className="text-neutral-500 hover:text-white transition-colors p-2 -mr-2 -mt-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="text-xl font-light text-neutral-300 mb-6">
                    {formatPrice(item.price)}
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="flex items-center border border-neutral-700 rounded-lg bg-neutral-900/50 p-1 w-fit">
                      <button 
                        aria-label="Decrease quantity"
                        onClick={() => updateQuantity(item.product, Math.max(1, item.qty - 1))}
                        className="w-8 h-8 flex items-center justify-center text-lg hover:text-white text-neutral-400"
                      >-</button>
                      <span aria-label="Quantity" className="w-10 text-center text-sm">{item.qty}</span>
                      <button 
                        aria-label="Increase quantity"
                        onClick={() => updateQuantity(item.product, Math.min(item.stock, item.qty + 1))}
                        className="w-8 h-8 flex items-center justify-center text-lg hover:text-white text-neutral-400"
                      >+</button>
                    </div>
                    <div className="text-sm text-neutral-500 uppercase tracking-wider">
                      Item Total: <span className="text-white ml-2">{formatPrice(item.price * item.qty)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Checkout Summary */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-8 h-fit sticky top-28"
          >
            <h2 className="text-xl font-bold uppercase tracking-widest mb-8 border-b border-neutral-800 pb-4">
              Order Summary
            </h2>
            
            <div className="space-y-4 mb-8 text-sm">
              <div className="flex justify-between text-neutral-400">
                <span>Subtotal</span>
                <span className="text-white">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Complimentary Shipping</span>
                <span className="text-white">Included</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Estimated Tax</span>
                <span className="text-white">Calculated at checkout</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-xl font-light mb-10 pt-6 border-t border-neutral-800">
              <span className="uppercase tracking-widest text-sm font-bold">Total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>

            <Link href="/checkout" className="block w-full">
              <Button variant="luxury" size="lg" className="w-full text-sm tracking-widest uppercase h-14">
                Proceed to Checkout <ArrowRight className="w-4 h-4 ml-3" />
              </Button>
            </Link>
            
            <div className="mt-6 text-xs text-center text-neutral-500 max-w-[200px] mx-auto">
              Secure checkout. All transactions are encrypted.
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
