import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { SocketProvider } from '@/components/providers/SocketProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://kreatix9.vercel.app'),
  title: {
    default: 'Kreatix9 | Premium E-Commerce',
    template: '%s | Kreatix9',
  },
  description: 'Discover a curated selection of premium products. Kreatix9 delivers the ultimate luxury shopping experience with 3D immersive design and world-class quality.',
  keywords: ['luxury ecommerce', 'premium shopping', 'designer products', 'Kreatix9'],
  authors: [{ name: 'Kreatix9 Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'Kreatix9',
    title: 'Kreatix9 | Premium E-Commerce',
    description: 'Discover a curated selection of premium products.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kreatix9 | Premium E-Commerce',
    description: 'Discover a curated selection of premium products.',
    creator: '@kreatix9',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Kreatix9',
    url: process.env.NEXT_PUBLIC_APP_URL,
    logo: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
    sameAs: ['https://twitter.com/kreatix9', 'https://instagram.com/kreatix9'],
  };

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body suppressHydrationWarning className={`${inter.variable} ${playfair.variable} font-sans bg-background text-foreground antialiased min-h-screen flex flex-col`}>
        <AuthProvider>
          <SocketProvider>
            <Navbar />
            <main className="flex-1 flex flex-col pt-20">
              {children}
            </main>
            <Footer />
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
