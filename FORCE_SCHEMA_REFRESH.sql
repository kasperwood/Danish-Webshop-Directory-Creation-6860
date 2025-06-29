-- Force schema refresh by making a simple change
-- Run this in Supabase SQL Editor

-- First, verify the columns exist
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'webshops_dk847392' 
ORDER BY ordinal_position;

-- Add the columns if they don't exist
ALTER TABLE webshops_dk847392 
ADD COLUMN IF NOT EXISTS headline_bg_color TEXT DEFAULT '#ff0000',
ADD COLUMN IF NOT EXISTS headline_speed INTEGER DEFAULT 10;

-- Force a table modification to refresh cache
ALTER TABLE webshops_dk847392 
ALTER COLUMN updated_at SET DEFAULT NOW();

-- Update a test record to trigger cache refresh
UPDATE webshops_dk847392 
SET updated_at = NOW() 
WHERE id = (SELECT id FROM webshops_dk847392 LIMIT 1);

-- Final verification
SELECT name, headline_active, headline_text, headline_color, headline_bg_color, headline_speed 
FROM webshops_dk847392 
LIMIT 3;