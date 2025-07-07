-- Test if you can update business settings directly
-- This will help us identify if it's a permissions issue

-- First, check your current user and role
SELECT 
  'Current user check' as test_type,
  auth.uid() as current_user_id,
  (SELECT email FROM profiles WHERE id = auth.uid()) as email,
  (SELECT role FROM profiles WHERE id = auth.uid()) as role;

-- Try a simple update
UPDATE business_settings 
SET updated_at = NOW()
WHERE id = 1;

-- Check if the update worked
SELECT 
  'Simple update test' as test_type,
  updated_at,
  CASE 
    WHEN updated_at > NOW() - INTERVAL '1 minute' THEN 'SUCCESS: Update worked'
    ELSE 'FAILED: Update did not work'
  END as result
FROM business_settings 
WHERE id = 1;

-- Try updating email specifically
UPDATE business_settings 
SET 
  email = 'orders@sanjibtextile.com',
  updated_at = NOW()
WHERE id = 1;

-- Verify email update
SELECT 
  'Email update test' as test_type,
  email,
  updated_at,
  'Email update completed' as status
FROM business_settings 
WHERE id = 1;
