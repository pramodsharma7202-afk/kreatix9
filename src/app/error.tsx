"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-black px-4 py-24 relative overflow-hidden">
      {/* Background radial effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-red-900/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-neutral-900 border border-neutral-800 mb-8">
            <AlertTriangle className="w-10 h-10 text-neutral-500" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8 leading-none">
            An Unforeseen <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 to-red-900">Exception</span>
          </h1>
          
          <p className="text-neutral-400 text-lg mb-12 font-light max-w-md mx-auto leading-relaxed">
            Even perfection encounters deviations. We have logged this occurrence and are working to restore order.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              onClick={() => reset()}
              variant="luxury" 
              className="tracking-widest uppercase text-xs px-8 h-14"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Try Again
            </Button>
            <Button 
              onClick={() => window.location.href = "/"}
              variant="outline" 
              className="border-neutral-800 text-neutral-400 hover:text-white hover:border-white transition-all tracking-widest uppercase text-xs px-8 h-14"
            >
              Return Home
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
