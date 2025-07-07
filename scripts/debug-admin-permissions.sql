-- Debug script to check admin permissions
-- Check if you are properly set as admin
SELECT 
  u.id as user_id,
  u.email,
  p.role,
  p.created_at as profile_created,
  CASE 
    WHEN p.role = 'admin' THEN 'You have admin access'
    ELSE 'You need admin role'
  END as admin_status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'Sanjib1810@gmail.com';

-- Check if business_settings table has the right structure
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'business_settings'
ORDER BY ordinal_position;

-- Check current business settings
SELECT * FROM business_settings WHERE id = 1;

-- Test if you can update (this should work if you're admin)
UPDATE business_settings 
SET updated_at = NOW()
WHERE id = 1;
