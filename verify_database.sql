-- Verification queries
-- Run these in Supabase SQL Editor to check your setup

-- 1. Check if profiles table exists and has records
SELECT COUNT(*) as profile_count FROM profiles;

-- 2. Check current user's profile
SELECT id, first_name, last_name, email FROM profiles WHERE id = auth.uid();

-- 3. Check posts table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'posts' 
ORDER BY ordinal_position;

-- 4. Test insert (this should work after running the setup)
-- Replace 'test content' with actual content
-- INSERT INTO posts (profile_id, content) 
-- VALUES (auth.uid(), 'Test post content');

-- 5. Check if any posts exist
SELECT COUNT(*) as posts_count FROM posts;

-- 6. Check RLS policies
SELECT 
  policyname,
  cmd,
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'posts';
