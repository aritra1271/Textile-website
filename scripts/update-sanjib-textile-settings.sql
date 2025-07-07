-- Update business settings for Sanjib Textile with enhanced customization
UPDATE business_settings SET 
  business_name = 'Sanjib Textile',
  tagline = 'Premium Sportswear for Every Athlete',
  description = 'We create premium sportswear that empowers athletes at every level. From training to competition, we''ve got you covered.',
  phone = '+91 7595858158',
  email = 'orders@sanjibtextile.com',
  whatsapp = '+91 7595858158',
  address = 'India',
  hero_title = 'Premium Sportswear for Every Athlete',
  hero_subtitle = 'Discover our collection of high-quality bottom wear designed for performance, comfort, and style. From training to competition, we''ve got you covered.',
  updated_at = NOW()
WHERE id = 1;

-- Convert all product prices from USD to INR (approximate conversion rate: 1 USD = 83 INR)
UPDATE products SET 
  price = ROUND(price * 83, 0),
  original_price = CASE 
    WHEN original_price IS NOT NULL THEN ROUND(original_price * 83, 0)
    ELSE NULL
  END,
  updated_at = NOW()
WHERE price < 1000; -- Only update if prices are still in USD range

-- Add more customizable fields to business_settings if they don't exist
ALTER TABLE business_settings 
ADD COLUMN IF NOT EXISTS primary_color TEXT DEFAULT '#000000',
ADD COLUMN IF NOT EXISTS secondary_color TEXT DEFAULT '#dc2626',
ADD COLUMN IF NOT EXISTS font_style TEXT DEFAULT 'bold',
ADD COLUMN IF NOT EXISTS show_contact_bar BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS contact_bar_message TEXT DEFAULT 'Contact us for orders and inquiries';

-- Update with Sanjib Textile branding colors
UPDATE business_settings SET 
  primary_color = '#000000',
  secondary_color = '#dc2626',
  font_style = 'bold',
  show_contact_bar = true,
  contact_bar_message = 'Contact us for orders and inquiries'
WHERE id = 1;

-- Create admin user (you'll need to replace with your actual email after signup)
-- This is just a template - run this after you create your account
-- UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
