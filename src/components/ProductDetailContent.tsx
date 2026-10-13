'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Truck,
  ShieldCheck,
  RefreshCw,
  Star,
  Check,
  Layers,
  ArrowRight,
  ChevronRight,
  Minus,
  Plus,
  Ruler,
  Sparkles,
  ChevronDown,
  Info,
  X,
} from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';

interface Props {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailContent({ product, relatedProducts }: Props) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[1] || product.sizes?.[0] || 'L');
  const [selectedColor, setSelectedColor] = useState(
    product.colors?.[0] || { name: 'Pitch Black', hex: '#121212' }
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Accordion state
  const [openAccordion, setOpenAccordion] = useState<'fabric' | 'size' | 'care' | 'shipping' | null>('fabric');

  const { addToCart } = useCart();

  // Build complete gallery including sub-images
  const subLabels = ['Print Detail', 'Model Fit', 'Fabric Texture', 'Back Angle', 'Neck & Stitching'];
  const imagesList = [
    { label: 'Front View', url: product.frontImage },
    { label: 'Back Graphic', url: product.backImage },
    ...(product.subImages || []).map((url, i) => ({
      label: subLabels[i] || `Detail ${i + 1}`,
      url,
    })),
  ].filter((img) => Boolean(img.url));

  const activeImage = imagesList[activeImageIndex]?.url || product.frontImage;

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const handleAddToCart = () => {
    addToCart({
      id: `${product.id}-${selectedColor.name}-${selectedSize}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: activeImage,
      color: selectedColor.name,
      size: selectedSize,
      quantity: quantity,
      gsm: product.gsm,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const toggleAccordion = (key: 'fabric' | 'size' | 'care' | 'shipping') => {
    setOpenAccordion(openAccordion === key ? null : key);
  };

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 pb-32 lg:pb-16">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono mb-6 overflow-x-auto whitespace-nowrap py-1">
        <Link href="/" className="hover:text-zinc-950 transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3 flex-shrink-0" />
        <Link href="/shop" className="hover:text-zinc-950 transition-colors">Shop</Link>
        <ChevronRight className="w-3 h-3 flex-shrink-0" />
        <span className="text-zinc-900 font-medium truncate max-w-[180px] sm:max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
        {/* Left: Gallery (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-3 sm:gap-4">
          {/* Thumbnails (Horizontal on mobile, vertical column on desktop) */}
          <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto max-h-[580px] no-scrollbar py-1">
            {imagesList.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                  activeImageIndex === idx
                    ? 'border-zinc-950 shadow-sm scale-102 ring-1 ring-zinc-950'
                    : 'border-white/80 hover:border-zinc-300 opacity-70 hover:opacity-100'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                <span className="absolute bottom-1 inset-x-1 text-[7px] sm:text-[8px] font-mono text-center bg-black/60 text-white rounded py-0.5 backdrop-blur-xs truncate">
                  {img.label}
                </span>
              </button>
            ))}
          </div>

          {/* Main High-Res Image View */}
          <div className="relative flex-1 aspect-[3/4] rounded-3xl overflow-hidden bg-white/70 backdrop-blur-xl border border-white shadow-xl shadow-zinc-900/[0.03]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover select-none transition-all duration-300"
            />

            {/* Badges on Top Left */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-col gap-1.5 z-10">
              <span className="bg-white/90 backdrop-blur-md border border-white text-zinc-900 font-mono text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 rounded-full shadow-2xs">
                {product.gsm} GSM FRENCH TERRY
              </span>
              <span className="bg-rose-50/90 backdrop-blur-md border border-rose-200/80 text-rose-700 font-mono text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 rounded-full shadow-2xs">
                Only {product.stockLeft} Left In Stock
              </span>
              {discountPercent && (
                <span className="bg-emerald-600 text-white font-mono text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-0.5 rounded-full shadow-2xs w-max">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Carousel Dots / Counter on Mobile */}
            <div className="absolute bottom-3 left-3 z-10 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-mono">
              {activeImageIndex + 1} / {imagesList.length}
            </div>

            {/* Front / Back Quick Toggle on Image */}
            <div className="absolute bottom-3 right-3 z-10">
              <button
                onClick={() =>
                  setActiveImageIndex(activeImageIndex === 0 ? 1 : 0)
                }
                className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-white text-xs font-mono text-zinc-800 hover:text-black flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95"
              >
                <Layers className="w-3.5 h-3.5 text-rose-500" />
                <span>{activeImageIndex === 0 ? 'Back Graphic' : 'Front View'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Product Buy Box (5 Cols) */}
        <div className="lg:col-span-5 space-y-5 bg-white/70 backdrop-blur-xl border border-white/90 p-5 sm:p-7 rounded-3xl shadow-lg shadow-zinc-900/[0.02]">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-zinc-500 mb-1.5">
              <span className="text-rose-600 font-bold uppercase tracking-wider">
                {product.animeSeries}
              </span>
              <span className="text-zinc-500">{product.fit}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight font-mono">
              {product.name}
            </h1>

            {/* Reviews Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <span className="text-xs font-mono text-zinc-500 font-semibold">4.9 (48 Reviews)</span>
              <span className="text-xs text-zinc-300">•</span>
              <span className="text-[11px] font-mono text-emerald-600 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> VERIFIED DROP
              </span>
            </div>

            {/* Price Box */}
            <div className="flex items-baseline gap-2.5 sm:gap-3 mt-4">
              <span className="text-3xl sm:text-4xl font-black text-zinc-950 font-mono">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-base sm:text-lg text-zinc-400 line-through font-mono">
                  ₹{product.originalPrice}
                </span>
              )}
              {discountPercent && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Save ₹{product.originalPrice ? product.originalPrice - product.price : 0} ({discountPercent}% OFF)
                </span>
              )}
            </div>
            <p className="text-[11px] text-zinc-400 font-mono mt-1">
              MRP inclusive of all taxes. Free shipping over ₹999.
            </p>
          </div>

          {/* Story & Lore */}
          <div className="pt-3 border-t border-zinc-200/50">
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-sans">
              {product.description}
            </p>
          </div>

          {/* Key Highlight Bullets */}
          {product.features && product.features.length > 0 && (
            <div className="pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-zinc-700">
                {product.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-1.5 bg-zinc-50/80 border border-zinc-200/60 rounded-xl px-2.5 py-1.5">
                    <Check className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                    <span className="truncate">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Color Selector */}
          <div className="space-y-2 pt-3 border-t border-zinc-200/50">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-500">COLOR:</span>
              <span className="font-bold text-zinc-900">{selectedColor.name}</span>
            </div>
            <div className="flex items-center gap-2">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color)}
                  style={{ backgroundColor: color.hex }}
                  className={`w-7 h-7 rounded-full border transition-all cursor-pointer ${
                    selectedColor.name === color.name
                      ? 'ring-2 ring-zinc-950 ring-offset-2 ring-offset-white border-white shadow-xs scale-105'
                      : 'border-zinc-300 hover:scale-105'
                  }`}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div className="space-y-2 pt-3 border-t border-zinc-200/50">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-500 font-bold">SELECT SIZE:</span>
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-rose-600 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                <Ruler className="w-3 h-3" />
                <span>Size Guide</span>
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {(product.sizes || ['S', 'M', 'L', 'XL', 'XXL']).map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    selectedSize === size
                      ? 'bg-zinc-950 text-white shadow-md scale-102 ring-1 ring-zinc-950'
                      : 'bg-white text-zinc-700 hover:text-black border border-zinc-200/80 hover:border-zinc-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-zinc-400 font-mono mt-1">
              💡 Boxy streetwear fit. True to oversized measurements.
            </p>
          </div>

          {/* Quantity & Add to Cart (Desktop View) */}
          <div className="space-y-3 pt-3 border-t border-zinc-200/50 hidden lg:block">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-zinc-200/80 rounded-2xl bg-white shadow-2xs p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 text-zinc-500 hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-xs font-mono font-bold text-zinc-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2 text-zinc-500 hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleAddToCart}
                className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                  isAdded
                    ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                    : 'bg-zinc-950 hover:bg-zinc-850 text-white shadow-zinc-950/15'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>ADDED TO BAG!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>ADD TO BAG (₹{product.price * quantity})</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* Delivery & Assurance Pills */}
          <div className="space-y-2 pt-3 border-t border-zinc-200/50 text-xs text-zinc-600 font-mono">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-zinc-900 flex-shrink-0" />
              <span>Free express shipping on all orders above ₹999</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <span>Cash on Delivery (COD) & UPI Available</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span>7-day easy doorstep size exchange guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Accordions: Deep-Dive Information (Mobile & Desktop) */}
      <div className="mt-12 space-y-3 max-w-4xl mx-auto">
        {/* Accordion 1: Fabric & Fit */}
        <div className="rounded-2xl border border-white/80 bg-white/70 backdrop-blur-xl overflow-hidden shadow-xs">
          <button
            onClick={() => toggleAccordion('fabric')}
            className="w-full flex items-center justify-between p-4.5 sm:p-5 text-left font-mono font-bold text-sm text-zinc-900 cursor-pointer"
          >
            <span>FABRIC & CRAFTSMANSHIP SPECS</span>
            <ChevronDown
              className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${
                openAccordion === 'fabric' ? 'rotate-180' : ''
              }`}
            />
          </button>
          <AnimatePresence>
            {openAccordion === 'fabric' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 pt-1 text-xs text-zinc-600 leading-relaxed space-y-2 font-mono">
                  <p>
                    • <strong>Fabric Weight:</strong> {product.gsm} GSM heavy French Terry combed cotton.
                  </p>
                  <p>
                    • <strong>Cut:</strong> {product.fit}. Dropped shoulder seam with high-density ribbed collar that maintains its shape wash after wash.
                  </p>
                  <p>
                    • <strong>Print Technique:</strong> High-density crack-resistant screen print engineered to withstand Indian climate and repeated washes.
                  </p>
                  <p>
                    • <strong>Texture:</strong> Biopolished enzyme wash for ultra-soft skin feel with zero prickliness.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Accordion 2: Size Chart Table */}
        <div className="rounded-2xl border border-white/80 bg-white/70 backdrop-blur-xl overflow-hidden shadow-xs">
          <button
            onClick={() => toggleAccordion('size')}
            className="w-full flex items-center justify-between p-4.5 sm:p-5 text-left font-mono font-bold text-sm text-zinc-900 cursor-pointer"
          >
            <span>SIZE GUIDE (INCHES & CM)</span>
            <ChevronDown
              className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${
                openAccordion === 'size' ? 'rotate-180' : ''
              }`}
            />
          </button>
          <AnimatePresence>
            {openAccordion === 'size' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 pt-1 overflow-x-auto">
                  <table className="w-full text-xs font-mono text-zinc-700 text-left border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-200 text-zinc-900 font-bold">
                        <th className="py-2 pr-3">Size</th>
                        <th className="py-2 px-3">Chest (Inches)</th>
                        <th className="py-2 px-3">Length (Inches)</th>
                        <th className="py-2 px-3">Shoulder (Inches)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      <tr>
                        <td className="py-2 font-bold text-zinc-950">S</td>
                        <td className="py-2 px-3">42&quot;</td>
                        <td className="py-2 px-3">28&quot;</td>
                        <td className="py-2 px-3">21&quot;</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-bold text-zinc-950">M</td>
                        <td className="py-2 px-3">44&quot;</td>
                        <td className="py-2 px-3">29&quot;</td>
                        <td className="py-2 px-3">22&quot;</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-bold text-zinc-950">L</td>
                        <td className="py-2 px-3">46&quot;</td>
                        <td className="py-2 px-3">30&quot;</td>
                        <td className="py-2 px-3">23&quot;</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-bold text-zinc-950">XL</td>
                        <td className="py-2 px-3">48&quot;</td>
                        <td className="py-2 px-3">31&quot;</td>
                        <td className="py-2 px-3">24&quot;</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-bold text-zinc-950">XXL</td>
                        <td className="py-2 px-3">50&quot;</td>
                        <td className="py-2 px-3">32&quot;</td>
                        <td className="py-2 px-3">25&quot;</td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="text-[11px] text-zinc-400 font-mono mt-3">
                    Measurements are taken flat. Tolerance ± 0.5 inches.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Accordion 3: Wash Care */}
        <div className="rounded-2xl border border-white/80 bg-white/70 backdrop-blur-xl overflow-hidden shadow-xs">
          <button
            onClick={() => toggleAccordion('care')}
            className="w-full flex items-center justify-between p-4.5 sm:p-5 text-left font-mono font-bold text-sm text-zinc-900 cursor-pointer"
          >
            <span>WASH & CARE INSTRUCTIONS</span>
            <ChevronDown
              className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${
                openAccordion === 'care' ? 'rotate-180' : ''
              }`}
            />
          </button>
          <AnimatePresence>
            {openAccordion === 'care' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 pt-1 text-xs text-zinc-600 leading-relaxed font-mono space-y-1.5">
                  <p>{product.careInstructions || '• Machine wash cold inside-out with mild liquid detergent.'}</p>
                  <p>• Do not tumble dry on high heat; line dry in shade to preserve artwork vibrancy.</p>
                  <p>• Do not iron directly over the graphic print. Iron inside-out at medium heat.</p>
                  <p>• Do not bleach or use dry cleaning chemicals.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Accordion 4: Shipping & Doorstep Exchanges */}
        <div className="rounded-2xl border border-white/80 bg-white/70 backdrop-blur-xl overflow-hidden shadow-xs">
          <button
            onClick={() => toggleAccordion('shipping')}
            className="w-full flex items-center justify-between p-4.5 sm:p-5 text-left font-mono font-bold text-sm text-zinc-900 cursor-pointer"
          >
            <span>SHIPPING, COD & FREE EXCHANGES</span>
            <ChevronDown
              className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${
                openAccordion === 'shipping' ? 'rotate-180' : ''
              }`}
            />
          </button>
          <AnimatePresence>
            {openAccordion === 'shipping' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 pt-1 text-xs text-zinc-600 leading-relaxed font-mono space-y-2">
                  <p>• <strong>Dispatch:</strong> Orders are dispatched within 24 hours from our Gujarat hub.</p>
                  <p>• <strong>Delivery Timeline:</strong> Metro cities: 2-3 days. Rest of India: 3-5 days.</p>
                  <p>• <strong>Payment Methods:</strong> Cash on Delivery (COD), UPI (Google Pay, PhonePe, Paytm), and Credit/Debit cards.</p>
                  <p>• <strong>Size Exchange:</strong> If the fit isn&apos;t 100% perfect, initiate a doorstep exchange within 7 days. Our courier will pick up the old tee and deliver the new size simultaneously!</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Related Products from Drop */}
      <div className="mt-16 pt-10 border-t border-zinc-200/60">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-mono text-rose-600 font-bold uppercase tracking-wider">RECOMMENDED DROPS</span>
            <h2 className="text-xl sm:text-2xl font-black text-zinc-950 font-mono mt-0.5">COMPLETE YOUR STREETWEAR FIT</h2>
          </div>
          <Link href="/shop" className="text-xs font-mono font-bold text-zinc-900 hover:text-rose-600 flex items-center gap-1">
            VIEW ALL <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
          {relatedProducts.slice(0, 3).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      {/* Floating Mobile Sticky Add to Bag Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-zinc-200 px-4 py-3 shadow-2xl flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-black font-mono text-zinc-950">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-zinc-400 line-through font-mono">₹{product.originalPrice}</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500">
            <span>SIZE:</span>
            <button
              onClick={() => setIsSizeGuideOpen(true)}
              className="font-bold text-zinc-950 bg-zinc-100 border border-zinc-200 px-1.5 py-0.5 rounded cursor-pointer"
            >
              {selectedSize} ▾
            </button>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleAddToCart}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs font-mono tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
            isAdded ? 'bg-emerald-600 text-white' : 'bg-zinc-950 text-white'
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4" />
              <span>ADDED TO BAG!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>ADD TO BAG</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Size Guide Modal */}
      <AnimatePresence>
        {isSizeGuideOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-rose-600" />
                  <h3 className="text-base font-black font-mono text-zinc-950">OVERSIZED FIT SIZE GUIDE</h3>
                </div>
                <button
                  onClick={() => setIsSizeGuideOpen(false)}
                  className="p-1 rounded-full text-zinc-400 hover:text-zinc-950 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-zinc-500 font-mono">
                All measurements are in inches. Our oversized fit is designed with relaxed drop shoulders and extra chest room.
              </p>

              <table className="w-full text-xs font-mono text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-100 text-zinc-900 font-bold">
                    <th className="py-2.5 px-3 rounded-l-xl">Size</th>
                    <th className="py-2.5 px-3">Chest</th>
                    <th className="py-2.5 px-3">Length</th>
                    <th className="py-2.5 px-3 rounded-r-xl">Shoulder</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {['S', 'M', 'L', 'XL', 'XXL'].map((sz, idx) => {
                    const chest = 42 + idx * 2;
                    const length = 28 + idx;
                    const shoulder = 21 + idx;
                    return (
                      <tr key={sz} className={selectedSize === sz ? 'bg-rose-50/70 font-bold' : ''}>
                        <td className="py-2.5 px-3 font-bold text-zinc-950">{sz}</td>
                        <td className="py-2.5 px-3">{chest}&quot;</td>
                        <td className="py-2.5 px-3">{length}&quot;</td>
                        <td className="py-2.5 px-3">{shoulder}&quot;</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="space-y-1.5 pt-2">
                <p className="text-[11px] font-mono text-zinc-600 font-bold">Quick Size Recommendation:</p>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-zinc-500">
                  <div className="bg-zinc-50 p-2 rounded-xl">Height 5&apos;4&quot; - 5&apos;7&quot; → Size S / M</div>
                  <div className="bg-zinc-50 p-2 rounded-xl">Height 5&apos;8&quot; - 5&apos;11&quot; → Size M / L</div>
                  <div className="bg-zinc-50 p-2 rounded-xl">Height 6&apos;0&quot; - 6&apos;2&quot; → Size L / XL</div>
                  <div className="bg-zinc-50 p-2 rounded-xl">Broad / Heavy Build → Size XL / XXL</div>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => setIsSizeGuideOpen(false)}
                  className="w-full py-3 rounded-xl bg-zinc-950 text-white font-mono font-bold text-xs cursor-pointer"
                >
                  GOT IT, CLOSE GUIDE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
