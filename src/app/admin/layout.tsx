"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Package, Users, ShoppingBag, Tag, Settings, BarChart2, Image as ImageIcon,
} from "lucide-react";

const adminNavItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Categories", href: "/admin/categories", icon: Tag },
  { label: "Banners", href: "/admin/banners", icon: ImageIcon },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart2 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-neutral-950 text-white">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-neutral-900/80 border-r border-neutral-800 flex flex-col py-8 hidden md:flex">
        <div className="px-6 mb-10">
          <Link href="/" className="text-lg font-black uppercase tracking-widest text-white">
            Kreatix<span className="text-neutral-500">Admin</span>
          </Link>
          <p className="text-xs text-neutral-600 mt-1">Control Panel</p>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200",
                  isActive
                    ? "bg-white text-black font-semibold"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-6 pt-6 border-t border-neutral-800 mt-6">
          <Link href="/" className="text-xs text-neutral-500 hover:text-white transition-colors">
            ← View Storefront
          </Link>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
