-- First ensure products table exists with proper structure
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  category TEXT NOT NULL,
  colors TEXT[] DEFAULT '{}',
  sizes TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  stock INTEGER NOT NULL DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 4.5,
  review_count INTEGER DEFAULT 0,
  features TEXT[] DEFAULT '{}',
  specifications JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  discount_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure profiles table exists
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analytics tables for tracking user interactions
CREATE TABLE IF NOT EXISTS product_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  ip_address INET,
  user_agent TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS website_visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  ip_address INET,
  user_agent TEXT,
  page_url TEXT,
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wishlists table if not exists
CREATE TABLE IF NOT EXISTS wishlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Create categories table if not exists
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  product_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create business_settings table if not exists
CREATE TABLE IF NOT EXISTS business_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  business_name TEXT DEFAULT 'Sanjib Textile',
  tagline TEXT DEFAULT 'Premium Sportswear for Every Athlete',
  description TEXT DEFAULT 'We create premium sportswear that empowers athletes at every level.',
  phone TEXT DEFAULT '+91 7595858158',
  email TEXT DEFAULT 'orders@sanjibtextile.com',
  whatsapp TEXT DEFAULT '+91 7595858158',
  address TEXT DEFAULT 'India',
  logo_url TEXT,
  hero_title TEXT DEFAULT 'Premium Sportswear for Every Athlete',
  hero_subtitle TEXT DEFAULT 'Discover our collection of high-quality bottom wear designed for performance, comfort, and style.',
  hero_image TEXT,
  primary_color TEXT,
  secondary_color TEXT,
  font_style TEXT,
  show_contact_bar BOOLEAN DEFAULT true,
  contact_bar_message TEXT,
  facebook_url TEXT DEFAULT 'https://facebook.com/sanjibtextile',
  instagram_url TEXT DEFAULT 'https://instagram.com/sanjibtextile',
  twitter_url TEXT DEFAULT 'https://twitter.com/sanjibtextile',
  linkedin_url TEXT DEFAULT 'https://linkedin.com/company/sanjibtextile',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT single_business_row CHECK (id = 1)
);

-- Insert default business settings
INSERT INTO business_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_product_views_product_id ON product_views(product_id);
CREATE INDEX IF NOT EXISTS idx_product_views_viewed_at ON product_views(viewed_at);
CREATE INDEX IF NOT EXISTS idx_website_visits_visited_at ON website_visits(visited_at);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);

-- Enable RLS
ALTER TABLE product_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for product_views
DROP POLICY IF EXISTS "Anyone can insert product views" ON product_views;
CREATE POLICY "Anyone can insert product views" ON product_views
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view all analytics" ON product_views;
CREATE POLICY "Admins can view all analytics" ON product_views
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create policies for website_visits
DROP POLICY IF EXISTS "Anyone can insert website visits" ON website_visits;
CREATE POLICY "Anyone can insert website visits" ON website_visits
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view all website visits" ON website_visits;
CREATE POLICY "Admins can view all website visits" ON website_visits
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create policies for products
DROP POLICY IF EXISTS "Anyone can view active products" ON products;
CREATE POLICY "Anyone can view active products" ON products
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can view all products" ON products;
CREATE POLICY "Admins can view all products" ON products
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can insert products" ON products;
CREATE POLICY "Admins can insert products" ON products
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update products" ON products;
CREATE POLICY "Admins can update products" ON products
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can delete products" ON products;
CREATE POLICY "Admins can delete products" ON products
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create policies for profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create policies for wishlists
DROP POLICY IF EXISTS "Users can view own wishlist" ON wishlists;
CREATE POLICY "Users can view own wishlist" ON wishlists
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own wishlist" ON wishlists;
CREATE POLICY "Users can manage own wishlist" ON wishlists
  FOR ALL USING (auth.uid() = user_id);

