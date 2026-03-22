"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { UserMenu } from "@/components/layout/UserMenu";

export function Navbar() {
  const pathname = usePathname();
  const totalItems = useCartStore((state) => state.totalItems);

  return (
    <header className="fixed top-0 w-full z-50 glass border-b border-white/10 text-white transition-all duration-300 bg-black/60 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group transition-transform hover:scale-105">
          <Image 
            src="/logo.png" 
            alt="Kreatix9 Logo" 
            width={48}
            height={48}
            priority
            fetchPriority="high"
            className="object-contain brightness-110 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] transition-all duration-300 group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
          />
          <span className="text-2xl font-black uppercase tracking-widest text-white hidden sm:inline-block">
            Kreatix<span className="text-neutral-400">9</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 items-center font-medium text-sm tracking-wide">
          <Link href="/" className={cn("hover:text-neutral-300 transition-colors", pathname === '/' && 'text-white border-b border-white')}>Home</Link>
          <Link href="/shop" className={cn("hover:text-neutral-300 transition-colors", pathname === '/shop' && 'text-white border-b border-white')}>Shop</Link>
          <Link href="/collections" className={cn("hover:text-neutral-300 transition-colors", pathname === '/collections' && 'text-white border-b border-white')}>Collections</Link>
          <Link href="/about" className={cn("hover:text-neutral-300 transition-colors", pathname === '/about' && 'text-white border-b border-white')}>Legacy</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-6">
          <button aria-label="Search" className="hover:text-neutral-400 transition-colors">
            <Search className="w-5 h-5" />
          </button>
          
          <UserMenu />
          
          <Link href="/cart" className="relative hover:text-neutral-400 transition-colors cursor-pointer flex items-center">
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          <button aria-label="Menu" className="md:hidden hover:text-neutral-400 transition-colors">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
