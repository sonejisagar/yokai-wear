'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, Sparkles, ShieldCheck, X } from 'lucide-react';

const announcements = [
  {
    icon: <Truck className="w-3.5 h-3.5 text-zinc-900" />,
    text: 'FREE EXPRESS SHIPPING ON ALL ORDERS ABOVE ₹999',
    tag: 'FREE SHIPPING',
  },
  {
    icon: <Sparkles className="w-3.5 h-3.5 text-amber-500" />,
    text: 'LIMITED DROP 01: ONLY 50 PIECES PER DESIGN • 240+ GSM HEAVYWEIGHT',
    tag: 'LIMITED RUN',
  },
  {
    icon: <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />,
    text: 'CASH ON DELIVERY (COD) & 7-DAY HASSLE-FREE SIZE EXCHANGES',
    tag: 'GUARANTEED',
  },
];

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  const current = announcements[currentIndex];

  return (
    <div className="relative bg-white/50 backdrop-blur-md text-zinc-700 text-xs py-2 px-3 sm:px-4 border-b border-white/80 shadow-sm shadow-black/[0.02] overflow-hidden select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Badge */}
        <div className="hidden md:flex items-center gap-2 text-zinc-500 text-[11px] font-mono tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-zinc-600 font-medium">YOKAI WEAR // STUDIO</span>
        </div>

        {/* Center animated ticker */}
        <div className="flex-1 flex justify-center items-center overflow-hidden h-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="flex items-center gap-2 text-center"
            >
              {current.icon}
              <span className="font-semibold tracking-wide text-zinc-800 text-[11px] sm:text-xs">
                {current.text}
              </span>
              <span className="hidden sm:inline-block bg-white/80 text-zinc-700 border border-zinc-200/60 shadow-xs text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider">
                {current.tag}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right close button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsVisible(false)}
            aria-label="Dismiss banner"
            className="text-zinc-400 hover:text-zinc-700 transition-colors p-0.5 rounded cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
