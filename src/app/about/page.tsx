import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Kreatix9',
  description: 'Learn the story and philosophy behind Kreatix9 — a premium curated marketplace for luxury goods.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-10 pb-32">
      {/* Hero */}
      <div className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black" />
        <div className="relative z-10 text-center px-4">
          <p className="text-xs uppercase tracking-[0.4em] text-neutral-400 mb-4">Our Story</p>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-[0.1em]">The Legacy</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-wider mb-6">Crafted for the Discerning</h2>
            <p className="text-neutral-400 leading-relaxed font-light text-lg">
              Kreatix9 was born from a singular vision — to create a marketplace where quality is non-negotiable and every product tells a story of mastery and craft. We partner exclusively with artisans and luxury brands who share our unwavering commitment to excellence.
            </p>
          </div>
          <div className="aspect-square bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800">
            <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop" alt="Luxury craftsmanship" className="w-full h-full object-cover opacity-80" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {[
            { number: "250+", label: "Luxury Brands", description: "Exclusive partnerships with the world's finest makers." },
            { number: "15K+", label: "Happy Clients", description: "Discerning shoppers who trust our curation." },
            { number: "99.8%", label: "Satisfaction", description: "Our commitment to excellence in every transaction." },
          ].map((s, i) => (
            <div key={i} className="border border-neutral-800 rounded-xl p-8 bg-neutral-900/30 text-center">
              <div className="text-4xl font-black text-white mb-2">{s.number}</div>
              <div className="text-sm uppercase tracking-widest text-neutral-400 mb-3 font-bold">{s.label}</div>
              <div className="text-neutral-500 text-sm font-light">{s.description}</div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-black uppercase tracking-wider mb-6">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-3xl mx-auto">
            {[
              { title: "Authenticity", body: "Every product is verified and sourced directly from authorized partners." },
              { title: "Sustainability", body: "We consciously partner with brands committed to ethical and sustainable practices." },
              { title: "Exclusivity", body: "A carefully curated selection — not everything makes it to Kreatix9." },
              { title: "Service", body: "White-glove customer care to ensure your experience is as premium as the products." },
            ].map((v, i) => (
              <div key={i} className="p-6 border border-neutral-800 rounded-xl bg-neutral-900/30">
                <h3 className="font-bold uppercase tracking-widest text-sm mb-3 text-white">{v.title}</h3>
                <p className="text-neutral-500 text-sm font-light leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
