"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch('/api/products?limit=4');
        const data = await res.json();
        if (data.products) {
          setProducts(data.products.map((p: any) => ({
            _id: p._id,
            name: p.name,
            price: p.price,
            image: p.images?.[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600",
            description: p.description,
            stock: p.stock
          })));
        }
      } catch (err) {
        console.error("Failed to fetch featured products", err);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section className="py-24 bg-black text-white relative">
      <div className="container mx-auto px-4 z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-widest mb-4">Curated Selection</h2>
          <div className="w-24 h-1 bg-neutral-700 mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-neutral-900 mb-4 rounded-lg">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover w-full h-full opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center">
                  <Button 
                    variant="luxury" 
                    className="w-full gap-2"
                    onClick={(e) => {
                      e.preventDefault();
                      addItem({
                        product: product._id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        qty: 1,
                        stock: product.stock
                      });
                    }}
                  >
                    <ShoppingCart className="w-4 h-4" /> Add to Cart
                  </Button>
                </div>
              </div>
              
              <Link href={`/product/${product._id}`} className="block">
                <h3 className="text-lg font-bold uppercase tracking-wider mb-2 group-hover:text-neutral-400 transition-colors">
                  {product.name}
                </h3>
                <p className="text-neutral-500 mb-3 text-sm">{product.description}</p>
                <div className="text-xl font-light">{formatPrice(product.price)}</div>
              </Link>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Link href="/shop">
            <Button variant="outline" size="lg" className="border-neutral-700 text-neutral-300 hover:bg-white hover:text-black hover:border-white transition-all duration-300">
              View All Collections
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
