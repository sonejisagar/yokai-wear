'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';

interface Props {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailContent({ product, relatedProducts }: Props) {
  const [activeImage, setActiveImage] = useState<string>(product.frontImage);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[1] || product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const { addToCart } = useCart();

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

  const imagesList = [
    { label: 'Front View', url: product.frontImage },
    { label: 'Back Graphic', url: product.backImage },
  ];

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono mb-8">
        <Link href="/" className="hover:text-zinc-950 transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/shop" className="hover:text-zinc-950 transition-colors">Shop</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-zinc-900 font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Gallery (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible">
            {imagesList.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img.url)}
                className={`relative w-20 h-24 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                  activeImage === img.url
                    ? 'border-zinc-950 shadow-sm'
                    : 'border-white/80 hover:border-zinc-300 opacity-70 hover:opacity-100'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                <span className="absolute bottom-1 inset-x-1 text-[8px] font-mono text-center bg-black/60 text-white rounded py-0.5 backdrop-blur-xs">
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
              className="w-full h-full object-cover select-none"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="bg-white/90 backdrop-blur-md border border-white text-zinc-900 font-mono text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
                {product.gsm} GSM FRENCH TERRY
              </span>
              <span className="bg-rose-50/90 backdrop-blur-md border border-rose-200/80 text-rose-700 font-mono text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
                Only {product.stockLeft} Left In Stock
              </span>
            </div>

            {/* View Switcher button on the image */}
            <div className="absolute bottom-4 right-4">
              <button
                onClick={() =>
                  setActiveImage(activeImage === product.frontImage ? product.backImage : product.frontImage)
                }
                className="px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-white text-xs font-mono text-zinc-800 hover:text-black flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95"
              >
                <Layers className="w-3.5 h-3.5 text-rose-500" />
                <span>{activeImage === product.frontImage ? 'View Back Graphic' : 'View Front'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Product Buy Box (5 Cols) */}
        <div className="lg:col-span-5 space-y-6 bg-white/70 backdrop-blur-xl border border-white/90 p-6 sm:p-8 rounded-3xl shadow-lg shadow-zinc-900/[0.02]">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-zinc-500 mb-2">
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
            </div>

            {/* Price Box */}
            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-3xl font-black text-zinc-950 font-mono">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-base text-zinc-400 line-through font-mono">
                  ₹{product.originalPrice}
                </span>
              )}
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Save ₹{product.originalPrice ? product.originalPrice - product.price : 0}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono mt-1">Inclusive of all taxes</p>
          </div>

          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed pt-2 border-t border-zinc-200/50">
            {product.description}
          </p>

          {/* Color Selector */}
          <div className="space-y-2 pt-2 border-t border-zinc-200/50">
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
                  className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
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
          <div className="space-y-2 pt-2 border-t border-zinc-200/50">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-500">SELECT SIZE:</span>
              <Link href="/size-guide" className="text-rose-600 hover:underline flex items-center gap-1 font-semibold">
                Size Guide <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    selectedSize === size
                      ? 'bg-zinc-950 text-white shadow-xs'
                      : 'bg-white text-zinc-700 hover:text-black border border-zinc-200/80 hover:border-zinc-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-zinc-400 font-mono mt-1">
              💡 Tip: True to oversized fit. Size down for regular fit.
            </p>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="space-y-3 pt-3 border-t border-zinc-200/50">
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
          <div className="space-y-2 pt-4 border-t border-zinc-200/50 text-xs text-zinc-600 font-mono">
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

      {/* Product Deep-Dive Tabs */}
      <div className="mt-16 pt-12 border-t border-zinc-200/60 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white shadow-md space-y-2.5">
          <h3 className="font-bold text-base text-zinc-950 font-mono">FABRIC & FIT</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Custom-milled 240-260 GSM French Terry cotton. Enzyme washed for an ultra-soft hand feel with dropped shoulder construction that holds its boxy structure all day.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white shadow-md space-y-2.5">
          <h3 className="font-bold text-base text-zinc-950 font-mono">WASH CARE</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Machine wash inside out in cold water with mild detergent. Do not bleach or tumble dry. Avoid ironing directly on the screen-printed artwork.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white shadow-md space-y-2.5">
          <h3 className="font-bold text-base text-zinc-950 font-mono">SHIPPING & EXCHANGES</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Dispatched within 24 hours. Delivered in 2-4 business days. If the size doesn&apos;t fit right, initiate an instant reverse exchange completely free.
          </p>
        </div>
      </div>

      {/* Related Products from Drop 01 */}
      <div className="mt-20 pt-12 border-t border-zinc-200/60">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-mono text-rose-600 font-bold uppercase tracking-wider">MORE FROM DROP 01</span>
            <h2 className="text-2xl font-black text-zinc-950 font-mono mt-1">YOU MAY ALSO LIKE</h2>
          </div>
          <Link href="/shop" className="text-xs font-mono font-bold text-zinc-900 hover:text-rose-600 flex items-center gap-1">
            VIEW ALL <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </main>
  );
}
