-- First, let's check if the business_settings table exists and has data
SELECT * FROM business_settings;

-- If the table doesn't exist or is empty, let's recreate it properly
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
  primary_color TEXT DEFAULT '#000000',
  secondary_color TEXT DEFAULT '#dc2626',
  font_style TEXT DEFAULT 'bold',
  show_contact_bar BOOLEAN DEFAULT true,
  contact_bar_message TEXT DEFAULT 'Contact us for orders and inquiries',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Insert default settings if they don't exist
INSERT INTO business_settings (id) VALUES (1) 
ON CONFLICT (id) DO UPDATE SET
  business_name = COALESCE(business_settings.business_name, 'Sanjib Textile'),
  phone = COALESCE(business_settings.phone, '+91 7595858158'),
  email = COALESCE(business_settings.email, 'orders@sanjibtextile.com'),
  whatsapp = COALESCE(business_settings.whatsapp, '+91 7595858158'),
  updated_at = NOW();

-- Drop existing policies and recreate them
DROP POLICY IF EXISTS "Anyone can view business settings" ON business_settings;
DROP POLICY IF EXISTS "Admins can update business settings" ON business_settings;

-- Enable RLS
ALTER TABLE business_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for business_settings
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

-- Grant necessary permissions
GRANT SELECT ON business_settings TO anon, authenticated;
GRANT UPDATE ON business_settings TO authenticated;

-- Verify the setup
SELECT 
  'Table exists and has data' as status,
  id,
  business_name,
  phone,
  email,
  whatsapp
FROM business_settings 
WHERE id = 1;
