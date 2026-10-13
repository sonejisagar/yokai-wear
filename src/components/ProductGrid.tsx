'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';
import { animeProducts } from '@/data/products';
import ProductCard from './ProductCard';

const categories = [
  { id: 'all', label: 'All Designs' },
  { id: 'oversized', label: 'Oversized Boxy' },
  { id: 'acid-wash', label: 'Vintage Acid Washed' },
  { id: 'graphic-tees', label: 'Graphic Prints' },
];

export default function ProductGrid() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'gsm'>('featured');

  const filteredProducts = useMemo(() => {
    let list = [...animeProducts];

    if (activeCategory !== 'all') {
      list = list.filter((p) => p.category === activeCategory);
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'gsm') {
      list.sort((a, b) => b.gsm - a.gsm);
    }

    return list;
  }, [activeCategory, sortBy]);

  return (
    <section id="catalog" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-5 border-b border-zinc-200/60">
        <div>
          <div className="flex items-center gap-2 text-rose-600 font-mono text-xs tracking-wider uppercase mb-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>DROP 01 // LIMITED RUN</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-zinc-950 tracking-tight font-mono">
            DROP 01 COLLECTION
          </h2>
          <p className="text-zinc-500 text-xs sm:text-sm mt-1.5 max-w-lg">
            Exclusive 240-260 GSM heavyweight anime tees with pre-shrunk, drop-shoulder silhouettes and durable discharge prints.
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md border border-white/90 shadow-2xs rounded-2xl px-3 py-2 text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-zinc-400 font-mono">SORT:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-zinc-800 font-medium focus:outline-none cursor-pointer text-xs"
            >
              <option value="featured" className="bg-white">Curated Drop</option>
              <option value="price-asc" className="bg-white">Price: Low to High</option>
              <option value="price-desc" className="bg-white">Price: High to Low</option>
              <option value="gsm" className="bg-white">Highest GSM (Heaviest)</option>
            </select>
          </div>

          <div className="text-xs font-mono text-zinc-500 bg-white/70 backdrop-blur-md border border-white/90 shadow-2xs px-3 py-2 rounded-2xl">
            {filteredProducts.length} DESIGNS
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`relative px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? 'text-white'
                  : 'text-zinc-600 hover:text-zinc-950 bg-white/70 hover:bg-white border border-white/90 shadow-2xs'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="active-catalog-tab"
                  className="absolute inset-0 bg-zinc-950 rounded-full shadow-xs"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Product Grid: 1 col on mobile, 2 cols on tablet, 3 cols on desktop for a spacious luxury feel */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7"
      >
        <AnimatePresence>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