-- Create policies for categories
DROP POLICY IF EXISTS "Anyone can view active categories" ON categories;
CREATE POLICY "Anyone can view active categories" ON categories
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create policies for business_settings
DROP POLICY IF EXISTS "Anyone can view business settings" ON business_settings;
CREATE POLICY "Anyone can view business settings" ON business_settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can update business settings" ON business_settings;
CREATE POLICY "Admins can update business settings" ON business_settings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Add about_content table for dynamic about page
CREATE TABLE IF NOT EXISTS about_content (
  id INTEGER PRIMARY KEY DEFAULT 1,
  hero_title TEXT DEFAULT 'About Our Brand',
  hero_subtitle TEXT DEFAULT 'We''re passionate about creating premium sportswear that empowers athletes at every level.',
  story_title TEXT DEFAULT 'Our Story',
  story_content TEXT DEFAULT 'Founded in 2020, our company began with a simple mission: to create affordable, high-quality sportswear that doesn''t compromise on performance or style. As athletes ourselves, we understood the frustration of finding bottom wear that truly met our needs.',
  story_image TEXT,
  values_title TEXT DEFAULT 'Our Values',
  values_subtitle TEXT DEFAULT 'The principles that guide everything we do',
  team_title TEXT DEFAULT 'Meet Our Team',
  team_subtitle TEXT DEFAULT 'The passionate people behind our brand',
  contact_title TEXT DEFAULT 'Ready to Experience the Difference?',
  contact_subtitle TEXT DEFAULT 'Join thousands of satisfied customers who trust our sportswear for their athletic journey',
  statistics JSONB DEFAULT '{"customers": 10000, "products": 50, "rating": 4.8, "years": 3}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT single_about_row CHECK (id = 1)
);

-- Insert default about content
INSERT INTO about_content (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Enable RLS for about_content
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;

-- Create policies for about_content
DROP POLICY IF EXISTS "Anyone can view about content" ON about_content;
CREATE POLICY "Anyone can view about content" ON about_content
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can update about content" ON about_content;
CREATE POLICY "Admins can update about content" ON about_content
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Insert some sample categories
INSERT INTO categories (name, description, image) VALUES 
('Shorts', 'Athletic shorts for training and sports', '/placeholder.svg?height=200&width=200'),
('Joggers', 'Comfortable joggers for everyday wear', '/placeholder.svg?height=200&width=200'),
('Leggings', 'High-performance leggings', '/placeholder.svg?height=200&width=200'),
('Track Pants', 'Professional track pants', '/placeholder.svg?height=200&width=200'),
('Sweatpants', 'Cozy sweatpants for relaxation', '/placeholder.svg?height=200&width=200')
ON CONFLICT (name) DO NOTHING;

-- Insert some sample products
INSERT INTO products (name, description, price, original_price, category, colors, sizes, images, stock, features, specifications) VALUES 
('Premium Athletic Shorts', 'High-performance shorts designed for intense workouts', 1299, 1599, 'Shorts', 
 ARRAY['Black', 'Navy', 'Red'], ARRAY['S', 'M', 'L', 'XL'], 
 ARRAY['/placeholder.svg?height=300&width=300'], 50,
 ARRAY['Moisture-wicking fabric', 'Quick-dry technology', 'Comfortable waistband'],
 '{"Material": "Polyester blend", "Care": "Machine washable", "Fit": "Regular"}'),
('Training Joggers', 'Comfortable joggers perfect for training sessions', 1899, 2299, 'Joggers',
 ARRAY['Black', 'Grey', 'Navy'], ARRAY['S', 'M', 'L', 'XL', 'XXL'],
 ARRAY['/placeholder.svg?height=300&width=300'], 30,
 ARRAY['Elastic waistband', 'Side pockets', 'Tapered fit'],
 '{"Material": "Cotton blend", "Care": "Machine washable", "Fit": "Slim"}'),
('Compression Leggings', 'High-compression leggings for maximum support', 1699, 1999, 'Leggings',
 ARRAY['Black', 'Navy', 'Purple'], ARRAY['XS', 'S', 'M', 'L', 'XL'],
 ARRAY['/placeholder.svg?height=300&width=300'], 40,
 ARRAY['Compression fit', 'Moisture-wicking', 'Four-way stretch'],
 '{"Material": "Spandex blend", "Care": "Hand wash recommended", "Fit": "Compression"}')
ON CONFLICT DO NOTHING;
