"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-black px-4 py-24 relative overflow-hidden">
      {/* Background radial effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-neutral-900/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-sm uppercase tracking-[0.4em] text-neutral-500 mb-6 block">Error 404</span>
          <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter mb-8 leading-none">
            Page <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-300 to-neutral-700">Lost</span>
          </h1>
          <p className="text-neutral-400 text-lg md:text-xl mb-12 font-light max-w-md mx-auto leading-relaxed">
            The masterpiece you're looking for was either curated elsewhere or no longer exists in our collection.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/">
              <Button variant="outline" className="border-neutral-800 text-neutral-400 hover:text-white hover:border-white transition-all tracking-widest uppercase text-xs px-8 h-14">
                <Home className="w-4 h-4 mr-2" /> Back Home
              </Button>
            </Link>
            <Link href="/shop">
              <Button variant="luxury" className="tracking-widest uppercase text-xs px-8 h-14">
                Explore Shop <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
