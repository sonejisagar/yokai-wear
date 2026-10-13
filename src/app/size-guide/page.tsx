'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';

const sizeChart = [
  { size: 'S', chest: '42"', length: '28"', shoulder: '21"', sleeve: '8.5"' },
  { size: 'M', chest: '44"', length: '29"', shoulder: '22"', sleeve: '9.0"' },
  { size: 'L', chest: '46"', length: '30"', shoulder: '23"', sleeve: '9.5"' },
  { size: 'XL', chest: '48"', length: '31"', shoulder: '24"', sleeve: '10.0"' },
  { size: 'XXL', chest: '50"', length: '32"', shoulder: '25"', sleeve: '10.5"' },
];

export default function SizeGuidePage() {
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
          <span>FITTING & MEASUREMENTS</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-zinc-950 font-mono tracking-tight">
          OVERSIZED SIZE GUIDE
        </h1>
        <p className="text-sm text-zinc-500 max-w-xl">
          All Yokai Wear tees are tailored with an authentic streetwear boxy drop-shoulder silhouette. Use this chart to find your ideal drape.
        </p>
      </div>

      {/* Measurement Table */}
      <div className="rounded-3xl bg-white/70 backdrop-blur-xl border border-white shadow-xl shadow-zinc-900/[0.03] overflow-hidden mb-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-zinc-200/60 bg-white/80 font-mono text-zinc-500 text-xs uppercase tracking-wider">
                <th className="py-4 px-6">Size</th>
                <th className="py-4 px-6">Chest (Around)</th>
                <th className="py-4 px-6">Length</th>
                <th className="py-4 px-6">Shoulder</th>
                <th className="py-4 px-6">Sleeve</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-mono">
              {sizeChart.map((row) => (
                <tr key={row.size} className="hover:bg-white/90 transition-colors">
                  <td className="py-4 px-6 font-bold text-zinc-950">{row.size}</td>
                  <td className="py-4 px-6 text-zinc-700">{row.chest}</td>
                  <td className="py-4 px-6 text-zinc-700">{row.length}</td>
                  <td className="py-4 px-6 text-zinc-700">{row.shoulder}</td>
                  <td className="py-4 px-6 text-zinc-700">{row.sleeve}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fit Advice Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white shadow-md space-y-2.5">
          <h3 className="font-bold text-base text-zinc-950 font-mono">FOR TRUE OVERSIZED LOOK</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Order your usual standard T-shirt size. Our patterns already have built-in extra chest width (+4 inches) and relaxed drop shoulders for that effortless streetwear drape.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white shadow-md space-y-2.5">
          <h3 className="font-bold text-base text-zinc-950 font-mono">FOR REGULAR / FITTED LOOK</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            If you prefer a closer, traditional fit without excessive drop shoulders, size down by one size (e.g. if you normally wear L, choose M).
          </p>
        </div>
      </div>

      {/* 7-Day Exchange reassurance */}
      <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-xl border border-white shadow-sm flex items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-sm text-zinc-950 font-mono">Worried about picking the wrong size?</h4>
          <p className="text-xs text-zinc-500 mt-0.5">We offer 7-day hassle-free doorstep size exchanges on all orders.</p>
        </div>
        <Link
          href="/shop"
          className="px-5 py-2.5 rounded-2xl bg-zinc-950 text-white font-bold text-xs hover:bg-zinc-800 transition-all font-mono whitespace-nowrap shadow-xs"
        >
          Shop Now
        </Link>
      </div>
    </main>
  );
}
