import { supabase } from '@/lib/supabase';
import { animeProducts } from '@/data/products';
import { Product } from '@/types';

// Fetch all products with Supabase remote data or fallback to local
export async function getProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map((item: any) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        price: Number(item.price),
        originalPrice: item.original_price ? Number(item.original_price) : undefined,
        description: item.description,
        category: item.category || 'oversized',
        animeSeries: item.anime_series,
        fit: item.fit || 'Oversized Boxy Fit',
        gsm: item.gsm || 240,
        stockLeft: item.stock_left || 20,
        frontImage: item.front_image,
        backImage: item.back_image,
        colors: [
          { name: 'Pitch Black', hex: '#121212' },
          { name: 'Vintage Washed Grey', hex: '#27272a' },
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        inStock: item.in_stock ?? true,
        isHot: true,
      }));
    }
  } catch (err) {
    console.warn('Supabase products fetch fallback:', err);
  }

  // Fallback to local anime products
  return animeProducts;
}

// Fetch single product by slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (!error && data) {
      return {
        id: data.id,
        name: data.name,
        slug: data.slug,
        price: Number(data.price),
        originalPrice: data.original_price ? Number(data.original_price) : undefined,
        description: data.description,
        category: data.category || 'oversized',
        animeSeries: data.anime_series,
        fit: data.fit || 'Oversized Boxy Fit',
        gsm: data.gsm || 240,
        stockLeft: data.stock_left || 20,
        frontImage: data.front_image,
        backImage: data.back_image,
        colors: [
          { name: 'Pitch Black', hex: '#121212' },
          { name: 'Vintage Washed Grey', hex: '#27272a' },
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        inStock: data.in_stock ?? true,
        isHot: true,
      };
    }
  } catch (err) {
    // fallback
  }

  return animeProducts.find((p) => p.slug === slug) || null;
}
