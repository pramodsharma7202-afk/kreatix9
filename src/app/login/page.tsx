"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await signIn("credentials", { 
        email, 
        password, 
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password");
        setLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=2070&auto=format&fit=crop')] bg-cover opacity-20 filter grayscale" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-0" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 w-full max-w-md bg-neutral-900/40 backdrop-blur-xl border border-neutral-800 rounded-2xl p-10 shadow-2xl"
      >
        <Link href="/" className="inline-flex items-center text-xs text-neutral-400 hover:text-white mb-10 transition-colors uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Link>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-black uppercase tracking-widest mb-2">Kreatix9</h1>
          <p className="text-neutral-400 font-light text-sm tracking-wide">Enter the world of luxury</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg text-center">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-neutral-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neutral-500 transition-colors placeholder:text-neutral-700 text-white"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs uppercase tracking-widest text-neutral-500">Password</label>
              <Link href="/forgot-password" className="text-xs text-neutral-400 hover:text-white transition-colors">Forgot?</Link>
            </div>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-neutral-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neutral-500 transition-colors placeholder:text-neutral-700 text-white"
              placeholder="Enter your password"
            />
          </div>

          <Button 
            variant="luxury" 
            size="lg" 
            className="w-full h-12 uppercase tracking-widest text-sm mt-4" 
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-neutral-500">
          Don't have an account? <Link href="/register" className="text-white hover:underline ml-1">Register</Link>
        </div>
      </motion.div>
    </div>
  );
}
