import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { ProductProvider } from '@/context/ProductContext';
import AppLayoutWrapper from '@/components/AppLayoutWrapper';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'YOKAI WEAR | Oversized Anime Streetwear',
  description: 'Limited edition 240+ GSM heavyweight oversized anime tees. Pure glassmorphism design, pre-shrunk boxy silhouettes, and Cash on Delivery.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f8f9fa] text-zinc-900 font-sans selection:bg-rose-500/20 selection:text-rose-900 relative">
        {/* Soft Ambient Pastel Background Orbs for Pure Glassmorphism Refraction */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-rose-200/35 rounded-full blur-[140px]" />
          <div className="absolute top-1/4 -right-40 w-[700px] h-[700px] bg-indigo-100/50 rounded-full blur-[150px]" />
          <div className="absolute top-2/3 left-1/3 w-[650px] h-[650px] bg-amber-100/40 rounded-full blur-[140px]" />
          <div className="absolute -bottom-40 right-1/4 w-[600px] h-[600px] bg-rose-100/40 rounded-full blur-[140px]" />
        </div>

        <CartProvider>
          <ProductProvider>
            <AppLayoutWrapper>{children}</AppLayoutWrapper>
          </ProductProvider>
        </CartProvider>
      </body>
    </html>
  );
}
