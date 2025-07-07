-- First, let's check the current state of auth and profiles
SELECT 
  'Auth Users Check' as check_type,
  COUNT(*) as total_users,
  COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) as confirmed_users,
  COUNT(CASE WHEN email_confirmed_at IS NULL THEN 1 END) as unconfirmed_users
FROM auth.users;

-- Check profiles table
SELECT 
  'Profiles Check' as check_type,
  COUNT(*) as total_profiles
FROM profiles;

-- Check if there are users without profiles
SELECT 
  'Users without profiles' as issue_type,
  u.id,
  u.email,
  u.email_confirmed_at,
  u.created_at
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE p.id IS NULL;

-- Fix: Create profiles for users that don't have them
INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
SELECT 
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', ''),
  'customer',
  u.created_at,
  NOW()
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Confirm all emails (for development)
UPDATE auth.users 
SET email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
    updated_at = NOW()
WHERE email_confirmed_at IS NULL;

-- Make sure your account is admin
UPDATE profiles 
SET role = 'admin', updated_at = NOW()
WHERE email = 'Sanjib1810@gmail.com';

-- Final verification
SELECT 
  'Final Status' as status,
  u.email,
  u.email_confirmed_at IS NOT NULL as email_confirmed,
  p.role,
  p.created_at as profile_created
FROM auth.users u
JOIN profiles p ON u.id = p.id
WHERE u.email = 'Sanjib1810@gmail.com';
