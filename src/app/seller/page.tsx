"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Package, TrendingUp, DollarSign, Plus, Eye } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

type Product = {
  _id: string;
  name: string;
  price: number;
  stock: number;
  soldCount: number;
  images: string[];
  isActive: boolean;
};

export default function SellerDashboardPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products?limit=100");
        if (res.ok) {
          const data = await res.json();
          const sellerProducts = (data.products || []).filter(
            (p: any) => p.seller === session?.user?.id
          );
          setProducts(sellerProducts);
        }
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchProducts();
    }
  }, [session?.user?.id]);

  const totalRevenue = products.reduce((acc, p) => acc + p.price * p.soldCount, 0);
  const totalSold = products.reduce((acc, p) => acc + p.soldCount, 0);

  const stats = [
    { label: "Total Revenue", value: formatPrice(totalRevenue), icon: DollarSign },
    { label: "Products Listed", value: products.length, icon: Package },
    { label: "Units Sold", value: totalSold, icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-10 px-4 md:px-8 pb-32">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4 border-b border-neutral-800 pb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-widest mb-1">Seller Dashboard</h1>
            <p className="text-neutral-500 text-sm">Manage your store and product listings.</p>
          </div>
          <Button variant="luxury" className="gap-2" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4" /> Add Listing
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="text-xs uppercase tracking-widest text-neutral-500">{s.label}</div>
                <s.icon className="w-5 h-5 text-neutral-500" />
              </div>
              <div className="text-3xl font-light text-white">{s.value}</div>
            </motion.div>
          ))}
        </div>

        <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b border-neutral-800">
            <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-400">Your Listings</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 text-xs uppercase tracking-widest">
                <th className="py-4 px-6 text-left">Product Name</th>
                <th className="py-4 px-6 text-left">Price</th>
                <th className="py-4 px-6 text-left">Stock</th>
                <th className="py-4 px-6 text-left">Sold</th>
                <th className="py-4 px-6 text-left">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-neutral-500">Loading...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-neutral-500">No products found. Add your first listing!</td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="border-b border-neutral-800/60 hover:bg-neutral-800/20 transition-colors">
                    <td className="py-4 px-6 text-white font-medium">{product.name}</td>
                    <td className="py-4 px-6 text-neutral-300">{formatPrice(product.price)}</td>
                    <td className="py-4 px-6 text-neutral-400">{product.stock}</td>
                    <td className="py-4 px-6 text-neutral-400">{product.soldCount || 0}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border ${
                        product.isActive
                          ? 'bg-green-500/10 border-green-500/30 text-green-400'
                          : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                      }`}>
                        {product.isActive ? 'Active' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-end gap-3">
                        <Link href={`/product/${product._id}`} className="text-neutral-500 hover:text-white p-1.5 hover:bg-neutral-800 rounded-lg">
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-neutral-900 border border-neutral-700 rounded-2xl p-8 w-full max-w-lg"
          >
            <h2 className="text-xl font-black uppercase tracking-widest mb-8">New Product Listing</h2>
            <p className="text-neutral-500 mb-6">To add products, please use the Admin Dashboard with seller privileges.</p>
            <div className="flex gap-4 mt-6">
              <Link href="/admin/products" className="flex-1">
                <Button variant="luxury" className="w-full">Go to Admin Products</Button>
              </Link>
              <Button variant="outline" className="border-neutral-700" onClick={() => setShowAddModal(false)}>Close</Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
