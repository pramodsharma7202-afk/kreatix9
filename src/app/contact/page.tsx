"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-10 pb-32">
      <div className="container mx-auto px-4 max-w-5xl py-16">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.4em] text-neutral-500 mb-4">Reach Out</p>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-[0.1em]">Get In Touch</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="space-y-10">
            <div>
              <h2 className="text-xl font-black uppercase tracking-widest mb-6 text-white">Our Concierge</h2>
              <p className="text-neutral-400 font-light leading-relaxed">
                Our dedicated concierge team is available to assist you with product inquiries, order support, and seller relations.
              </p>
            </div>

            {[
              { icon: Mail, label: "Email", value: "hello@kreatix9.com" },
              { icon: Phone, label: "Phone", value: "+1 (800) KREATIX9" },
              { icon: MapPin, label: "Address", value: "1 Kreatix9 Plaza, New York, NY 10001" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-neutral-400" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-neutral-500 mb-1">{item.label}</div>
                  <div className="text-white font-light">{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-8"
          >
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-6">
                  <Send className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold uppercase tracking-widest mb-3">Message Sent</h3>
                <p className="text-neutral-400 font-light">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">First Name</label>
                    <input type="text" required className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neutral-500 text-white" placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Last Name</label>
                    <input type="text" required className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neutral-500 text-white" placeholder="Doe" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Email</label>
                  <input type="email" required className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neutral-500 text-white" placeholder="your@email.com" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Subject</label>
                  <input type="text" required className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neutral-500 text-white" placeholder="How can we help?" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Message</label>
                  <textarea rows={5} required className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neutral-500 text-white resize-none placeholder:text-neutral-700" placeholder="Your message..." />
                </div>
                <Button variant="luxury" size="lg" className="w-full gap-2 tracking-widest uppercase" disabled={loading}>
                  {loading ? "Sending..." : <><Send className="w-4 h-4" /> Send Message</>}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
