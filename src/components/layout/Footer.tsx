import Link from "next/link";
import { Github, Twitter, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black text-neutral-400 py-16 border-t border-neutral-900">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
          <h2 className="text-white text-xl font-black uppercase tracking-widest mb-4">Kreatix9</h2>
          <p className="text-sm leading-relaxed max-w-xs">
            Experience the pinnacle of luxury shopping. Curated collections for the modern connoisseur.
          </p>
        </div>
        
        <div>
          <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Shop</h3>
          <ul className="space-y-3 text-sm">
            <li><Link href="/shop" className="hover:text-white transition-colors">All Products</Link></li>
            <li><Link href="/collections/featured" className="hover:text-white transition-colors">Featured</Link></li>
            <li><Link href="/collections/trending" className="hover:text-white transition-colors">Trending</Link></li>
            <li><Link href="/brands" className="hover:text-white transition-colors">Brands</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Support</h3>
          <ul className="space-y-3 text-sm">
            <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Connect</h3>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
            <a href="#" className="hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-16 pt-8 border-t border-neutral-900 flex flex-col md:flex-row items-center justify-between text-xs">
        <p>&copy; {new Date().getFullYear()} Kreatix9. All rights reserved.</p>
        <p className="mt-2 md:mt-0">Crafted with precision.</p>
      </div>
    </footer>
  );
}
