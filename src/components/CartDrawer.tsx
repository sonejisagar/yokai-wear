'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Sparkles, Truck, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import CheckoutModal from './CheckoutModal';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cart, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const freeShippingThreshold = 999;
  const progressToFreeShipping = Math.min(100, (totalPrice / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - totalPrice);
  const shippingFee = remainingForFreeShipping === 0 || totalPrice === 0 ? 0 : 79;
  const grandTotal = totalPrice + shippingFee;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Frosted Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-zinc-900/25 backdrop-blur-md z-50 transition-opacity"
          />

          {/* Drawer container: Full-width on mobile, max-w-md on desktop */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 240 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:max-w-md bg-white/90 backdrop-blur-3xl border-l border-white shadow-2xl z-50 flex flex-col text-zinc-900"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-zinc-200/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex items-center justify-center text-zinc-800">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base tracking-wide flex items-center gap-1.5 font-mono text-zinc-900">
                    YOUR BAG
                  </h3>
                  <p className="text-xs text-zinc-500">
                    {totalItems} {totalItems === 1 ? 'item' : 'items'} in your bag
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-800 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Free Shipping Progress bar in INR (₹) */}
            <div className="px-4 sm:px-5 py-3 bg-white/60 border-b border-zinc-200/50">
              <div className="flex justify-between text-xs mb-1.5 font-medium font-mono">
                {remainingForFreeShipping > 0 ? (
                  <span className="text-zinc-600">
                    Add <span className="text-rose-600 font-bold">₹{remainingForFreeShipping}</span> more for <span className="text-zinc-900 font-semibold">Free Shipping</span>
                  </span>
                ) : (
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Free Shipping Unlocked!
                  </span>
                )}
                <span className="text-zinc-500">{Math.round(progressToFreeShipping)}%</span>
              </div>
              <div className="w-full bg-zinc-200/80 h-1.5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToFreeShipping}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full"
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 divide-y divide-zinc-100">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
                  <div className="w-16 h-16 rounded-3xl bg-white border border-zinc-200/80 shadow-2xs flex items-center justify-center text-zinc-400 mb-4">
                    <ShoppingBag className="w-7 h-7 text-zinc-400" />
                  </div>
                  <h4 className="text-lg font-bold text-zinc-800 font-mono">YOUR BAG IS EMPTY</h4>
                  <p className="text-xs text-zinc-500 max-w-xs mt-1 mb-6">
                    Explore Drop 01 oversized tees before this batch runs out!
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-6 py-2.5 rounded-2xl bg-zinc-950 text-white font-bold text-xs hover:bg-zinc-850 transition-all shadow-sm cursor-pointer font-mono"
                  >
                    EXPLORE DROP 01
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <motion.div
                    layout
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-3.5 first:pt-0 flex gap-3.5 items-start p-3 bg-white/70 border border-white/90 rounded-2xl shadow-2xs"
                  >
                    <div className="relative w-18 h-22 sm:w-20 sm:h-24 rounded-xl overflow-hidden bg-zinc-100 flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-zinc-900 line-clamp-1 font-mono">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-zinc-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5 mt-1 text-[11px] text-zinc-500">
                        <span className="bg-zinc-100 px-2 py-0.5 rounded-md text-[10px] text-zinc-700">
                          {item.color}
                        </span>
                        <span className="bg-zinc-100 px-2 py-0.5 rounded-md font-mono text-[10px] text-zinc-700">
                          Size: {item.size}
                        </span>
                        {item.gsm && (
                          <span className="bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded-md font-mono text-[9px] font-semibold">
                            {item.gsm} GSM
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-zinc-200/80 rounded-xl bg-white shadow-2xs">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 sm:p-1.5 text-zinc-500 hover:text-zinc-950 transition-colors cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-mono font-semibold text-zinc-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 sm:p-1.5 text-zinc-500 hover:text-zinc-950 transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-sm font-bold text-zinc-950 font-mono">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {cart.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-zinc-200/60 bg-white/90 backdrop-blur-md space-y-3">
                <div className="space-y-1.5 text-xs text-zinc-600 font-mono">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-zinc-900 font-semibold">₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {shippingFee === 0 ? (
                        <span className="text-emerald-600 font-semibold">FREE</span>
                      ) : (
                        `₹${shippingFee}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-zinc-900 pt-2 border-t border-zinc-200/60">
                    <span>Total Amount</span>
                    <span className="text-base text-zinc-950 font-black">
                      ₹{grandTotal}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-3.5 px-4 rounded-2xl bg-zinc-950 hover:bg-zinc-850 text-white font-bold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 shadow-md shadow-zinc-950/10 active:scale-[0.98] transition-all cursor-pointer font-mono"
                >
                  <span>CHECKOUT • COD & UPI (₹{grandTotal})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Trust callout */}
                <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1 font-mono">
                  <span className="flex items-center gap-1 text-zinc-700">
                    <Truck className="w-3 h-3 text-zinc-900" /> Express Dispatch
                  </span>
                  <span className="flex items-center gap-1 text-zinc-700">
                    <ShieldCheck className="w-3 h-3 text-rose-600" /> Cash on Delivery Available
                  </span>
                </div>
              </div>
            )}
          </motion.div>

          {/* Checkout Modal */}
          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
          />
        </>
      )}
    </AnimatePresence>
  );
}
