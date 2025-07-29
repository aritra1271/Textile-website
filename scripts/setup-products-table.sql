-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table for user management
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  product_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table with proper constraints
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL CHECK (length(name) >= 2),
  description TEXT NOT NULL CHECK (length(description) >= 10),
  price DECIMAL(10,2) NOT NULL CHECK (price > 0),
  original_price DECIMAL(10,2) CHECK (original_price IS NULL OR original_price >= price),
  category TEXT NOT NULL,
  colors TEXT[] DEFAULT ARRAY['Black'],
  sizes TEXT[] DEFAULT ARRAY['M'],
  images TEXT[] DEFAULT ARRAY['/placeholder.svg?height=300&width=300'],
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  rating DECIMAL(3,2) DEFAULT 4.5 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0 CHECK (review_count >= 0),
  features TEXT[] DEFAULT ARRAY['High Quality', 'Comfortable Fit'],
  specifications JSONB DEFAULT '{"Material": "Cotton Blend", "Care": "Machine Wash"}',
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  discount_percentage INTEGER DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create business_settings table
CREATE TABLE IF NOT EXISTS business_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  business_name TEXT DEFAULT 'Sanjib Textile',
  tagline TEXT DEFAULT 'Premium Sportswear for Every Athlete',
  description TEXT DEFAULT 'We create premium sportswear that empowers athletes at every level.',
  phone TEXT DEFAULT '+91 7595858158',
  email TEXT DEFAULT 'orders@sanjibtextile.com',
  whatsapp TEXT DEFAULT '+91 7595858158',
  address TEXT DEFAULT 'India',
  logo_url TEXT DEFAULT '',
  hero_title TEXT DEFAULT 'Premium Sportswear for Every Athlete',
  hero_subtitle TEXT DEFAULT 'Discover our collection of high-quality bottom wear designed for performance, comfort, and style.',
  hero_image TEXT DEFAULT '',
  primary_color TEXT DEFAULT '#000000',
  secondary_color TEXT DEFAULT '#dc2626',
  font_style TEXT DEFAULT 'Inter',
  show_contact_bar BOOLEAN DEFAULT TRUE,
  contact_bar_message TEXT DEFAULT 'Free shipping on orders over ₹999',
  facebook_url TEXT DEFAULT 'https://facebook.com/sanjibtextile',
  instagram_url TEXT DEFAULT 'https://instagram.com/sanjibtextile',
  twitter_url TEXT DEFAULT 'https://twitter.com/sanjibtextile',
  linkedin_url TEXT DEFAULT 'https://linkedin.com/company/sanjibtextile',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Create about_content table
