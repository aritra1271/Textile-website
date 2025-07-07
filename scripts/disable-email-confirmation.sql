-- Alternative: Disable email confirmation requirement (for development)
-- This allows login without email confirmation

-- Check current auth settings
SELECT * FROM auth.config;

-- Note: Email confirmation settings are usually managed through Supabase Dashboard
-- Go to Authentication > Settings > Email Auth and disable "Enable email confirmations"
