import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import connectToDatabase from '@/lib/db/mongoose';
import Category from '@/lib/db/models/Category';

export const metadata: Metadata = {
  title: 'Our Collections | Kreatix9',
  description: 'Explore the definitive collections of luxury and craftsmanship by Kreatix9.',
};

export const revalidate = 0; // Disable static caching so it's always fresh

export default async function CollectionsPage() {
  await connectToDatabase();
  const categories = await Category.find({}).sort('name');

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-32">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-[0.1em] mb-6">
            The Collections
          </h1>
          <p className="text-neutral-400 font-light text-lg leading-relaxed">
            Discover our meticulously curated categories. Each collection represents the pinnacle of craftsmanship, design, and uncompromising quality.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 select-none md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {categories.length === 0 ? (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20 text-neutral-500">
              No collections found in the database.
            </div>
          ) : (
            categories.map((category) => (
              <Link 
                href={`/shop?category=${category.slug}`} 
                key={category._id.toString()}
                className="group relative aspect-[3/4] overflow-hidden bg-neutral-900 rounded-2xl block"
              >
                {/* Image */}
                <img
                  src={category.image || "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=1000"}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-110 group-hover:opacity-90"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                
                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="block text-xs uppercase tracking-[0.3em] text-neutral-400 mb-2 font-semibold">
                    {category.description || "Premium Selection"}
                  </span>
                  <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">
                    {category.name}
                  </h2>
                  
                  {/* Explore Link (Animated) */}
                  <div className="flex items-center text-sm font-medium uppercase tracking-widest text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    Explore <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-2" />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
