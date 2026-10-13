'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Search,
  Heart,
  User,
  Menu,
  X,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import SearchModal from './SearchModal';

const navLinks = [
  { name: 'Drop 01', href: '/shop', badge: 'Limited Run' },
  { name: 'Oversized Tees', href: '/shop', badge: null },
  { name: 'Fabric & Fit', href: '/#craftsmanship', badge: '240 GSM' },
  { name: 'Size Guide', href: '/size-guide', badge: null },
  { name: 'Shipping & COD', href: '/shipping', badge: null },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [wishlistCount, setWishlistCount] = useState(2);
  const { totalItems, setIsCartOpen } = useCart();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-2xl border-b border-white/80 shadow-md shadow-zinc-900/[0.04] py-2.5 sm:py-3'
            : 'bg-white/60 backdrop-blur-xl border-b border-white/70 py-3 sm:py-4 shadow-xs shadow-zinc-900/[0.02]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3">
            {/* Mobile Hamburger Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 -ml-1 rounded-2xl text-zinc-700 hover:text-black bg-white/70 hover:bg-white border border-white/90 shadow-xs transition-colors cursor-pointer"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-rose-600" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Brand Logo: YOKAI WEAR (Pure Minimalist Frosted Look) */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group select-none"
            >
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-white/90 border border-white shadow-sm flex items-center justify-center transition-all group-hover:scale-105">
                <span className="font-black text-rose-600 text-base sm:text-lg">
                  Y
                </span>
              </div>

              <div className="flex flex-col">
                <span className="font-black text-base sm:text-xl tracking-tight text-zinc-900 flex items-center gap-1 font-mono">
                  YOKAI<span className="text-rose-500">.</span>WEAR
                  <span className="text-[9px] font-sans font-bold bg-rose-50 text-rose-600 border border-rose-200/60 px-1.5 py-0.2 rounded-full ml-1 tracking-wider uppercase">
                    DROP 01
                  </span>
                </span>
                <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-zinc-400 -mt-0.5 font-mono hidden xs:block">
                  Refined Anime Streetwear • 240+ GSM
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links with Frosted Glass Hover Pill */}
            <nav className="hidden lg:flex items-center gap-1 bg-white/70 backdrop-blur-md p-1.5 rounded-full border border-white/90 shadow-xs">
              {navLinks.map((link, idx) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="relative px-3.5 py-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-950 transition-colors flex items-center gap-1.5 rounded-full"
                >
                  {hoveredIndex === idx && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-white rounded-full border border-zinc-200/60 shadow-xs"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}

                  <span className="relative z-10">{link.name}</span>

                  {link.badge && (
                    <span
                      className={`relative z-10 text-[9px] font-bold px-1.5 py-0.2 rounded-full tracking-wider ${
                        link.badge === 'Limited Run'
                          ? 'bg-rose-50 text-rose-600 border border-rose-200/80'
                          : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Right Action Icons: Search, Wishlist, Cart */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Search button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-2xl text-zinc-600 hover:text-zinc-950 bg-white/70 hover:bg-white border border-white/90 shadow-xs transition-all text-xs group cursor-pointer"
                title="Search Tees"
              >
                <Search className="w-4 h-4 text-zinc-500 group-hover:text-zinc-900 transition-transform group-hover:scale-110" />
                <span className="hidden sm:inline-block text-xs font-medium text-zinc-700">Search</span>
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => setWishlistCount((prev) => (prev > 0 ? prev : 1))}
                className="relative p-2 rounded-2xl text-zinc-600 hover:text-rose-600 bg-white/70 hover:bg-white border border-white/90 shadow-xs transition-all group cursor-pointer"
                aria-label="Wishlist"
              >
                <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform group-hover:scale-110" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-rose-500 text-white text-[9px] sm:text-[10px] font-bold flex items-center justify-center shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* User Account / Login */}
              <button
                onClick={() => alert('Supabase Auth: Sign in with your phone / email to track your Yokai Wear orders!')}
                className="p-2 rounded-2xl text-zinc-600 hover:text-zinc-950 bg-white/70 hover:bg-white border border-white/90 shadow-xs transition-all hidden md:flex items-center justify-center cursor-pointer"
                aria-label="Account"
                title="My Account"
              >
                <User className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </button>

              {/* Animated Cart Button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-2xl bg-zinc-950 text-white font-bold text-xs sm:text-sm hover:bg-zinc-800 transition-all shadow-sm shadow-zinc-950/20 cursor-pointer ml-0.5"
                aria-label="Open cart"
              >
                <div className="relative">
                  <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  {totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] sm:text-[10px] font-extrabold flex items-center justify-center ring-2 ring-zinc-950"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </div>

                <span className="font-semibold text-xs sm:text-sm">
                  Bag
                </span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className="lg:hidden border-t border-white/80 bg-white/90 backdrop-blur-2xl px-4 pt-3 pb-6 mt-2 space-y-3 shadow-xl overflow-hidden"
            >
              <div className="space-y-1">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between p-3 rounded-2xl text-zinc-700 hover:text-black hover:bg-white transition-colors text-sm font-medium border border-transparent hover:border-white shadow-2xs"
                    >
                      <span className="flex items-center gap-2">
                        {link.name}
                        {link.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                            {link.badge}
                          </span>
                        )}
                      </span>
                      <ArrowRight className="w-4 h-4 text-zinc-400" />
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="pt-3 border-t border-zinc-200/60 grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    alert('Supabase Auth: Sign In modal');
                  }}
                  className="p-3 rounded-2xl bg-white text-zinc-700 font-semibold text-center border border-zinc-200/80 shadow-2xs hover:bg-zinc-50"
                >
                  My Account
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsCartOpen(true);
                  }}
                  className="p-3 rounded-2xl bg-zinc-950 text-white font-bold text-center hover:bg-zinc-850 shadow-sm"
                >
                  View Bag ({totalItems})
                </button>
              </div>

              <div className="pt-1 text-center text-[11px] text-zinc-500 font-mono flex items-center justify-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>EXPRESS DISPATCH • CASH ON DELIVERY AVAILABLE</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Global Interactive Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
