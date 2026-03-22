"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Edit, Trash2, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { useSocket } from "@/components/providers/SocketProvider";
import Image from "next/image";

type Category = {
  _id: string;
  name: string;
};

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
  sku: string;
  isFeatured: boolean;
  isTrending: boolean;
  isActive: boolean;
  soldCount: number;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { socket, emit } = useSocket();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    discountPrice: "",
    images: [""],
    category: "",
    stock: "",
    sku: "",
    isFeatured: false,
    isTrending: false,
    isActive: true
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

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
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

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      price: product.price.toString(),
      discountPrice: product.discountPrice?.toString() || "",
      images: product.images?.length ? product.images : [""],
      category: typeof product.category === 'object' ? product.category._id : product.category,
      stock: product.stock.toString(),
      sku: product.sku,
      isFeatured: product.isFeatured,
      isTrending: product.isTrending,
      isActive: product.isActive
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "", slug: "", description: "", price: "", discountPrice: "",
      images: [""], category: "", stock: "", sku: "",
      isFeatured: false, isTrending: false, isActive: true
    });
    setEditingProduct(null);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.price || !formData.sku || !formData.category) {
      alert("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
        stock: Number(formData.stock) || 0,
        images: formData.images.filter(Boolean)
      };

      let res;
      if (editingProduct) {
        res = await fetch(`/api/products/${editingProduct._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        const data = await res.json();
        if (socket) emit(editingProduct ? "product:update" : "product:new", data);
        setShowModal(false);
        resetForm();
        fetchProducts();
      } else {
        const error = await res.json();
        alert(error.error || "Failed to save product");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        if (socket) emit("product:delete", { _id: id });
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateImage = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ""] });
  };

  const removeImageField = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages.length ? newImages : [""] });
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
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
            <Button variant="luxury" size="sm" className="gap-2 shrink-0" onClick={() => { resetForm(); setShowModal(true); }}>
              <Plus className="w-4 h-4" /> Add Product
            </Button>
          </div>
        </div>

        {/* Stats */}
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
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {product.images?.[0] ? (
                          <div className="w-12 h-12 rounded bg-neutral-800 overflow-hidden relative">
                            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded bg-neutral-800 flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-neutral-600" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-white">{product.name}</div>
                          <div className="text-xs text-neutral-500 font-mono">{product.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-neutral-400">
                      {typeof product.category === 'object' ? product.category.name : "Uncategorized"}
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-neutral-300">{formatPrice(product.price)}</div>
                      {product.discountPrice && (
                        <div className="text-xs text-emerald-400">{formatPrice(product.discountPrice)}</div>
                      )}
                    </td>
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
                        <button onClick={() => openEditModal(product)} className="text-neutral-500 hover:text-white transition-colors p-1.5 hover:bg-neutral-800 rounded-lg">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(product._id)} className="text-neutral-500 hover:text-red-400 transition-colors p-1.5 hover:bg-red-500/10 rounded-lg">
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

      {/* Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-neutral-900 border border-neutral-700 rounded-2xl p-8 w-full max-w-2xl my-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black uppercase tracking-widest">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Product Name *</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Product name"
                    className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neutral-500 text-white placeholder:text-neutral-700"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">SKU *</label>
                  <input type="text" value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})} placeholder="SKU-001"
                    className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neutral-500 text-white placeholder:text-neutral-700"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Category *</label>
                  <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neutral-500 text-white">
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Price (USD) *</label>
                  <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} placeholder="0.00"
                    className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neutral-500 text-white placeholder:text-neutral-700"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Discount Price</label>
                  <input type="number" value={formData.discountPrice} onChange={(e) => setFormData({...formData, discountPrice: e.target.value})} placeholder="0.00"
                    className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neutral-500 text-white placeholder:text-neutral-700"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Stock *</label>
                  <input type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} placeholder="0"
                    className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neutral-500 text-white placeholder:text-neutral-700"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Slug</label>
                  <input type="text" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} placeholder="product-slug"
                    className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neutral-500 text-white placeholder:text-neutral-700"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Description</label>
                  <textarea rows={4} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Product description..."
                    className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neutral-500 text-white placeholder:text-neutral-700 resize-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Images</label>
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <input type="text" value={img} onChange={(e) => updateImage(idx, e.target.value)} placeholder="https://..."
                        className="flex-1 bg-black border border-neutral-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-neutral-500 text-white placeholder:text-neutral-700"
                      />
                      {formData.images.length > 1 && (
                        <button onClick={() => removeImageField(idx)} className="p-2 text-neutral-500 hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button onClick={addImageField} className="text-xs text-emerald-400 hover:text-emerald-300 mt-2">
                    + Add Image URL
                  </button>
                </div>
                <div className="col-span-2 flex flex-wrap gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                      className="w-4 h-4 rounded border-neutral-700 bg-black text-emerald-500" />
                    <span className="text-sm text-neutral-400">Featured</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.isTrending} onChange={(e) => setFormData({...formData, isTrending: e.target.checked})}
                      className="w-4 h-4 rounded border-neutral-700 bg-black text-emerald-500" />
                    <span className="text-sm text-neutral-400">Trending</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="w-4 h-4 rounded border-neutral-700 bg-black text-emerald-500" />
                    <span className="text-sm text-neutral-400">Active</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <Button variant="luxury" className="flex-1" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : editingProduct ? "Update Product" : "Create Product"}
              </Button>
              <Button variant="outline" className="border-neutral-700" onClick={() => { setShowModal(false); resetForm(); }} disabled={isSubmitting}>
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
