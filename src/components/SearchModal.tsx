'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Sparkles, ArrowRight, Flame } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const trendingSearches = [
  'Gojo Six Eyes 240 GSM',
  'Itachi Crow Genjutsu',
  'Berserk Eclipse Acid Wash',
  'Solo Leveling Shadow Monarch',
  'Zoro Three Sword Style',
  'Flame Dance Oversized',
];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Close on Escape or ⌘K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 px-3 sm:px-6">
          {/* Frosted Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-900/25 backdrop-blur-md"
          />

          {/* Pure Glassmorphic Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -16 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-white/85 backdrop-blur-3xl border border-white shadow-2xl rounded-3xl overflow-hidden z-10 text-zinc-900"
          >
            {/* Input Header */}
            <div className="p-4 sm:p-5 border-b border-zinc-200/60 flex items-center gap-3">
              <Search className="w-5 h-5 text-zinc-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search anime t-shirt, character, or design..."
                autoFocus
                className="w-full bg-transparent text-sm sm:text-base text-zinc-900 placeholder-zinc-400 focus:outline-none"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-xs text-zinc-500 hover:text-zinc-800 bg-white/80 border border-zinc-200 px-2.5 py-1 rounded-full shadow-2xs"
                >
                  Clear
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-900 hover:bg-white/80 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Trending & Suggestions */}
            <div className="p-4 sm:p-5 space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 tracking-wider uppercase mb-2.5 font-mono">
                  <Flame className="w-3.5 h-3.5 text-rose-500" />
                  Popular Searches
                </div>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => setSearchTerm(term)}
                      className="px-3.5 py-1.5 rounded-full text-xs bg-white/80 border border-zinc-200/80 hover:border-zinc-300 text-zinc-700 hover:text-black hover:bg-white shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Jump */}
              <div className="pt-3 border-t border-zinc-200/50">
                <p className="text-xs text-zinc-400 mb-2 font-mono">EXPLORE DROP 01</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { label: 'Oversized Boxy Tees', count: '4 Styles' },
                    { label: 'Vintage Acid Washed', count: '2 Styles' },
                    { label: 'Graphic Back Prints', count: 'All Drops' },
                    { label: '240 GSM Heavy Cotton', count: 'Premium' },
                    { label: 'Express Shipping', count: 'Fast Delivery' },
                    { label: 'Cash on Delivery (COD)', count: 'Available' },
                  ].map((category) => (
                    <div
                      key={category.label}
                      onClick={onClose}
                      className="p-2.5 rounded-2xl bg-white/60 hover:bg-white border border-white hover:border-zinc-200/80 cursor-pointer shadow-2xs transition-all flex flex-col justify-between group"
                    >
                      <span className="text-xs font-medium text-zinc-700 group-hover:text-black flex items-center justify-between">
                        {category.label}
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400" />
                      </span>
                      <span className="text-[10px] text-zinc-400 mt-1 font-mono">{category.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 sm:px-5 py-3 bg-zinc-50/60 border-t border-zinc-200/50 flex items-center justify-between text-[11px] text-zinc-400">
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-white text-zinc-600 font-mono text-[10px] border border-zinc-200 shadow-2xs">ESC</kbd> to close
              </span>
              <span className="text-zinc-500 font-mono flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-rose-500" /> YOKAI WEAR SEARCH
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
