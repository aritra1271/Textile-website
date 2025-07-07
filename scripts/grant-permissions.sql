-- Grant explicit permissions to ensure updates work
GRANT ALL PRIVILEGES ON business_settings TO authenticated;
GRANT ALL PRIVILEGES ON business_settings TO anon;

-- Make sure the sequence (if any) is also accessible
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Check current permissions
SELECT 
  grantee, 
  privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'business_settings';
