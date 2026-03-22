"use client";

import { motion } from "framer-motion";

export function HeroScene() {
  return (
    <div className="absolute inset-0 z-0 h-full w-full pointer-events-none overflow-hidden bg-black">
      {/* Premium Dark Gradient Backdrop — opacity slightly lowered for faster paint */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(40,40,40,0.6)_0%,rgba(0,0,0,1)_100%)] opacity-90" />
      
      {/* Animated Abstract Orb 1 — reduced blur radius for GPU paint savings on mobile */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="hero-orb absolute top-1/4 left-1/4 w-[40vw] h-[40vw] rounded-full bg-neutral-800/20 blur-[60px]"
      />

      {/* Animated Abstract Orb 2 */}
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.4, 0.2],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="hero-orb absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] rounded-full bg-neutral-700/20 blur-[80px]"
      />

      {/* Respect prefers-reduced-motion for accessibility + performance */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .hero-orb { animation: none !important; transform: none !important; }
        }
      `}</style>
    </div>
  );
}
