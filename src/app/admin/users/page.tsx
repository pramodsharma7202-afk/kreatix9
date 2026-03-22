"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Search, Trash2, Edit } from "lucide-react";
import Link from "next/link";
import { useSocket } from "@/components/providers/SocketProvider";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { socket } = useSocket();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("user:new", fetchUsers);
    return () => {
      socket.off("user:new", fetchUsers);
    };
  }, [socket]);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <Link href="/admin" className="text-xs text-neutral-500 uppercase tracking-widest hover:text-white mb-2 flex items-center gap-1">← Admin</Link>
            <h1 className="text-3xl font-black uppercase tracking-widest">User Management</h1>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-neutral-600 text-white placeholder:text-neutral-600"
            />
          </div>
        </div>

        <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 text-xs uppercase tracking-widest">
                <th className="py-4 px-6 text-left">Name / Email</th>
                <th className="py-4 px-6 text-left">Role</th>
                <th className="py-4 px-6 text-left">Orders</th>
                <th className="py-4 px-6 text-left">Joined</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-neutral-500">Loading Users...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-neutral-600">
                    <Users className="w-12 h-12 mx-auto mb-4" />
                    <p>No users match your filter.</p>
                  </td>
                </tr>
              ) : filtered.map((user, i) => (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-neutral-800/60 hover:bg-neutral-800/20 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="font-medium text-white">{user.name}</div>
                    <div className="text-neutral-500 text-xs mt-1">{user.email}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border ${
                      user.role === 'admin' ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' :
                      user.role === 'seller' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                      'bg-neutral-800 border-neutral-700 text-neutral-400'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-neutral-300">{user.orderCount || 0}</td>
                  <td className="py-4 px-6 text-neutral-500">{new Date(user.createdAt).toLocaleDateString()}</td>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
