-- =========================================================================
-- YOKAI WEAR - SUPABASE COMPLETE DATABASE SETUP SCRIPT
-- Copy and paste this into your Supabase Dashboard -> SQL Editor and click RUN
-- =========================================================================

-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  description TEXT,
  category TEXT DEFAULT 'oversized',
  anime_series TEXT NOT NULL,
  fit TEXT DEFAULT 'Oversized Boxy Fit',
  gsm INTEGER DEFAULT 240,
  stock_left INTEGER DEFAULT 20,
  front_image TEXT NOT NULL,
  back_image TEXT NOT NULL,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  city TEXT NOT NULL,
  pincode TEXT NOT NULL,
  total_amount NUMERIC NOT NULL,
  payment_method TEXT DEFAULT 'COD',
  status TEXT DEFAULT 'Confirmed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price NUMERIC NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 5. Set Security Policies (Safe Re-run)
DROP POLICY IF EXISTS "Allow public read products" ON products;
CREATE POLICY "Allow public read products" ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert products" ON products;
CREATE POLICY "Allow public insert products" ON products FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public order placement" ON orders;
CREATE POLICY "Allow public order placement" ON orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read orders" ON orders;
CREATE POLICY "Allow reading orders" ON orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public update orders" ON orders;
CREATE POLICY "Allow public update orders" ON orders FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public order items" ON order_items;
CREATE POLICY "Allow public order items" ON order_items FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read order items" ON order_items;
CREATE POLICY "Allow public read order items" ON order_items FOR SELECT USING (true);

-- 6. Insert Drop 01 Initial Products into Supabase
INSERT INTO products (name, slug, price, original_price, anime_series, category, gsm, stock_left, front_image, back_image, description)
VALUES
(
  'LIMITLESS // SIX EYES OVERSIZED TEE',
  'limitless-six-eyes-oversized',
  899,
  1299,
  'Jujutsu Special',
  'oversized',
  240,
  14,
  'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=700&auto=format&fit=crop&q=80',
  'High-density puff print on front chest with massive back graphic. Crafted from 240 GSM heavy combed cotton with pre-washed vintage texture.'
),
(
  'CURSED SWORDSMAN // ECLIPSE HEAVY TEE',
  'cursed-swordsman-eclipse',
  999,
  1499,
  'Dark Swordsman',
  'acid-wash',
  260,
  9,
  'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=700&auto=format&fit=crop&q=80',
  'Dark fantasy distressed manga back print. Acid-washed 260 GSM fabric with raw dropped shoulders for the ultimate streetwear drape.'
),
(
  'SHADOW MONARCH // ARISE GRAPHIC TEE',
  'shadow-monarch-arise',
  849,
  1199,
  'Monarch Awakening',
  'graphic-tees',
  240,
  18,
  'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=700&auto=format&fit=crop&q=80',
  'Electric violet shadow army print. Crack-resistant screen printing with ribbed crewneck collar that never sags.'
),
(
  'CROW GENJUTSU // CRIMSON EYE TEE',
  'crow-genjutsu-crimson-eye',
  899,
  1299,
  'Shinobi Clan',
  'oversized',
  240,
  11,
  'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=700&auto=format&fit=crop&q=80',
  'Iconic crimson crow illusion artwork on the back. Breathable water-based ink that blends straight into the 240 GSM organic cotton.'
),
(
  'THREE SWORD STYLE // ASHURA TEE',
  'three-sword-style-ashura',
  899,
  1249,
  'Pirate Hunter',
  'graphic-tees',
  240,
  16,
  'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=700&auto=format&fit=crop&q=80',
  'Green beast aura illustration with minimal chest katana embroidery. Built for daily casual wear with true oversized drop shoulders.'
),
(
  'SUN BREATHING // FLAME DANCE TEE',
  'sun-breathing-flame-dance',
  949,
  1399,
  'Demon Slayer Corps',
  'acid-wash',
  250,
  7,
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=700&auto=format&fit=crop&q=80',
  'Striking flame dragon sword stroke graphic. Heavyweight 250 GSM premium cotton, pre-shrunk to guarantee no shrinkage after washing.'
)
ON CONFLICT (slug) DO NOTHING;
