"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Edit, Trash2, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSocket } from "@/components/providers/SocketProvider";
import Image from "next/image";

type Category = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  isActive: boolean;
  order: number;
  productCount: number;
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { socket, emit } = useSocket();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    icon: "",
    isActive: true,
    order: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!socket) return;
    
    const handleNew = () => fetchCategories();
    const handleUpdate = () => fetchCategories();
    const handleDelete = () => fetchCategories();

    socket.on("category:new", handleNew);
    socket.on("category:update", handleUpdate);
    socket.on("category:delete", handleDelete);

    return () => {
      socket.off("category:new", handleNew);
      socket.off("category:update", handleUpdate);
      socket.off("category:delete", handleDelete);
    };
  }, [socket]);

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      image: category.image || "",
      icon: category.icon || "",
      isActive: category.isActive,
      order: category.order || 0
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({ name: "", slug: "", description: "", image: "", icon: "", isActive: true, order: 0 });
    setEditingCategory(null);
  };

  const handleSubmit = async () => {
    if (!formData.name) return;
    
    setIsSubmitting(true);
    try {
      const url = editingCategory ? `/api/categories/${editingCategory._id}` : "/api/categories";
      const method = editingCategory ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const data = await res.json();
        if (socket) {
          emit(editingCategory ? "category:update" : "category:new", data);
        }
        setShowModal(false);
        resetForm();
        fetchCategories();
      } else {
        const error = await res.json();
        alert(error.message || "Failed to save category");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        if (socket) emit("category:delete", { _id: id });
        fetchCategories();
      } else {
        const error = await res.json();
        alert(error.message || "Failed to delete category");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <Link href="/admin" className="text-xs text-neutral-500 uppercase tracking-widest hover:text-white mb-2 flex items-center gap-1">← Admin</Link>
            <h1 className="text-3xl font-black uppercase tracking-widest">Category Management</h1>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                placeholder="Search categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-neutral-600 text-white placeholder:text-neutral-600"
              />
            </div>
            <Button variant="luxury" size="sm" className="gap-2 shrink-0" onClick={() => { resetForm(); setShowModal(true); }}>
              <Plus className="w-4 h-4" /> Add Category
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4">
            <div className="text-xs uppercase tracking-wider text-neutral-500 mb-2">Total Categories</div>
            <div className="text-2xl font-light">{categories.length}</div>
          </div>
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4">
            <div className="text-xs uppercase tracking-wider text-neutral-500 mb-2">Active</div>
            <div className="text-2xl font-light">{categories.filter(c => c.isActive).length}</div>
          </div>
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4">
            <div className="text-xs uppercase tracking-wider text-neutral-500 mb-2">Inactive</div>
            <div className="text-2xl font-light">{categories.filter(c => !c.isActive).length}</div>
          </div>
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4">
            <div className="text-xs uppercase tracking-wider text-neutral-500 mb-2">Total Products</div>
            <div className="text-2xl font-light">{categories.reduce((acc, c) => acc + (c.productCount || 0), 0)}</div>
          </div>
        </div>

        <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 text-xs uppercase tracking-widest">
                <th className="py-4 px-6 text-left">Category</th>
                <th className="py-4 px-6 text-left">Slug</th>
                <th className="py-4 px-6 text-left">Products</th>
                <th className="py-4 px-6 text-left">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="py-10 text-center text-neutral-500">Loading Categories...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="py-10 text-center text-neutral-500">No categories found.</td></tr>
              ) : filtered.map((category, i) => (
                <motion.tr
                  key={category._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-neutral-800/60 hover:bg-neutral-800/20 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      {category.image ? (
                        <div className="w-10 h-10 rounded bg-neutral-800 overflow-hidden relative">
                          <Image src={category.image} alt={category.name} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded bg-neutral-800 flex items-center justify-center">
                          <Tag className="w-4 h-4 text-neutral-500" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-white">{category.name}</div>
                        {category.description && (
                          <div className="text-xs text-neutral-500 mt-0.5 truncate max-w-[200px]">{category.description}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-neutral-400 font-mono text-xs">{category.slug}</td>
                  <td className="py-4 px-6 text-neutral-300">{category.productCount || 0}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border ${
                      category.isActive ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-neutral-800 border-neutral-700 text-neutral-400'
                    }`}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => openEditModal(category)} className="text-neutral-500 hover:text-white transition-colors p-1.5 hover:bg-neutral-800 rounded-lg">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(category._id)} className="text-neutral-500 hover:text-red-400 transition-colors p-1.5 hover:bg-red-500/10 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-neutral-900 border border-neutral-700 rounded-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black uppercase tracking-widest">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Category name"
                  className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neutral-500 text-white placeholder:text-neutral-700"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  placeholder="category-slug"
                  className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neutral-500 text-white placeholder:text-neutral-700"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Category description..."
                  className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neutral-500 text-white placeholder:text-neutral-700 resize-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Image URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                  className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neutral-500 text-white placeholder:text-neutral-700"
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="w-4 h-4 rounded border-neutral-700 bg-black text-emerald-500 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-neutral-400">Active</span>
                </label>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <Button variant="luxury" className="flex-1" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : editingCategory ? "Update Category" : "Create Category"}
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
