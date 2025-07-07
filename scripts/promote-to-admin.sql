-- Check your current user details
SELECT 
  u.id as user_id,
  u.email,
  p.role as current_role,
  p.full_name
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'Sanjib1810@gmail.com';

-- Promote your account to admin
UPDATE profiles 
SET role = 'admin', 
    updated_at = NOW()
WHERE email = 'Sanjib1810@gmail.com';

-- Verify the change worked
SELECT 
  u.id as user_id,
  u.email,
  p.role as new_role,
  p.full_name
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'Sanjib1810@gmail.com';
