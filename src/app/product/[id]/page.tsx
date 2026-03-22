"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart, Star, ShieldCheck, Truck, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  // Mock product data for visual fidelity
  const product = {
    id: params.id,
    name: "Alpha Timepiece Chronograph",
    price: 5400,
    category: "Watches",
    description: "An exceptional masterpiece of horology. The Alpha Timepiece features a complex mechanical movement encased in brushed titanium, sapphire crystal face, and a hand-stitched alligator leather strap. Water resistant up to 100 meters.",
    images: [
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1200",
      "https://images.unsplash.com/photo-1549972300-84eaf1a073de?q=80&w=1200",
    ],
    stock: 10,
    rating: 4.9,
    reviews: 24,
    features: ["Precision Movement", "Titanium Case", "Sapphire Crystal", "Lifetime Warranty"],
  };

  const [mainImage, setMainImage] = useState(product.images[0]);

  return (
    <div className="min-h-screen bg-black text-white pt-10 px-4 md:px-8 pb-32">
      <div className="container mx-auto">
        <Link href="/shop" className="inline-flex items-center text-sm text-neutral-400 hover:text-white mb-10 transition-colors uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Collection
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-4"
          >
            <div className="aspect-square bg-neutral-900 rounded-xl overflow-hidden relative border border-neutral-800">
              <Image src={mainImage} alt={product.name} fill className="object-cover w-full h-full" />
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
              {product.images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setMainImage(img)}
                  className={`w-24 h-24 shrink-0 rounded-lg overflow-hidden border-2 transition-all relative ${mainImage === img ? 'border-white' : 'border-transparent opacity-50 hover:opacity-100'}`}
                >
                  <Image src={img} alt="" fill className="object-cover w-full h-full" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <div className="mb-2 uppercase tracking-widest text-sm text-neutral-500">{product.category}</div>
            <h1 className="text-4xl md:text-5xl font-black tracking-wide mb-6">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-8">
              <span className="text-3xl font-light text-white">{formatPrice(product.price)}</span>
              <div className="flex items-center gap-1 text-neutral-400 text-sm border-l border-neutral-800 pl-4">
                <Star className="w-4 h-4 fill-white text-white" />
                <span className="text-white mt-1">{product.rating}</span>
                <span className="mt-1">({product.reviews} Reviews)</span>
              </div>
            </div>

            <p className="text-neutral-400 leading-relaxed text-lg mb-10 font-light max-w-xl">
              {product.description}
            </p>

            <div className="grid grid-cols-2 gap-y-4 mb-12">
              {product.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm text-neutral-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-white opacity-50" />
                  {feature}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-6 border-t border-b border-neutral-900 py-8 mb-10">
              <div className="flex items-center border border-neutral-700 rounded-lg bg-neutral-900/50 p-1">
                <button 
                  aria-label="Decrease quantity"
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-xl hover:text-white text-neutral-400"
                >-</button>
                <span aria-label="Quantity" className="w-12 text-center text-lg">{qty}</span>
                <button 
                  aria-label="Increase quantity"
                  onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                  className="w-10 h-10 flex items-center justify-center text-xl hover:text-white text-neutral-400"
                >+</button>
              </div>
              
              <Button 
                variant="luxury" 
                size="lg" 
                className="flex-1 min-w-[200px] h-14 text-base tracking-widest uppercase"
                onClick={() => {
                  addItem({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.images[0],
                    qty,
                    stock: product.stock
                  });
                }}
              >
                <ShoppingCart className="w-5 h-5 mr-3" /> Add to Cart
              </Button>
            </div>

            <div className="space-y-4 text-sm text-neutral-500 font-light">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-neutral-400" /> Authenticity Guaranteed
              </div>
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-neutral-400" /> Complimentary Global Shipping
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}
