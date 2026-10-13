import { notFound } from 'next/navigation';
import { animeProducts } from '@/data/products';
import ProductDetailContent from '@/components/ProductDetailContent';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return animeProducts.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = animeProducts.find((p) => p.slug === slug);

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
  const product = animeProducts.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = animeProducts.filter((p) => p.id !== product.id).slice(0, 3);

  return <ProductDetailContent product={product} relatedProducts={relatedProducts} />;
}
