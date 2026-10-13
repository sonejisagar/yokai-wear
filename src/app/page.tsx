'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Shield,
  RefreshCw,
  Star,
  Flame,
  Layers,
  Zap,
  CheckCircle2,
  Truck,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import ProductGrid from '@/components/ProductGrid';

const animeTickerItems = [
  'JUJUTSU SPECIAL',
  'DARK SWORDSMAN',
  'SOLO MONARCH',
  'SHINOBI CLAN',
  'PIRATE HUNTER',
  'DEMON SLAYER CORPS',
  '240 GSM HEAVYWEIGHT',
  'EXPRESS DISPATCH',
];

export default function Home() {
  const { addToCart } = useCart();
  const [showHeroBack, setShowHeroBack] = useState(false);

  const handleQuickAddHero = () => {
    addToCart({
      id: 'yokai-01-black-L',
      productId: 'yokai-01',
      name: 'LIMITLESS // SIX EYES OVERSIZED TEE',
      price: 899,
      image: showHeroBack
        ? 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=700&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=700&auto=format&fit=crop&q=80',
      color: 'Pitch Black',
      size: 'L',
      quantity: 1,
      gsm: 240,
    });
  };

  return (
    <main className="flex-1 w-full flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full relative overflow-hidden pt-8 pb-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b border-white/60">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-white shadow-2xs text-xs font-semibold text-zinc-700"
            >
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span className="font-mono text-zinc-900 font-bold">YOKAI WEAR // DROP 01</span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span className="text-zinc-500 font-mono">LIMITED TO 50 PCS EACH</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-zinc-950 leading-[1.08] font-mono"
            >
              ANIME STREETWEAR. <br />
              <span className="bg-gradient-to-r from-zinc-900 via-zinc-700 to-rose-600 bg-clip-text text-transparent">
                REFINED & OVERSIZED.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm sm:text-base text-zinc-600 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed"
            >
              Engineered with 240+ GSM heavyweight combed cotton. Relaxed drop-shoulder boxy cuts featuring soft, high-density anime manga prints that never peel or fade.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2"
            >
              <Link
                href="/shop"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-zinc-950/15 active:scale-95 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Shop Drop 01 Collection</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <button
                onClick={handleQuickAddHero}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/80 hover:bg-white border border-white text-zinc-800 hover:text-black font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Quick Add Featured (₹899)</span>
              </button>
            </motion.div>

            {/* Delivery & Trust Pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 text-xs text-zinc-600 font-mono"
            >
              <span className="flex items-center gap-1.5 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white shadow-2xs">
                <Truck className="w-3.5 h-3.5 text-zinc-900" />
                <span>Free Express Shipping ₹999+</span>
              </span>
              <span className="flex items-center gap-1.5 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white shadow-2xs">
                <Shield className="w-3.5 h-3.5 text-rose-500" />
                <span>Cash on Delivery (COD)</span>
              </span>
              <span className="flex items-center gap-1.5 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white shadow-2xs">
                <RefreshCw className="w-3.5 h-3.5 text-amber-500" />
                <span>7-Day Easy Size Swap</span>
              </span>
            </motion.div>

            {/* Quality Specs */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-5 border-t border-zinc-200/60 grid grid-cols-3 gap-3 text-center lg:text-left max-w-md mx-auto lg:mx-0"
            >
              <div>
                <p className="text-xl sm:text-2xl font-black text-zinc-950 font-mono">240-260</p>
                <p className="text-[11px] text-zinc-500 font-mono">GSM Heavy Cotton</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-zinc-950 font-mono">100%</p>
                <p className="text-[11px] text-zinc-500 font-mono">Pre-Shrunk Bio-Washed</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-amber-500 font-mono flex items-center justify-center lg:justify-start gap-1">
                  4.9 <Star className="w-3.5 h-3.5 fill-amber-500" />
                </p>
                <p className="text-[11px] text-zinc-500 font-mono">Customer Rating</p>
              </div>
            </motion.div>
          </div>

          {/* Right Showcase Visual (Pure Frosted Glass Card) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative flex justify-center"
          >
            <div className="relative w-full max-w-sm sm:max-w-md aspect-[3/4] rounded-3xl overflow-hidden bg-white/80 backdrop-blur-2xl border border-white shadow-2xl shadow-zinc-900/[0.06] group p-3">
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-zinc-100">
                {/* Product Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    showHeroBack
                      ? 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900&auto=format&fit=crop&q=80'
                      : 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=900&auto=format&fit=crop&q=80'
                  }
                  alt="Featured Anime T-Shirt"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-104"
                />

                {/* Soft gradient bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Badges on image */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md border border-white text-zinc-900 text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-mono flex items-center gap-1.5 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                  <span>LIMITED RUN: 14 LEFT</span>
                </div>

                {/* Front/Back Graphic Toggle */}
                <div className="absolute top-3 right-3 z-10">
                  <button
                    onClick={() => setShowHeroBack(!showHeroBack)}
                    className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-white text-[10px] sm:text-xs font-mono text-zinc-800 hover:text-black flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                  >
                    <Layers className="w-3 h-3 text-rose-500" />
                    <span>{showHeroBack ? 'View Front' : 'View Back Graphic'}</span>
                  </button>
                </div>

                {/* Bottom Card details */}
                <div className="absolute bottom-3 left-3 right-3 p-3.5 sm:p-4 rounded-2xl bg-white/90 backdrop-blur-xl border border-white shadow-lg flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-rose-600 font-mono uppercase tracking-wider font-semibold">
                      {showHeroBack ? 'Full Back Manga Panel' : 'Front Chest Graphic'}
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm text-zinc-950">LIMITLESS // SIX EYES</h3>
                    <p className="text-[11px] text-zinc-500">240 GSM Oversized Fit</p>
                  </div>
                  <div className="text-right">
                    <span className="text-base sm:text-lg font-black text-zinc-950 font-mono">₹899</span>
                    <p className="text-[10px] text-zinc-400 line-through font-mono">₹1,299</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Infinite Ticker Bar (Frosted Glass) */}
      <div className="w-full py-3 bg-white/40 backdrop-blur-md border-b border-white/60 overflow-hidden flex items-center">
        <div className="flex gap-8 whitespace-nowrap animate-marquee select-none">
          {[...animeTickerItems, ...animeTickerItems].map((series, idx) => (
            <div key={idx} className="flex items-center gap-8 text-xs font-mono font-bold text-zinc-500 tracking-wider">
              <span className="hover:text-zinc-900 transition-colors">{series}</span>
              <span className="text-rose-400">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* Product Catalog Grid */}
      <ProductGrid />

      {/* Craftsmanship Section */}
      <section id="craftsmanship" className="w-full py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-zinc-200/60">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-rose-600 font-mono text-xs tracking-wider uppercase font-semibold">
            WHY YOKAI WEAR HITS DIFFERENT
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 mt-1.5 font-mono">
            PREMIUM STREETWEAR FABRICATION
          </h2>
          <p className="text-zinc-500 text-xs sm:text-sm mt-2">
            Most ordinary anime tees use light 160 GSM material with stiff plastic prints. We custom-mill thick 240+ GSM combed cotton designed for longevity and effortless draping.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/90 shadow-md shadow-zinc-900/[0.02] space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-zinc-200/70 shadow-2xs flex items-center justify-center text-zinc-900">
              <Sparkles className="w-5 h-5 text-rose-500" />
            </div>
            <h3 className="text-base font-bold text-zinc-950 font-mono">240-260 GSM Heavy Combed Cotton</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Custom-knit thick combed cotton that holds a boxy drop-shoulder streetwear structure without clinging.
            </p>
            <ul className="text-[11px] text-zinc-600 space-y-1 font-mono pt-1">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-zinc-950" /> Bio-washed & pre-shrunk
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-zinc-950" /> Reinforced thick ribbed collar
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/90 shadow-md shadow-zinc-900/[0.02] space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-zinc-200/70 shadow-2xs flex items-center justify-center text-zinc-900">
              <Shield className="w-5 h-5 text-amber-500" />
            </div>
            <h3 className="text-base font-bold text-zinc-950 font-mono">Breathable High-Density Screen Print</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Zero stiff plastic feeling on your back. We use premium water-based discharge inks that dye straight into the cotton fibers.
            </p>
            <ul className="text-[11px] text-zinc-600 space-y-1 font-mono pt-1">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-zinc-950" /> Survives 50+ machine washes
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-zinc-950" /> Crack & peel-proof guarantee
              </li>
            </ul>
          </div>

          <div id="shipping" className="p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/90 shadow-md shadow-zinc-900/[0.02] space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-zinc-200/70 shadow-2xs flex items-center justify-center text-zinc-900">
              <Truck className="w-5 h-5 text-emerald-500" />
            </div>
            <h3 className="text-base font-bold text-zinc-950 font-mono">Express Delivery & Cash on Delivery</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Orders dispatched within 24 hours. Enjoy Cash on Delivery (COD) and 7-day hassle-free doorstep size exchanges.
            </p>
            <ul className="text-[11px] text-zinc-600 space-y-1 font-mono pt-1">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-zinc-950" /> Cash on Delivery (COD) supported
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-zinc-950" /> 7-day easy size exchange
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer (Frosted Glass) */}
      <footer className="w-full bg-white/50 backdrop-blur-md border-t border-white/80 py-10 px-4 sm:px-6 text-zinc-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <span className="font-extrabold text-zinc-950 font-mono tracking-tight text-sm">
              YOKAI<span className="text-rose-500">.</span>WEAR
            </span>
            <span className="hidden sm:inline text-zinc-300">•</span>
            <span className="font-mono text-zinc-500 text-xs">
              Minimalist Oversized Anime Streetwear
            </span>
          </div>

          <div className="flex items-center gap-5 font-mono text-zinc-500 text-xs">
            <Link href="/shop" className="hover:text-zinc-950 transition-colors">Drop 01</Link>
            <Link href="/#craftsmanship" className="hover:text-zinc-950 transition-colors">Fabric Quality</Link>
            <Link href="/shipping" className="hover:text-zinc-950 transition-colors">Delivery & COD</Link>
            <Link href="/admin" className="text-rose-600 hover:underline font-bold">Admin</Link>
          </div>

          <p className="text-zinc-400 font-mono text-[11px]">
            © 2026 YOKAI WEAR. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </main>
  );
}
