-- TEMPORARY FIX: Disable RLS for testing
-- ⚠️ WARNING: This disables security - only use for development/testing

-- Create posts table (simple version)
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  is_liked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- DISABLE RLS temporarily for testing
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;

-- Create basic indexes
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON posts(created_at DESC);

-- Test the setup
SELECT 'Posts table ready for testing (RLS DISABLED)' as status;

-- Show table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'posts' 
ORDER BY ordinal_position;
