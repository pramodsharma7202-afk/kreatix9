"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
// Lazy load below-fold and heavy components to reduce TBT on initial load
const HeroScene = dynamic(() => import("@/components/3d/HeroScene").then(mod => mod.HeroScene), { ssr: false });
const FeaturedProducts = dynamic(() => import("@/components/shared/FeaturedProducts").then(mod => mod.FeaturedProducts), {
  ssr: false,
  loading: () => (
    <div className="py-24 bg-black">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1,2,3,4].map(i => (
            <div key={i} className="animate-pulse">
              <div className="bg-neutral-900 aspect-[4/5] rounded-xl mb-4" />
              <div className="h-6 bg-neutral-900 rounded w-2/3 mb-2" />
              <div className="h-4 bg-neutral-900 rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
});
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    // Defer GSAP to idle time so it doesn't block first paint (reduces TBT)
    const setupGsap = () => {
      import("gsap").then(({ default: gsap }) => {
        import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
          gsap.registerPlugin(ScrollTrigger);
          gsap.fromTo(
            ".parallax-bg",
            { backgroundPosition: "50% 0%" },
            {
              backgroundPosition: "50% 100%",
              ease: "none",
              scrollTrigger: {
                trigger: ".parallax-section",
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        });
      });
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as Window & { requestIdleCallback: (fn: () => void) => void }).requestIdleCallback(setupGsap);
    } else {
      // Fallback for Safari which doesn't support requestIdleCallback
      setTimeout(setupGsap, 200);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-black" ref={containerRef}>
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        {/* 3D Canvas Background */}
        <HeroScene />
        
        {/* Content */}
        <motion.div 
          ref={textRef}
          style={{ y, opacity }}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-[0.2em] mb-6 leading-tight drop-shadow-2xl">
              Redefining <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 to-neutral-600">
                Luxury
              </span>
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-lg md:text-xl text-neutral-400 mb-10 max-w-2xl mx-auto font-light"
          >
            Discover a curated collection of premium products designed for the contemporary lifestyle.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Link href="/shop">
              <Button size="lg" variant="luxury" className="px-8 py-6 text-lg tracking-widest uppercase">
                Explore Collection <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent" />
        </motion.div>
      </section>

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Parallax Quote Section */}
      <section className="parallax-section relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div 
          className="parallax-bg absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop')] bg-cover opacity-30" 
        />
        <div className="absolute inset-0 bg-black/60 z-0" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-3xl md:text-5xl font-serif text-white italic font-light leading-relaxed"
          >
            "True luxury is a reward for investing in and strictly adhering to quality."
          </motion.h2>
        </div>
      </section>
      
    </div>
  );
}
