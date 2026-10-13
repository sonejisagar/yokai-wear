export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number; // in INR (₹)
  originalPrice?: number;
  description: string;
  category: 'all' | 'oversized' | 'acid-wash' | 'graphic-tees';
  animeSeries: string;
  fit: 'Oversized Boxy Fit' | 'Drop Shoulder Relaxed';
  gsm: number; // e.g. 240 GSM, 260 GSM
  stockLeft: number; // Limited stock indicator for startup exclusivity
  frontImage: string;
  backImage: string;
  colors: { name: string; hex: string }[];
  sizes: ('S' | 'M' | 'L' | 'XL' | 'XXL')[];
  inStock: boolean;
  isHot?: boolean;
  isNew?: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
  gsm?: number;
}
