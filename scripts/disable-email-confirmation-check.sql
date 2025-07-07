-- Check current auth configuration
-- Note: This query might not work in all Supabase setups
-- The main way to disable email confirmation is through the Supabase Dashboard

-- Alternative: Manually confirm all existing users
UPDATE auth.users 
SET 
  email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
  updated_at = NOW()
WHERE email_confirmed_at IS NULL;

-- Check if all users are now confirmed
SELECT 
  email,
  email_confirmed_at IS NOT NULL as is_confirmed,
  created_at
FROM auth.users
ORDER BY created_at DESC;
