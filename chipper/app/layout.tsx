import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Footer from '../components/Footer';
import Header from '../components/Header';
import ThemeClient from '../components/ThemeClient'; // 👈 new client component
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://chipper-store.com'),
  title: {
    default: 'Chipper - Quality Products for All',
    template: '%s | Chipper',
  },
  description: 'Shop a wide range of products at Chipper, from electronics to clothing.',
  keywords: 'ecommerce, products, Chipper, shopping',
  openGraph: {
    title: 'Chipper',
    description: 'Discover quality products for all your needs.',
    url: 'https://chipper-store.com',
    images: ['/images/og-image.jpg'],
    siteName: 'Chipper',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chipper',
    description: 'Discover quality products for all your needs.',
    images: ['/images/og-image.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <body className={`${inter.className} bg-base-100 text-neutral-content min-h-screen flex flex-col`}>
      <ThemeClient /> {/* 👈 applies theme safely after hydration */}
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Chipper',
            url: 'https://chipper-store.com',
          }),
        }}
      />
    </body>
  );
}
