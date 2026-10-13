'use client';

import React from 'react';
import ProductGrid from '@/components/ProductGrid';
import { Sparkles } from 'lucide-react';

export default function ShopPage() {
  return (
    <main className="flex-1 w-full flex flex-col items-center">
      {/* Shop Header Banner */}
      <div className="w-full py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto border-b border-zinc-200/60 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-white shadow-2xs text-xs font-mono text-zinc-600 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          <span>DROP 01 CAPSULE COLLECTION</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-zinc-950 font-mono tracking-tight">
          ALL ANIME DROPS
        </h1>
        <p className="text-zinc-500 text-sm max-w-md mx-auto mt-2">
          Explore our limited collection of 240+ GSM oversized boxy anime tees. Pre-shrunk, heavyweight, and built for daily wear.
        </p>
      </div>

      {/* Catalog Grid */}
      <ProductGrid />
    </main>
  );
}
