'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Truck, ShieldCheck, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ShippingPage() {
  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-zinc-950 transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Shop
      </Link>

      <div className="space-y-3 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-white shadow-2xs text-xs font-mono text-zinc-600">
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          <span>POLICIES & DELIVERY</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-zinc-950 font-mono tracking-tight">
          SHIPPING & RETURNS
        </h1>
        <p className="text-sm text-zinc-500 max-w-xl">
          Everything you need to know about dispatch timelines, Cash on Delivery (COD), and our 7-day doorstep size exchange policy.
        </p>
      </div>

      <div className="space-y-6">
        {/* Shipping details */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white/70 backdrop-blur-xl border border-white shadow-md space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex items-center justify-center text-zinc-900">
              <Truck className="w-5 h-5 text-rose-500" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-950 font-mono">DELIVERY TIMELINES & CHARGES</h2>
              <p className="text-xs text-zinc-500">Fast express dispatch on all orders</p>
            </div>
          </div>

          <ul className="text-xs text-zinc-600 space-y-2.5 font-mono pt-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span><strong>Free Shipping:</strong> Automatically applied at checkout on all orders above ₹999.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span><strong>Standard Delivery:</strong> Flat ₹79 fee on orders under ₹999.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span><strong>Dispatch Timeline:</strong> Orders placed before 4:00 PM are dispatched on the same business day.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span><strong>Delivery Time:</strong> 2 to 4 business days with live SMS tracking link.</span>
            </li>
          </ul>
        </div>

        {/* Cash on Delivery */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white/70 backdrop-blur-xl border border-white shadow-md space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex items-center justify-center text-zinc-900">
              <ShieldCheck className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-950 font-mono">CASH ON DELIVERY (COD)</h2>
              <p className="text-xs text-zinc-500">Pay when your package arrives at your doorstep</p>
            </div>
          </div>

          <p className="text-xs text-zinc-500 leading-relaxed">
            Cash on Delivery is available across all serviceable pincodes. You can inspect the outer packaging and pay the courier executive via Cash, UPI (Google Pay, PhonePe, Paytm), or card on delivery.
          </p>
        </div>

        {/* 7-Day Size Exchanges */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white/70 backdrop-blur-xl border border-white shadow-md space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex items-center justify-center text-zinc-900">
              <RefreshCw className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-950 font-mono">7-DAY HASSLE-FREE SIZE EXCHANGES</h2>
              <p className="text-xs text-zinc-500">We want your oversized fit to be perfect</p>
            </div>
          </div>

          <p className="text-xs text-zinc-500 leading-relaxed">
            If your shirt doesn&apos;t fit the way you like, you can request an exchange within 7 days of delivery. Our courier partner will pick up the item from your doorstep and deliver the replacement size for free.
          </p>
        </div>
      </div>
    </main>
  );
}
