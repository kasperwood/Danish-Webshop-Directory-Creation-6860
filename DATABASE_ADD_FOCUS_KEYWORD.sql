-- Add focus_keyword column to blog posts table
-- Run this in your Supabase SQL Editor

-- Add the focus_keyword column to blog posts
ALTER TABLE blog_posts_dk847392 
ADD COLUMN IF NOT EXISTS focus_keyword TEXT;

-- Add comment to document the field
COMMENT ON COLUMN blog_posts_dk847392.focus_keyword IS 'Primary keyword the article should rank for in search engines';

-- Add index for better performance when searching by focus keyword
CREATE INDEX IF NOT EXISTS idx_blog_posts_focus_keyword 
ON blog_posts_dk847392 (focus_keyword);

-- Verify the changes
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'blog_posts_dk847392' 
AND column_name = 'focus_keyword';

-- Show sample data to confirm structure
SELECT id, title, focus_keyword
FROM blog_posts_dk847392 
LIMIT 3;