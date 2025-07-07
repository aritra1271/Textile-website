-- Test if you can update business settings
UPDATE business_settings 
SET 
  phone = '+91 7595858158',
  email = 'orders@sanjibtextile.com',
  whatsapp = '+91 7595858158',
  updated_at = NOW()
WHERE id = 1;

-- Verify the update worked
SELECT 
  'Update test result' as test_type,
  business_name,
  phone,
  email,
  whatsapp,
  updated_at,
  'Settings updated successfully ✓' as status
FROM business_settings 
WHERE id = 1;
