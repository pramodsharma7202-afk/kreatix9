"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart, Star, ShieldCheck, Truck, ArrowLeft, Package, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { useParams } from "next/navigation";

type Product = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: { _id: string; name: string };
  stock: number;
  rating: number;
  numReviews: number;
  isFeatured: boolean;
  isTrending: boolean;
  tags: string[];
  specifications?: Record<string, string>;
};

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      const productId = params?.id;
      if (!productId) return;
      
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${productId}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          if (data.images?.length > 0) {
            setMainImage(data.images[0]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch product", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params?.id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    addItem({
      product: product._id,
      name: product.name,
      price: product.discountPrice || product.price,
      image: product.images?.[0] || "",
      qty,
      stock: product.stock
    });
    
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <Package className="w-16 h-16 text-neutral-800 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
        <p className="text-neutral-500 mb-6">The product you're looking for doesn't exist.</p>
        <Link href="/shop">
          <Button variant="luxury">Browse Products</Button>
        </Link>
      </div>
    );
  }

  const images = product.images?.length > 0 
    ? product.images 
    : ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200"];

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
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-xl font-bold uppercase tracking-widest">Out of Stock</span>
                </div>
              )}
              {(product.isFeatured || product.isTrending) && (
                <div className="absolute top-4 left-4 flex gap-2">
                  {product.isFeatured && (
                    <span className="bg-white text-black text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                      Featured
                    </span>
                  )}
                  {product.isTrending && (
                    <span className="bg-emerald-500 text-white text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                      Trending
                    </span>
                  )}
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
                {images.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setMainImage(img)}
                    className={`w-24 h-24 shrink-0 rounded-lg overflow-hidden border-2 transition-all relative ${mainImage === img ? 'border-white' : 'border-transparent opacity-50 hover:opacity-100'}`}
                  >
                    <Image src={img} alt="" fill className="object-cover w-full h-full" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            {product.category && (
              <Link href={`/shop?category=${product.category._id}`} className="mb-2 uppercase tracking-widest text-sm text-neutral-500 hover:text-white transition-colors w-fit">
                {product.category.name}
              </Link>
            )}
            <h1 className="text-4xl md:text-5xl font-black tracking-wide mb-6">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-8">
              {product.discountPrice ? (
                <>
                  <span className="text-3xl font-light text-white">{formatPrice(product.discountPrice)}</span>
                  <span className="text-xl text-neutral-500 line-through">{formatPrice(product.price)}</span>
                </>
              ) : (
                <span className="text-3xl font-light text-white">{formatPrice(product.price)}</span>
              )}
            </div>

            {product.numReviews > 0 && (
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`w-4 h-4 ${star <= Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-neutral-700 text-neutral-700'}`} 
                    />
                  ))}
                </div>
                <span className="text-neutral-400 text-sm">{product.rating.toFixed(1)} ({product.numReviews} Reviews)</span>
              </div>
            )}

            <div className="flex items-center gap-4 mb-8">
              <span className={`text-sm font-medium ${product.stock > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
              {product.stock > 0 && product.stock <= 5 && (
                <span className="text-xs text-amber-400">Low stock - order soon!</span>
              )}
            </div>

            <p className="text-neutral-400 leading-relaxed text-lg mb-10 font-light max-w-xl">
              {product.description}
            </p>

            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-10">
                {product.tags.map((tag, idx) => (
                  <span key={idx} className="text-xs px-3 py-1 bg-neutral-800 rounded-full text-neutral-400 uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-6 border-t border-b border-neutral-900 py-8 mb-10">
              <div className="flex items-center border border-neutral-700 rounded-lg bg-neutral-900/50 p-1">
                <button 
                  aria-label="Decrease quantity"
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-xl hover:text-white text-neutral-400 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span aria-label="Quantity" className="w-12 text-center text-lg">{qty}</span>
                <button 
                  aria-label="Increase quantity"
                  onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                  className="w-10 h-10 flex items-center justify-center text-xl hover:text-white text-neutral-400 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <Button 
                variant="luxury" 
                size="lg" 
                className="flex-1 min-w-[200px] h-14 text-base tracking-widest uppercase"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                {added ? (
                  <>Added to Cart!</>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-3" /> Add to Cart
                  </>
                )}
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
