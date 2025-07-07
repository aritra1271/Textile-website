-- First, let's see what profiles exist
SELECT id, email, role FROM profiles;

-- Option 1: Update existing profile to admin (recommended)
UPDATE profiles SET role = 'admin' WHERE email = 'Sanjib1810@gmail.com';

-- Option 2: If the above doesn't work, delete and let it recreate
-- DELETE FROM profiles WHERE email = 'Sanjib1810@gmail.com';

-- Option 3: If you know your auth user ID, update by ID
-- UPDATE profiles SET role = 'admin' WHERE id = 'your-auth-user-id';
