import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Blog | Kreatix9',
  description: 'Explore Kreatix9\'s blog for in-depth guides, luxury lifestyle content, product showcases, and expert buying advice.',
};

const posts = [
  {
    id: "1",
    title: "The Art of Timekeeping: How to Choose Your First Luxury Watch",
    excerpt: "From complications to case materials, we break down everything you need to know before investing in a fine timepiece.",
    category: "Watches",
    date: "March 18, 2025",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Capsule Wardrobe 2025: The Pieces Worth Investing In",
    excerpt: "Quality over quantity. We identify the essential luxury pieces that will elevate your wardrobe for years to come.",
    category: "Fashion",
    date: "March 15, 2025",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Sustainable Luxury: Brands Leading the Way in Ethical Fashion",
    excerpt: "Luxury and sustainability are no longer at odds. Discover the brands redefining what it means to shop responsibly.",
    category: "Sustainability",
    date: "March 10, 2025",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-10 pb-32">
      <div className="container mx-auto px-4 max-w-5xl py-16">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.4em] text-neutral-500 mb-4">Editorial</p>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-[0.1em] mb-4">The Journal</h1>
          <p className="text-neutral-500 font-light max-w-lg mx-auto">
            Curated insights on luxury lifestyle, product guides, and the stories behind the brands.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.id} className="group border border-neutral-800 rounded-2xl overflow-hidden bg-neutral-900/30 hover:border-neutral-600 transition-colors cursor-pointer">
              <div className="aspect-video overflow-hidden relative">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] bg-neutral-800 px-3 py-1 rounded-full uppercase tracking-wider text-neutral-400">
                    {post.category}
                  </span>
                  <span className="text-[10px] text-neutral-600">{post.readTime}</span>
                </div>
                <h2 className="text-base font-bold tracking-wide leading-snug mb-3 group-hover:text-neutral-300 transition-colors text-white">
                  {post.title}
                </h2>
                <p className="text-sm text-neutral-500 font-light leading-relaxed mb-6 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="text-xs text-neutral-600">{post.date}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
