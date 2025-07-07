-- Create products table
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
  stock INTEGER DEFAULT 0,
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

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  product_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create business_settings table
CREATE TABLE IF NOT EXISTS business_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  business_name TEXT DEFAULT 'SportWear',
  tagline TEXT DEFAULT 'Premium Sportswear for Every Athlete',
  description TEXT DEFAULT 'We create premium sportswear that empowers athletes at every level.',
  phone TEXT DEFAULT '+1 (555) 123-4567',
  email TEXT DEFAULT 'orders@sportswear.com',
  whatsapp TEXT DEFAULT '+1 (555) 123-4567',
  address TEXT DEFAULT '123 Sports Ave, Athletic City',
  logo_url TEXT,
  hero_title TEXT DEFAULT 'Premium Sportswear for Every Athlete',
  hero_subtitle TEXT DEFAULT 'Discover our collection of high-quality bottom wear designed for performance, comfort, and style.',
  hero_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for products (public read, admin write)
CREATE POLICY "Anyone can view active products" ON products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage products" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create policies for categories (public read, admin write)
CREATE POLICY "Anyone can view active categories" ON categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create policies for business_settings (public read, admin write)
CREATE POLICY "Anyone can view business settings" ON business_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can update business settings" ON business_settings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Insert default business settings
INSERT INTO business_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Insert sample categories
INSERT INTO categories (name, description, image, product_count) VALUES
  ('Shorts', 'Athletic and casual shorts for all activities', '/placeholder.svg?height=200&width=200', 0),
  ('Joggers', 'Comfortable joggers for training and leisure', '/placeholder.svg?height=200&width=200', 0),
  ('Leggings', 'High-performance leggings for yoga and fitness', '/placeholder.svg?height=200&width=200', 0),
  ('Track Pants', 'Classic track pants for sports and casual wear', '/placeholder.svg?height=200&width=200', 0),
  ('Sweatpants', 'Cozy sweatpants for comfort and style', '/placeholder.svg?height=200&width=200', 0)
ON CONFLICT (name) DO NOTHING;

-- Insert sample products
INSERT INTO products (
  name, description, price, original_price, category, colors, sizes, images, 
  stock, rating, review_count, features, specifications, is_active, is_featured
) VALUES
  (
    'Athletic Performance Shorts',
    'Premium athletic shorts designed for maximum performance and comfort. Made with moisture-wicking fabric and featuring a comfortable elastic waistband.',
    29.99, 39.99, 'Shorts',
    ARRAY['Black', 'Navy', 'Gray'],
    ARRAY['S', 'M', 'L', 'XL'],
    ARRAY['/placeholder.svg?height=300&width=300'],
    25, 4.5, 128,
    ARRAY['Moisture-wicking fabric', 'Elastic waistband', 'Side pockets', 'Quick-dry material'],
    '{"Material": "88% Polyester, 12% Spandex", "Care": "Machine wash cold", "Fit": "Athletic fit"}',
    true, true
  ),
  (
    'Pro Training Joggers',
    'Professional-grade joggers perfect for intense training sessions. Features reinforced knees and breathable fabric technology.',
    49.99, 59.99, 'Joggers',
    ARRAY['Black', 'Navy', 'Charcoal'],
    ARRAY['M', 'L', 'XL', 'XXL'],
    ARRAY['/placeholder.svg?height=300&width=300'],
    15, 4.8, 95,
    ARRAY['Reinforced knees', 'Breathable fabric', 'Adjustable waistband', 'Zippered pockets'],
    '{"Material": "92% Cotton, 8% Elastane", "Care": "Machine wash warm", "Fit": "Regular fit"}',
    true, true
  ),
  (
    'Compression Leggings',
    'High-performance compression leggings designed for yoga, running, and fitness. Provides excellent support and flexibility.',
    34.99, 44.99, 'Leggings',
    ARRAY['Black', 'Navy', 'Purple'],
    ARRAY['XS', 'S', 'M', 'L'],
    ARRAY['/placeholder.svg?height=300&width=300'],
    30, 4.7, 203,
    ARRAY['Compression fit', 'Four-way stretch', 'High waistband', 'Squat-proof fabric'],
    '{"Material": "78% Nylon, 22% Spandex", "Care": "Machine wash cold", "Fit": "Compression fit"}',
    true, true
  ),
  (
    'Casual Track Pants',
    'Comfortable track pants perfect for casual wear and light exercise. Classic design with modern comfort features.',
    39.99, 49.99, 'Track Pants',
    ARRAY['Black', 'Gray', 'Navy'],
    ARRAY['S', 'M', 'L', 'XL', 'XXL'],
    ARRAY['/placeholder.svg?height=300&width=300'],
    20, 4.6, 87,
    ARRAY['Elastic waistband', 'Side stripes', 'Tapered fit', 'Soft fleece lining'],
    '{"Material": "80% Cotton, 20% Polyester", "Care": "Machine wash warm", "Fit": "Relaxed fit"}',
    true, false
  ),
  (
    'Running Shorts Pro',
    'Lightweight running shorts with built-in compression liner. Perfect for long-distance running and high-intensity workouts.',
    24.99, 34.99, 'Shorts',
    ARRAY['Black', 'Blue', 'Red'],
    ARRAY['S', 'M', 'L', 'XL'],
    ARRAY['/placeholder.svg?height=300&width=300'],
    40, 4.4, 156,
    ARRAY['Built-in liner', 'Reflective details', 'Lightweight fabric', 'Split hem design'],
    '{"Material": "100% Polyester", "Care": "Machine wash cold", "Fit": "Athletic fit"}',
    true, false
  ),
  (
    'Yoga Leggings Premium',
    'Ultra-soft yoga leggings with buttery smooth feel. Perfect for yoga, pilates, and meditation practices.',
    44.99, 54.99, 'Leggings',
    ARRAY['Black', 'Sage', 'Mauve'],
    ARRAY['XS', 'S', 'M', 'L', 'XL'],
    ARRAY['/placeholder.svg?height=300&width=300'],
    18, 4.9, 312,
    ARRAY['Buttery soft fabric', 'Non-see-through', 'High waistband', 'Gusseted crotch'],
    '{"Material": "87% Nylon, 13% Lycra", "Care": "Machine wash cold", "Fit": "True to size"}',
    true, true
  )
ON CONFLICT DO NOTHING;

-- Update category product counts
UPDATE categories SET product_count = (
  SELECT COUNT(*) FROM products 
  WHERE products.category = categories.name 
  AND products.is_active = true
);

-- Create function to update category counts when products change
CREATE OR REPLACE FUNCTION update_category_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update count for old category (if updating)
  IF TG_OP = 'UPDATE' AND OLD.category != NEW.category THEN
    UPDATE categories 
    SET product_count = (
      SELECT COUNT(*) FROM products 
      WHERE category = OLD.category AND is_active = true
    )
    WHERE name = OLD.category;
  END IF;
  
  -- Update count for new/current category
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE categories 
    SET product_count = (
      SELECT COUNT(*) FROM products 
      WHERE category = NEW.category AND is_active = true
    )
    WHERE name = NEW.category;
  END IF;
  
  -- Update count for deleted product category
  IF TG_OP = 'DELETE' THEN
    UPDATE categories 
    SET product_count = (
      SELECT COUNT(*) FROM products 
      WHERE category = OLD.category AND is_active = true
    )
    WHERE name = OLD.category;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update category counts
DROP TRIGGER IF EXISTS update_category_count_trigger ON products;
CREATE TRIGGER update_category_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON products
  FOR EACH ROW EXECUTE FUNCTION update_category_count();
