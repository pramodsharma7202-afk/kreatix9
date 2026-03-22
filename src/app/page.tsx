"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
const HeroScene = dynamic(() => import("@/components/3d/HeroScene").then(mod => mod.HeroScene), { ssr: false });
import { Button } from "@/components/ui/button";
import { FeaturedProducts } from "@/components/shared/FeaturedProducts";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
    gsap.registerPlugin(ScrollTrigger);
    
    // Parallax effect for the middle section
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
