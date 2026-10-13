'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product } from '@/types';
import { animeProducts } from '@/data/products';
import { supabase } from '@/lib/supabase';

interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  heroProduct: Product;
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(animeProducts);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Notice fetching products from Supabase:', error.message);
        setProducts(animeProducts);
      } else if (data && data.length > 0) {
        const formatted: Product[] = data.map((item: any, idx: number) => {
          return {
            id: item.id || `sp-${idx}`,
            name: item.name,
            slug: item.slug || item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            price: Number(item.price),
            originalPrice: item.original_price ? Number(item.original_price) : undefined,
            description: item.description || 'Premium 240+ GSM heavyweight oversized anime streetwear tee.',
            category: item.category || 'oversized',
            animeSeries: item.anime_series || 'Special Drop',
            fit: (item.fit as any) || 'Oversized Boxy Fit',
            gsm: Number(item.gsm) || 240,
            stockLeft: Number(item.stock_left) ?? 15,
            frontImage: item.front_image,
            backImage: item.back_image || item.front_image,
            colors: [
              { name: 'Pitch Black', hex: '#121212' },
              { name: 'Off White', hex: '#f4f4f5' },
            ],
            sizes: ['S', 'M', 'L', 'XL', 'XXL'],
            inStock: item.in_stock !== false,
            isHot: idx === 0,
            isNew: true,
            featuredOnHome: Boolean(item.featured_on_home),
          };
        });
        setProducts(formatted);
      } else {
        setProducts(animeProducts);
      }
    } catch (err) {
      console.warn('Fallback to local catalog:', err);
      setProducts(animeProducts);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Determine hero product: whichever has featuredOnHome: true, else the first product
  const heroProduct = products.find((p) => p.featuredOnHome) || products[0] || animeProducts[0];

  return (
    <ProductContext.Provider
      value={{
        products,
        isLoading,
        heroProduct,
        refreshProducts: fetchProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
