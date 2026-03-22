"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Package, TrendingUp, DollarSign, Plus, Eye } from "lucide-react";
import Link from "next/link";

const mockProducts = [
  { id: "1", name: "Premium Headphones", price: 299.99, stock: 50, sold: 32, status: "approved" },
  { id: "2", name: "Leather Jacket", price: 499.00, stock: 20, sold: 15, status: "approved" },
  { id: "3", name: "New Arrival Sneakers", price: 189.00, stock: 10, sold: 0, status: "pending" },
];

export default function SellerDashboardPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    { label: "Total Revenue", value: "$13,984", icon: DollarSign },
    { label: "Products Listed", value: mockProducts.length, icon: Package },
    { label: "Units Sold", value: 47, icon: TrendingUp },
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

        {/* Stats */}
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

        {/* Product Listings Table */}
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
                <th className="py-4 px-6 text-left">Admin Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockProducts.map((product, i) => (
                <tr key={product.id} className="border-b border-neutral-800/60 hover:bg-neutral-800/20 transition-colors">
                  <td className="py-4 px-6 text-white font-medium">{product.name}</td>
                  <td className="py-4 px-6 text-neutral-300">{formatPrice(product.price)}</td>
                  <td className="py-4 px-6 text-neutral-400">{product.stock}</td>
                  <td className="py-4 px-6 text-neutral-400">{product.sold}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border ${
                      product.status === 'approved'
                        ? 'bg-green-500/10 border-green-500/30 text-green-400'
                        : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-end gap-3">
                      <button className="text-neutral-500 hover:text-white p-1.5 hover:bg-neutral-800 rounded-lg">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Listing Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-neutral-900 border border-neutral-700 rounded-2xl p-8 w-full max-w-lg"
          >
            <h2 className="text-xl font-black uppercase tracking-widest mb-8">New Product Listing</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Product Name</label>
                <input type="text" className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neutral-500 text-white" placeholder="Product Name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Price (USD)</label>
                  <input type="number" className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neutral-500 text-white" placeholder="0.00"/>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Stock Qty</label>
                  <input type="number" className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neutral-500 text-white" placeholder="0"/>
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Description</label>
                <textarea rows={3} className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neutral-500 text-white resize-none" placeholder="Describe your product..." />
              </div>
            </div>
            <p className="text-xs text-neutral-600 mt-4">Listings will go live after admin approval.</p>
            <div className="flex gap-4 mt-6">
              <Button variant="luxury" className="flex-1">Submit for Review</Button>
              <Button variant="outline" className="border-neutral-700" onClick={() => setShowAddModal(false)}>Cancel</Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