CREATE TABLE IF NOT EXISTS about_content (
  id INTEGER PRIMARY KEY DEFAULT 1,
  hero_title TEXT DEFAULT 'About Sanjib Textile',
  hero_subtitle TEXT DEFAULT 'Crafting premium sportswear with passion and precision since our inception.',
  story_title TEXT DEFAULT 'Our Story',
  story_content TEXT DEFAULT 'Founded with a vision to revolutionize athletic wear, Sanjib Textile has been at the forefront of creating premium sportswear that combines style, comfort, and performance.',
  story_image TEXT DEFAULT '',
  values_title TEXT DEFAULT 'Our Values',
  values_subtitle TEXT DEFAULT 'Quality, Innovation, and Customer Satisfaction',
  team_title TEXT DEFAULT 'Our Team',
  team_subtitle TEXT DEFAULT 'Passionate professionals dedicated to excellence',
  contact_title TEXT DEFAULT 'Get In Touch',
  contact_subtitle TEXT DEFAULT 'Ready to elevate your athletic wardrobe? Contact us today.',
  statistics JSONB DEFAULT '{"customers": 10000, "products": 500, "rating": 4.8, "years": 5}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Create wishlists table
CREATE TABLE IF NOT EXISTS wishlists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Create analytics tables
CREATE TABLE IF NOT EXISTS product_views (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address INET DEFAULT '127.0.0.1',
  user_agent TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS website_visits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address INET DEFAULT '127.0.0.1',
  user_agent TEXT,
  page_url TEXT NOT NULL,
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, description, image, is_active) VALUES
('Shorts', 'Athletic shorts for training and casual wear', '/placeholder.svg?height=200&width=200', true),
('Joggers', 'Comfortable joggers for running and fitness', '/placeholder.svg?height=200&width=200', true),
('Leggings', 'Flexible leggings for yoga and workouts', '/placeholder.svg?height=200&width=200', true),
('Track Pants', 'Professional track pants for athletes', '/placeholder.svg?height=200&width=200', true),
('Sweatpants', 'Cozy sweatpants for leisure and comfort', '/placeholder.svg?height=200&width=200', true)
ON CONFLICT (name) DO NOTHING;

-- Insert default business settings
INSERT INTO business_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Insert default about content
INSERT INTO about_content (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Insert some sample products
INSERT INTO products (name, description, price, original_price, category, colors, sizes, images, stock, features, specifications, is_featured) VALUES 
('Premium Athletic Shorts', 'High-performance shorts designed for intense workouts and training sessions. Made with moisture-wicking fabric for maximum comfort.', 1299, 1599, 'Shorts', 
 ARRAY['Black', 'Navy', 'Red'], ARRAY['S', 'M', 'L', 'XL'], 
 ARRAY['/placeholder.svg?height=300&width=300'], 50,
 ARRAY['Moisture-wicking fabric', 'Quick-dry technology', 'Comfortable waistband', 'Side pockets'],
 '{"Material": "Polyester blend", "Care": "Machine washable", "Fit": "Regular", "Weight": "150g"}', true),

('Training Joggers', 'Comfortable joggers perfect for training sessions and casual wear. Features elastic waistband and tapered fit for modern style.', 1899, 2299, 'Joggers',
 ARRAY['Black', 'Grey', 'Navy'], ARRAY['S', 'M', 'L', 'XL', 'XXL'],
 ARRAY['/placeholder.svg?height=300&width=300'], 30,
 ARRAY['Elastic waistband', 'Side pockets', 'Tapered fit', 'Soft cotton blend'],
 '{"Material": "Cotton blend", "Care": "Machine washable", "Fit": "Slim", "Weight": "280g"}', true),

('Compression Leggings', 'High-compression leggings for maximum support during workouts. Perfect for yoga, running, and gym sessions.', 1699, 1999, 'Leggings',
 ARRAY['Black', 'Navy', 'Purple'], ARRAY['XS', 'S', 'M', 'L', 'XL'],
 ARRAY['/placeholder.svg?height=300&width=300'], 40,
 ARRAY['Compression fit', 'Moisture-wicking', 'Four-way stretch', 'High waistband'],
 '{"Material": "Spandex blend", "Care": "Hand wash recommended", "Fit": "Compression", "Weight": "200g"}', false),

('Professional Track Pants', 'Professional-grade track pants for serious athletes. Lightweight and breathable with zippered pockets.', 2199, 2599, 'Track Pants',
 ARRAY['Black', 'Navy', 'Red', 'White'], ARRAY['S', 'M', 'L', 'XL', 'XXL'],
 ARRAY['/placeholder.svg?height=300&width=300'], 25,
 ARRAY['Lightweight fabric', 'Zippered pockets', 'Adjustable waistband', 'Breathable mesh panels'],
 '{"Material": "Polyester", "Care": "Machine washable", "Fit": "Athletic", "Weight": "220g"}', true),

('Cozy Sweatpants', 'Ultra-comfortable sweatpants for relaxation and casual wear. Perfect for lounging or light activities.', 1599, 1899, 'Sweatpants',
 ARRAY['Grey', 'Black', 'Navy'], ARRAY['S', 'M', 'L', 'XL'],
 ARRAY['/placeholder.svg?height=300&width=300'], 35,
 ARRAY['Soft fleece lining', 'Drawstring waist', 'Ribbed cuffs', 'Kangaroo pocket'],
 '{"Material": "Cotton fleece", "Care": "Machine washable", "Fit": "Relaxed", "Weight": "320g"}', false)
ON CONFLICT DO NOTHING;

-- Create function to update category product count
CREATE OR REPLACE FUNCTION update_category_product_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update count for the affected category
  IF TG_OP = 'INSERT' THEN
    UPDATE categories 
    SET product_count = (
      SELECT COUNT(*) FROM products WHERE category = NEW.category AND is_active = true
    )
    WHERE name = NEW.category;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Update old category count
    IF OLD.category != NEW.category THEN
      UPDATE categories 
      SET product_count = (
        SELECT COUNT(*) FROM products WHERE category = OLD.category AND is_active = true
      )
      WHERE name = OLD.category;
    END IF;
    -- Update new category count
    UPDATE categories 
    SET product_count = (
      SELECT COUNT(*) FROM products WHERE category = NEW.category AND is_active = true
    )
    WHERE name = NEW.category;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE categories 
    SET product_count = (
      SELECT COUNT(*) FROM products WHERE category = OLD.category AND is_active = true
    )
    WHERE name = OLD.category;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for category product count
DROP TRIGGER IF EXISTS trigger_update_category_count ON products;
CREATE TRIGGER trigger_update_category_count
  AFTER INSERT OR UPDATE OR DELETE ON products
  FOR EACH ROW EXECUTE FUNCTION update_category_product_count();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_business_settings_updated_at ON business_settings;
CREATE TRIGGER update_business_settings_updated_at
  BEFORE UPDATE ON business_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_about_content_updated_at ON about_content;
CREATE TRIGGER update_about_content_updated_at
  BEFORE UPDATE ON about_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_visits ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
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
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for products
DROP POLICY IF EXISTS "Anyone can view active products" ON products;
CREATE POLICY "Anyone can view active products" ON products
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage products" ON products;
CREATE POLICY "Admins can manage products" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for categories
DROP POLICY IF EXISTS "Anyone can view active categories" ON categories;
CREATE POLICY "Anyone can view active categories" ON categories
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for business_settings
DROP POLICY IF EXISTS "Anyone can view business settings" ON business_settings;
CREATE POLICY "Anyone can view business settings" ON business_settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can update business settings" ON business_settings;
CREATE POLICY "Admins can update business settings" ON business_settings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for about_content
DROP POLICY IF EXISTS "Anyone can view about content" ON about_content;
CREATE POLICY "Anyone can view about content" ON about_content
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can update about content" ON about_content;
CREATE POLICY "Admins can update about content" ON about_content
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for wishlists
DROP POLICY IF EXISTS "Users can view own wishlist" ON wishlists;
CREATE POLICY "Users can view own wishlist" ON wishlists
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own wishlist" ON wishlists;
CREATE POLICY "Users can manage own wishlist" ON wishlists
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for analytics tables
DROP POLICY IF EXISTS "Anyone can insert analytics" ON product_views;
CREATE POLICY "Anyone can insert analytics" ON product_views
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view analytics" ON product_views;
CREATE POLICY "Admins can view analytics" ON product_views
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Anyone can insert visits" ON website_visits;
CREATE POLICY "Anyone can insert visits" ON website_visits
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view visits" ON website_visits;
CREATE POLICY "Admins can view visits" ON website_visits
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_product_id ON wishlists(product_id);
CREATE INDEX IF NOT EXISTS idx_product_views_product_id ON product_views(product_id);
CREATE INDEX IF NOT EXISTS idx_product_views_viewed_at ON product_views(viewed_at);
CREATE INDEX IF NOT EXISTS idx_website_visits_visited_at ON website_visits(visited_at);

-- Update category product counts
UPDATE categories SET product_count = (
  SELECT COUNT(*) FROM products WHERE category = categories.name AND is_active = true
);

-- Insert some sample analytics data
INSERT INTO product_views (product_id, viewed_at) 
SELECT 
  p.id,
  NOW() - (random() * interval '30 days')
FROM products p, generate_series(1, 5) 
ON CONFLICT DO NOTHING;

INSERT INTO website_visits (page_url, visited_at)
VALUES 
  ('/', NOW() - interval '1 hour'),
  ('/products', NOW() - interval '2 hours'),
  ('/about', NOW() - interval '3 hours'),
  ('/categories', NOW() - interval '4 hours')
ON CONFLICT DO NOTHING;
