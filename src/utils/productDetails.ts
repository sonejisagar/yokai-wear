export interface SubPageDetails {
  story: string;
  subImages: string[];
  features: string[];
  care: string;
  sizes: ('S' | 'M' | 'L' | 'XL' | 'XXL')[];
}

export const DEFAULT_SIZES: ('S' | 'M' | 'L' | 'XL' | 'XXL')[] = ['S', 'M', 'L', 'XL', 'XXL'];

export const DEFAULT_FEATURES: string[] = [
  '240+ GSM Heavyweight French Terry Cotton',
  'High-Density Fade-Resistant Screen Print',
  'Drop-Shoulder Streetwear Boxy Silhouette',
  'Pre-Shrunk Compact Combed Yarn',
];

export const DEFAULT_CARE =
  'Machine wash cold inside-out with mild detergent. Do not iron directly on graphics. Line dry or tumble dry low.';

/**
 * Parses raw product description (which may be JSON or plain text)
 * into structured Sub-Page details.
 */
export function parseProductDetails(rawDescription: string | null | undefined): SubPageDetails {
  if (!rawDescription) {
    return {
      story: 'Premium 240+ GSM heavyweight oversized anime streetwear tee crafted for structural drape and all-day comfort.',
      subImages: [],
      features: DEFAULT_FEATURES,
      care: DEFAULT_CARE,
      sizes: DEFAULT_SIZES,
    };
  }

  try {
    const trimmed = rawDescription.trim();
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      const parsed = JSON.parse(trimmed);
      return {
        story: parsed.story || 'Premium 240+ GSM heavyweight oversized anime streetwear tee.',
        subImages: Array.isArray(parsed.subImages)
          ? parsed.subImages.filter((s: any) => typeof s === 'string' && s.trim().length > 0)
          : [],
        features:
          Array.isArray(parsed.features) && parsed.features.length > 0
            ? parsed.features.filter((f: any) => typeof f === 'string' && f.trim().length > 0)
            : DEFAULT_FEATURES,
        care: parsed.care || DEFAULT_CARE,
        sizes:
          Array.isArray(parsed.sizes) && parsed.sizes.length > 0
            ? parsed.sizes
            : DEFAULT_SIZES,
      };
    }
  } catch (e) {
    // If not JSON, it's legacy plain text
  }

  return {
    story: rawDescription,
    subImages: [],
    features: DEFAULT_FEATURES,
    care: DEFAULT_CARE,
    sizes: DEFAULT_SIZES,
  };
}

/**
 * Packs Sub-Page details into JSON string to store cleanly in description column.
 */
export function packProductDetails(details: SubPageDetails): string {
  return JSON.stringify({
    story: (details.story || '').trim(),
    subImages: (details.subImages || []).map((s) => s.trim()).filter(Boolean),
    features: (details.features || []).map((f) => f.trim()).filter(Boolean),
    care: (details.care || '').trim(),
    sizes: details.sizes && details.sizes.length > 0 ? details.sizes : DEFAULT_SIZES,
  });
}
