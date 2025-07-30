-- Complete posts table setup for mini-linkedin
-- Run this entire script in your Supabase SQL Editor

-- Step 1: Create posts table if it doesn't exist
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  is_liked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Step 2: Add foreign key constraint if profiles table exists
-- (This will only work if you have a profiles table)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles') THEN
    -- Add foreign key constraint
    ALTER TABLE posts 
    DROP CONSTRAINT IF EXISTS posts_profile_id_fkey;
    
    ALTER TABLE posts 
    ADD CONSTRAINT posts_profile_id_fkey 
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Step 3: Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Step 4: Drop all existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON posts;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON posts;
DROP POLICY IF EXISTS "Enable update for users based on profile_id" ON posts;
DROP POLICY IF EXISTS "Enable delete for users based on profile_id" ON posts;
DROP POLICY IF EXISTS "Users can view all posts" ON posts;
DROP POLICY IF EXISTS "Users can insert their own posts" ON posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON posts;

-- Step 5: Create new RLS policies
CREATE POLICY "Enable read access for all users" ON posts
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON posts
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Enable update for users based on profile_id" ON posts
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Enable delete for users based on profile_id" ON posts
  FOR DELETE 
  TO authenticated 
  USING (auth.uid() = profile_id);

-- Step 6: Create indexes for performance
CREATE INDEX IF NOT EXISTS posts_profile_id_idx ON posts(profile_id);
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS posts_likes_idx ON posts(likes DESC);

-- Step 7: Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Step 8: Verification queries
SELECT 'Posts table created successfully' as status;

-- Check table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'posts' 
ORDER BY ordinal_position;

-- Check RLS status
SELECT schemaname, tablename, rowsecurity as "RLS Enabled"
FROM pg_tables 
WHERE tablename = 'posts';

-- Check policies
SELECT policyname, cmd, roles
FROM pg_policies 
WHERE tablename = 'posts';

-- Test if current user can insert (this will only work if you're authenticated)
-- SELECT auth.uid() as current_user_id;
