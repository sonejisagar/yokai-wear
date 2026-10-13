'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';

export default function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    // Dedicated Clean Admin layout without consumer navbar, announcement bar, or cart drawer
    return (
      <div className="relative z-10 flex flex-col min-h-screen bg-[#f3f4f6]/90 text-zinc-900">
        {children}
      </div>
    );
  }

  // Consumer Storefront layout
  return (
    <div className="relative z-10 flex flex-col min-h-screen">
      <AnnouncementBar />
      <Navbar />
      <div className="flex-1 flex flex-col">{children}</div>
      <CartDrawer />
    </div>
  );
}
