-- Manually confirm email for your account (alternative to dashboard settings)
-- Replace 'your-email@example.com' with your actual email

-- First, check if your user exists and email confirmation status
SELECT 
  id, 
  email, 
  email_confirmed_at,
  created_at
FROM auth.users 
WHERE email = 'Sanjib1810@gmail.com';

-- Manually confirm the email if it's not confirmed
UPDATE auth.users 
SET 
  email_confirmed_at = NOW(),
  updated_at = NOW()
WHERE email = 'Sanjib1810@gmail.com' 
  AND email_confirmed_at IS NULL;

-- Verify the email is now confirmed
SELECT 
  id, 
  email, 
  email_confirmed_at,
  'Email confirmed successfully' as status
FROM auth.users 
WHERE email = 'Sanjib1810@gmail.com';
