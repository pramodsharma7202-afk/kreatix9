"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Search, SlidersHorizontal, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

type Category = {
  _id: string;
  name: string;
  slug: string;
};

type Product = {
  _id: string;
  name: string;
  price: number;
  images: string[];
  category: { _id: string; name: string };
  stock: number;
};

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const addItem = useCartStore((state) => state.addItem);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let url = '/api/products?limit=100';
      if (selectedCategory) {
        url += `&category=${selectedCategory}`;
      }
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }
      
      const res = await fetch(url);
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-black text-white pt-10 px-4 md:px-8 pb-32">
      <div className="container mx-auto">
        <div className="mb-12 border-b border-neutral-800 pb-8">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-[0.1em] mb-4 text-white drop-shadow-lg">
            Collection
          </h1>
          <p className="text-neutral-400 text-lg max-w-2xl font-light">
            Explore our curated selection of premium artifacts representing the pinnacle of design and craftsmanship.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-12">
          <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <Button 
              variant={selectedCategory === '' ? 'luxury' : 'outline'} 
              size="sm" 
              className={`rounded-full px-6 whitespace-nowrap ${selectedCategory === '' ? '' : 'border-neutral-700 hover:text-black'}`}
              onClick={() => setSelectedCategory('')}
            >
              All
            </Button>
            {categories.map((cat) => (
              <Button 
                key={cat._id}
                variant={selectedCategory === cat.slug ? 'luxury' : 'outline'} 
                size="sm" 
                className={`rounded-full px-6 whitespace-nowrap ${selectedCategory === cat.slug ? '' : 'border-neutral-700 hover:text-black'}`}
                onClick={() => setSelectedCategory(cat.slug)}
              >
                {cat.name}
              </Button>
            ))}
          </div>
          
          <form onSubmit={handleSearch} className="flex w-full md:w-auto gap-4">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-neutral-500 transition-colors placeholder:text-neutral-600"
              />
            </div>
            <Button type="submit" aria-label="Search" variant="outline" size="icon" className="rounded-full shrink-0 border-neutral-800 bg-neutral-900">
              <SlidersHorizontal className="w-4 h-4 text-neutral-400" />
            </Button>
          </form>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-neutral-900 aspect-[4/5] rounded-xl mb-4" />
                <div className="h-6 bg-neutral-900 rounded w-2/3 mb-2" />
                <div className="h-4 bg-neutral-900 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingCart className="w-16 h-16 mx-auto text-neutral-800 mb-4" />
            <h2 className="text-2xl font-bold mb-2">No products found</h2>
            <p className="text-neutral-500">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-x-8 md:gap-y-16"
          >
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group flex flex-col"
              >
                <Link href={`/product/${product._id}`} className="block relative aspect-[4/5] overflow-hidden rounded-lg bg-neutral-900 mb-5">
                  <Image
                    src={product.images?.[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600"}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-1000 opacity-90 group-hover:opacity-100"
                  />
                  {product.category && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-black/80 backdrop-blur-md text-white px-3 py-1 text-[10px] uppercase tracking-widest border border-white/10 rounded-full">
                        {product.category.name}
                      </span>
                    </div>
                  )}
                </Link>
                
                <div className="flex justify-between items-start flex-1 gap-4">
                  <div>
                    <Link href={`/product/${product._id}`}>
                      <h3 className="text-base font-medium tracking-wide leading-tight group-hover:text-neutral-400 transition-colors mb-2">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="text-xl font-light text-neutral-300">
                      {formatPrice(product.price)}
                    </div>
                  </div>
                  
                  <Button 
                    aria-label={`Add ${product.name} to cart`}
                    variant="outline" 
                    size="icon" 
                    className="shrink-0 border-neutral-800 bg-neutral-900/50 hover:bg-white hover:text-black rounded-full h-10 w-10 transition-all duration-300"
                    onClick={() => addItem({
                      product: product._id,
                      name: product.name,
                      price: product.price,
                      image: product.images?.[0] || "",
                      qty: 1,
                      stock: product.stock
                    })}
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
