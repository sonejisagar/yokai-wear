import { notFound } from 'next/navigation';
import { animeProducts } from '@/data/products';
import ProductDetailContent from '@/components/ProductDetailContent';
import type { Metadata } from 'next';
import { Product } from '@/types';
import { createClient } from '@supabase/supabase-js';
import { parseProductDetails } from '@/utils/productDetails';

export function generateStaticParams() {
  return animeProducts.map((product) => ({
    slug: product.slug,
  }));
}

export const instant = false;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

async function getProduct(slug: string): Promise<Product | null> {
  // 1. Try fetching live from Supabase
  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (!error && data) {
        const details = parseProductDetails(data.description);
        return {
          id: data.id,
          name: data.name,
          slug: data.slug,
          price: Number(data.price),
          originalPrice: data.original_price ? Number(data.original_price) : undefined,
          description: details.story || 'Premium 240+ GSM heavyweight oversized anime streetwear tee.',
          subImages: details.subImages,
          features: details.features,
          careInstructions: details.care,
          category: data.category || 'oversized',
          animeSeries: data.anime_series || 'Special Drop',
          fit: data.fit || 'Oversized Boxy Fit',
          gsm: Number(data.gsm) || 240,
          stockLeft: Number(data.stock_left) ?? 15,
          frontImage: data.front_image,
          backImage: data.back_image || data.front_image,
          colors: [
            { name: 'Pitch Black', hex: '#121212' },
            { name: 'Off White', hex: '#f4f4f5' },
          ],
          sizes: details.sizes && details.sizes.length > 0 ? details.sizes : ['S', 'M', 'L', 'XL', 'XXL'],
          inStock: data.in_stock !== false,
          featuredOnHome: Boolean(data.featured_on_home),
        };
      }
    } catch (e) {
      console.warn('Notice querying dynamic product from Supabase:', e);
    }
  }

  // 2. Fallback to local static catalog
  const local = animeProducts.find((p) => p.slug === slug);
  if (local) return local;

  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: 'Product Not Found | YOKAI WEAR',
    };
  }

  return {
    title: `${product.name} | YOKAI WEAR`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = animeProducts.filter((p) => p.id !== product.id).slice(0, 3);

  return <ProductDetailContent product={product} relatedProducts={relatedProducts} />;
}
