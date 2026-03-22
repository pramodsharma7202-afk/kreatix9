import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://luxecart.vercel.app';

  // Static pages
  const staticPages = [
    '', '/shop', '/about', '/contact', '/faq', '/blog', '/login', '/register',
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  }));

  return [...staticPages];
}
