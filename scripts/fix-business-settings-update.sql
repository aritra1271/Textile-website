-- Check current business_settings table structure and data
SELECT 
  'Current business settings' as status,
  id, business_name, email, phone, whatsapp, updated_at
FROM business_settings WHERE id = 1;

-- Check if RLS policies are blocking updates
SELECT 
  schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'business_settings';

-- Drop and recreate policies to ensure they work properly
DROP POLICY IF EXISTS "Anyone can view business settings" ON business_settings;
DROP POLICY IF EXISTS "Admins can update business settings" ON business_settings;

-- Create more permissive policies for testing
CREATE POLICY "Public can view business settings" ON business_settings
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can update business settings" ON business_settings
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Alternative: Create admin-only policy (use this if you want stricter control)
-- CREATE POLICY "Admins can update business settings" ON business_settings
--   FOR UPDATE USING (
--     EXISTS (
--       SELECT 1 FROM profiles 
--       WHERE profiles.id = auth.uid() 
--       AND profiles.role = 'admin'
--     )
--   );

-- Test the update directly
UPDATE business_settings 
SET 
  email = 'orders@sanjibtextile.com',
  phone = '+91 7595858158',
  whatsapp = '+91 7595858158',
  updated_at = NOW()
WHERE id = 1;

-- Verify the update worked
SELECT 
  'Update test result' as test_type,
  email, phone, whatsapp, updated_at
FROM business_settings WHERE id = 1;
