import { notFound } from 'next/navigation';
import { animeProducts } from '@/data/products';
import ProductDetailContent from '@/components/ProductDetailContent';
import type { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { Product } from '@/types';

export function generateStaticParams() {
  return animeProducts.map((product) => ({
    slug: product.slug,
  }));
}

async function getProduct(slug: string): Promise<Product | null> {
  const local = animeProducts.find((p) => p.slug === slug);
  if (local) return local;

  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data } = await supabase.from('products').select('*').eq('slug', slug).single();
    if (data) {
      return {
        id: data.id,
        name: data.name,
        slug: data.slug,
        price: Number(data.price),
        originalPrice: data.original_price ? Number(data.original_price) : undefined,
        description: data.description || 'Premium 240+ GSM heavyweight oversized anime streetwear tee.',
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
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        inStock: data.in_stock !== false,
        featuredOnHome: Boolean(data.featured_on_home),
      };
    }
  } catch (e) {
    console.warn('Could not fetch dynamic product:', e);
  }

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
