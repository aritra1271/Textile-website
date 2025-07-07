-- Update business settings for Sanjib Textile
UPDATE business_settings SET 
  business_name = 'Sanjib Textile',
  tagline = 'Premium Sportswear for Every Athlete',
  description = 'We create premium sportswear that empowers athletes at every level.',
  phone = '+91 7595858158',
  email = 'orders@sanjibtextile.com',
  whatsapp = '+91 7595858158',
  address = 'India',
  hero_title = 'Premium Sportswear for Every Athlete',
  hero_subtitle = 'Discover our collection of high-quality bottom wear designed for performance, comfort, and style. From training to competition, we''ve got you covered.',
  updated_at = NOW()
WHERE id = 1;

-- Update sample products to use Indian Rupees (convert USD to INR approximately)
UPDATE products SET 
  price = ROUND(price * 83, 2),
  original_price = CASE 
    WHEN original_price IS NOT NULL THEN ROUND(original_price * 83, 2)
    ELSE NULL
  END,
  updated_at = NOW();
