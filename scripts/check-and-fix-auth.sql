-- First, let's check what's in the auth.users table
SELECT id, email, email_confirmed_at, created_at FROM auth.users WHERE email = 'Sanjib1810@gmail.com';

-- Check if profile was created
SELECT id, email, role, created_at FROM profiles WHERE email = 'Sanjib1810@gmail.com';

-- If user exists but email not confirmed, we can manually confirm it
UPDATE auth.users 
SET email_confirmed_at = NOW(), 
    updated_at = NOW()
WHERE email = 'Sanjib1810@gmail.com' AND email_confirmed_at IS NULL;

-- Make sure the profile exists and is admin
INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
SELECT id, email, COALESCE(raw_user_meta_data->>'full_name', ''), 'admin', NOW(), NOW()
FROM auth.users 
WHERE email = 'Sanjib1810@gmail.com'
ON CONFLICT (id) DO UPDATE SET 
  role = 'admin',
  updated_at = NOW();

-- Check final status
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  p.role,
  p.created_at as profile_created
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'Sanjib1810@gmail.com';
