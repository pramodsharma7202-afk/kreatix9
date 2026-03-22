"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

// Lazy load heavy below-fold components — keeps initial JS bundle small
const HeroScene = dynamic(() => import("@/components/3d/HeroScene").then(mod => mod.HeroScene), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-black" />,
});

const FeaturedProducts = dynamic(
  () => import("@/components/shared/FeaturedProducts").then(mod => mod.FeaturedProducts),
  {
    ssr: false,
    loading: () => (
      <div className="py-24 bg-black">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-neutral-900 aspect-[4/5] rounded-xl mb-4" />
                <div className="h-6 bg-neutral-900 rounded w-2/3 mb-2" />
                <div className="h-4 bg-neutral-900 rounded w-1/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  }
);

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// Hero content is separated to allow partial static optimization
function HeroContent() {
  return (
    <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
      {/* 
        CRITICAL LCP FIX: Removed motion.div from H1.
        By keeping the H1 as plain HTML, it renders immediately via SSR.
        Previously, it was hidden (opacity: 0) until framer-motion JS loaded.
      */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-both">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-[0.2em] mb-6 leading-tight drop-shadow-2xl">
          Redefining <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 to-neutral-600">
            Luxury
          </span>
        </h1>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-lg md:text-xl text-neutral-400 mb-10 max-w-2xl mx-auto font-light"
      >
        Discover a curated collection of premium products designed for the contemporary lifestyle.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="flex flex-col sm:flex-row gap-6 justify-center"
      >
        <Link href="/shop" prefetch={false}>
          <Button size="lg" variant="luxury" className="px-8 py-6 text-lg tracking-widest uppercase">
            Explore Collection <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col min-h-screen bg-black" ref={containerRef}>
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        {/* 3D Canvas Background — lazy loaded, non-blocking */}
        <HeroScene />

        {/* Hero Text */}
        <HeroContent />

        {/* Scroll Indicator — pure CSS animation, no JS */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce-slow">
          <div className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent" />
        </div>
      </section>

      {/* Featured Products — lazy loaded with skeleton placeholder */}
      <FeaturedProducts />

      {/* Parallax Quote Section — pure CSS background-attachment: fixed (no JS) */}
      <section
        className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-fixed bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=60&w=1400&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-5xl font-serif text-white italic font-light leading-relaxed"
          >
            &ldquo;True luxury is a reward for investing in and strictly adhering to quality.&rdquo;
          </motion.h2>
        </div>
      </section>
    </div>
  );
}
