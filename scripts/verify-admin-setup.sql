-- Check if you have admin access
SELECT 
  u.id as user_id,
  u.email,
  u.email_confirmed_at,
  p.role,
  p.created_at as profile_created,
  CASE 
    WHEN p.role = 'admin' THEN 'You have admin access ✓'
    WHEN p.role = 'customer' THEN 'You need to be promoted to admin'
    WHEN p.role IS NULL THEN 'Profile not found - need to create profile'
    ELSE 'Unknown role status'
  END as admin_status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'Sanjib1810@gmail.com';

-- If you're not admin, promote yourself
UPDATE profiles 
SET role = 'admin', updated_at = NOW()
WHERE email = 'Sanjib1810@gmail.com' AND role != 'admin';

-- Verify the promotion worked
SELECT 
  'Admin promotion check' as check_type,
  email,
  role,
  CASE 
    WHEN role = 'admin' THEN 'SUCCESS: You are now admin ✓'
    ELSE 'FAILED: Still not admin'
  END as result
FROM profiles 
WHERE email = 'Sanjib1810@gmail.com';
