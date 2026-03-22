"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Edit, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { useSocket } from "@/components/providers/SocketProvider";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const { socket } = useSocket();

  // Create Product form state
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    sku: "",
    stock: "",
    description: "",
    category: "60b9c3f8f9b2d3001f3b39d1", // Dummy Object Id for testing, replace with real id or dropdown later
    slug: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products?limit=100");
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handleUpdate = () => fetchProducts();
    socket.on("product:new", handleUpdate);
    socket.on("product:update", handleUpdate);
    socket.on("product:delete", handleUpdate);
    return () => {
      socket.off("product:new", handleUpdate);
      socket.off("product:update", handleUpdate);
      socket.off("product:delete", handleUpdate);
    };
  }, [socket]);

  const handleCreateProduct = async () => {
    if (!formData.name || !formData.price || !formData.sku) return;
    
    try {
      setIsSubmitting(true);
      // Generate slug from name
      const slugInfo = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        slug: slugInfo + "-" + Date.now().toString().slice(-4)
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const newProd = await res.json();
        setProducts(prev => [newProd, ...prev]);
        setShowModal(false);
        setFormData({ name: "", price: "", sku: "", stock: "", description: "", category: "60b9c3f8f9b2d3001f3b39d1", slug: "" });
        if (socket) socket.emit("product:new", newProd);
      } else {
        console.error("Failed to create product");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <Link href="/admin" className="text-xs text-neutral-500 uppercase tracking-widest hover:text-white mb-2 flex items-center gap-1">← Admin</Link>
            <h1 className="text-3xl font-black uppercase tracking-widest">Product Management</h1>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-neutral-600 text-white placeholder:text-neutral-600"
              />
            </div>
            <Button variant="luxury" size="sm" className="gap-2 shrink-0" onClick={() => setShowModal(true)}>
              <Plus className="w-4 h-4" /> Add Product
            </Button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Products", value: products.length },
            { label: "Active", value: products.filter(p => p.stock > 5).length },
            { label: "Low Stock", value: products.filter(p => p.stock > 0 && p.stock <= 5).length },
            { label: "Out of Stock", value: products.filter(p => p.stock === 0).length },
          ].map((s, i) => (
            <div key={i} className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4">
              <div className="text-xs uppercase tracking-wider text-neutral-500 mb-2">{s.label}</div>
              <div className="text-2xl font-light">{s.value}</div>
            </div>
          ))}
        </div>

        <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 text-xs uppercase tracking-widest">
                <th className="py-4 px-6 text-left">Product</th>
                <th className="py-4 px-6 text-left">Category</th>
                <th className="py-4 px-6 text-left">Price</th>
                <th className="py-4 px-6 text-left">Stock</th>
                <th className="py-4 px-6 text-left">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="py-10 text-center text-neutral-500">Loading Products...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="py-10 text-center text-neutral-500">No products found.</td></tr>
              ) : filtered.map((product, i) => {
                const status = product.stock === 0 ? "out-of-stock" : product.stock <= 5 ? "low-stock" : "active";
                return (
                  <motion.tr
                    key={product._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-neutral-800/60 hover:bg-neutral-800/20 transition-colors"
                  >
                    <td className="py-4 px-6 font-medium text-white">{product.name}</td>
                    <td className="py-4 px-6 text-neutral-400">{product.category?.name || "Uncategorized"}</td>
                    <td className="py-4 px-6 text-neutral-300">{formatPrice(product.price)}</td>
                    <td className="py-4 px-6 text-neutral-300">{product.stock}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border ${
                        status === 'active' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                        status === 'low-stock' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' :
                        'bg-red-500/10 border-red-500/30 text-red-400'
                      }`}>
                        {status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-3">
                        <button className="text-neutral-500 hover:text-white transition-colors p-1.5 hover:bg-neutral-800 rounded-lg">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-neutral-500 hover:text-red-400 transition-colors p-1.5 hover:bg-red-500/10 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-neutral-900 border border-neutral-700 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-xl font-black uppercase tracking-widest mb-8">Add New Product</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Product Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Enter product name"
                  className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neutral-500 text-white placeholder:text-neutral-700"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Price (USD)</label>
                <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} placeholder="0.00"
                  className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neutral-500 text-white placeholder:text-neutral-700"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">SKU</label>
                <input type="text" value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})} placeholder="PROD-001"
                  className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neutral-500 text-white placeholder:text-neutral-700"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Stock Quantity</label>
                <input type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} placeholder="0"
                  className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neutral-500 text-white placeholder:text-neutral-700"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Description</label>
                <textarea rows={4} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Product description..."
                  className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neutral-500 text-white placeholder:text-neutral-700 resize-none"
                />
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <Button variant="luxury" className="flex-1" onClick={handleCreateProduct} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Product"}
              </Button>
              <Button variant="outline" className="border-neutral-700" onClick={() => setShowModal(false)} disabled={isSubmitting}>Cancel</Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
