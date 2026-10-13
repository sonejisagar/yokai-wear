'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Sparkles, Check, Flame, Layers } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[1] || product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [isHovered, setIsHovered] = useState(false);
  const [showBackView, setShowBackView] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: `${product.id}-${selectedColor.name}-${selectedSize}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: showBackView ? product.backImage : product.frontImage,
      color: selectedColor.name,
      size: selectedSize,
      quantity: 1,
      gsm: product.gsm,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowBackView(false);
      }}
      className="group relative flex flex-col rounded-3xl bg-white/70 backdrop-blur-xl border border-white/90 shadow-md shadow-zinc-900/[0.03] hover:shadow-xl hover:bg-white/85 overflow-hidden transition-all duration-300"
    >
      {/* Clickable Image Container linking to Product Detail Page */}
      <Link href={`/products/${product.slug}`} className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-100/80 block">
        {/* Front / Back Image Cross-fade */}
        <AnimatePresence mode="wait">
          <motion.img
            key={showBackView || isHovered ? 'back' : 'front'}
            src={showBackView || isHovered ? product.backImage : product.frontImage}
            alt={product.name}
            initial={{ opacity: 0.88, scale: 1 }}
            animate={{ opacity: 1, scale: isHovered ? 1.04 : 1 }}
            exit={{ opacity: 0.88 }}
            transition={{ duration: 0.35 }}
            className="w-full h-full object-cover object-center select-none"
          />
        </AnimatePresence>

        {/* Frosted Badges on Top Left */}
        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex flex-col gap-1.5 z-10">
          {product.isHot && (
            <span className="flex items-center gap-1 bg-white/90 backdrop-blur-md border border-white text-rose-600 text-[9px] sm:text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
              <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-rose-500 text-rose-500" /> POPULAR
            </span>
          )}
          {product.isNew && (
            <span className="flex items-center gap-1 bg-white/90 backdrop-blur-md border border-white text-zinc-900 text-[9px] sm:text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
              <Sparkles className="w-2.5 h-2.5 text-amber-500" /> DROP 01
            </span>
          )}
          {discountPercent && (
            <span className="bg-emerald-500 text-white text-[9px] sm:text-[10px] font-mono font-black px-2 py-0.5 rounded-full w-max shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
          <span className="bg-white/85 backdrop-blur-md border border-white text-zinc-700 text-[9px] sm:text-[10px] font-mono font-bold px-2 py-0.5 rounded-full w-max shadow-xs">
            {product.gsm} GSM
          </span>
        </div>


        {/* Frosted Graphic Switcher Pill */}
        <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 z-10">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowBackView(!showBackView);
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-white text-[9px] sm:text-[10px] font-mono text-zinc-800 hover:text-black transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <Layers className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-rose-500" />
            <span>{showBackView || isHovered ? 'Back Graphic' : 'Front View'}</span>
          </button>
        </div>

        {/* Scarcity Pill */}
        <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 z-10">
          <span className="text-[9px] sm:text-[10px] font-mono bg-rose-50/90 backdrop-blur-md border border-rose-200/80 text-rose-700 px-2 py-0.5 rounded-full shadow-xs">
            Only {product.stockLeft} left
          </span>
        </div>
      </Link>

      {/* Details Section */}
      <div className="p-3 sm:p-5 flex flex-col flex-1 justify-between gap-2 sm:gap-2.5">
        <div>
          {/* Anime Series Tag */}
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 mb-1">
            <span className="text-rose-600 font-semibold tracking-wide">
              {product.animeSeries}
            </span>
            <span className="text-[10px] text-zinc-400">
              {product.fit}
            </span>
          </div>

          {/* Product Name linking to Product Detail */}
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="font-bold text-sm sm:text-base text-zinc-900 hover:text-rose-600 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-[11px] sm:text-xs text-zinc-500 mt-0.5 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Color Swatches */}
        <div className="flex items-center gap-1.5 pt-1">
          <span className="text-[9px] text-zinc-400 font-mono">COLOR:</span>
          <div className="flex items-center gap-1.5">
            {product.colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color)}
                title={color.name}
                style={{ backgroundColor: color.hex }}
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border transition-all cursor-pointer ${
                  selectedColor.name === color.name
                    ? 'ring-2 ring-zinc-950 ring-offset-2 ring-offset-white border-white shadow-xs'
                    : 'border-zinc-300 hover:scale-110'
                }`}
              />
            ))}
          </div>
          <span className="text-[9px] text-zinc-500 font-mono ml-auto truncate max-w-[120px]">
            {selectedColor.name}
          </span>
        </div>

        {/* Size Selector Pills */}
        <div className="flex items-center justify-between gap-1 pt-1.5 border-t border-zinc-200/50">
          <span className="text-[9px] text-zinc-400 font-mono flex-shrink-0">SIZE:</span>
          <div className="flex gap-1 overflow-x-auto no-scrollbar py-0.5">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedSize(size);
                }}
                className={`px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[10px] font-mono font-bold rounded-lg transition-all flex-shrink-0 cursor-pointer ${
                  selectedSize === size
                    ? 'bg-zinc-950 text-white shadow-xs'
                    : 'bg-white/80 text-zinc-600 hover:text-zinc-900 border border-zinc-200/70 hover:bg-white'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Price & Add to Bag in ₹ */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-200/50 gap-1.5">
          <div className="flex flex-col min-w-0">
            <div className="flex items-baseline gap-1 sm:gap-1.5">
              <span className="text-sm sm:text-lg font-black text-zinc-950 font-mono">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-[10px] sm:text-xs text-zinc-400 line-through font-mono">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            {discountPercent && (
              <span className="text-[9px] sm:text-[10px] font-mono font-bold text-emerald-600 truncate">
                Save ₹{product.originalPrice! - product.price} ({discountPercent}%)
              </span>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={handleAddToCart}
            className={`px-2.5 sm:px-4 py-2 rounded-2xl text-[10px] sm:text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs flex-shrink-0 ${
              isAdded
                ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                : 'bg-zinc-950 hover:bg-zinc-800 text-white shadow-zinc-900/10'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>ADDED</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden xs:inline">ADD TO BAG</span>
                <span className="xs:hidden">ADD</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
