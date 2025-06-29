-- Debug script to check database structure and fix import issues
-- Run this in your Supabase SQL Editor

-- 1. Check if webshops table exists and its structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'webshops_dk847392'
ORDER BY ordinal_position;

-- 2. Check for any missing columns that might cause import errors
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='webshops_dk847392' AND column_name='categories') 
    THEN 'categories: EXISTS' 
    ELSE 'categories: MISSING' 
  END as categories_status,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='webshops_dk847392' AND column_name='usp_items') 
    THEN 'usp_items: EXISTS' 
    ELSE 'usp_items: MISSING' 
  END as usp_items_status,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='webshops_dk847392' AND column_name='mobilepay_accepted') 
    THEN 'mobilepay_accepted: EXISTS' 
    ELSE 'mobilepay_accepted: MISSING' 
  END as mobilepay_status;

-- 3. Add missing columns if they don't exist
ALTER TABLE webshops_dk847392 
ADD COLUMN IF NOT EXISTS categories TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS usp_items TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS mobilepay_accepted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS headline_bg_color TEXT DEFAULT '#ff0000',
ADD COLUMN IF NOT EXISTS headline_speed INTEGER DEFAULT 10;

-- 4. Check RLS policies that might block inserts
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'webshops_dk847392';

-- 5. Ensure RLS allows inserts for authenticated users
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON webshops_dk847392;
CREATE POLICY "Enable insert for authenticated users only" ON webshops_dk847392
  FOR INSERT WITH CHECK (true);

-- 6. Ensure RLS allows all operations for service role
DROP POLICY IF EXISTS "Enable all operations for service role" ON webshops_dk847392;
CREATE POLICY "Enable all operations for service role" ON webshops_dk847392
  FOR ALL USING (true) WITH CHECK (true);

-- 7. Test insert with minimal data
INSERT INTO webshops_dk847392 (
  name, 
  slug, 
  website_url, 
  status,
  categories,
  usp_items
) VALUES (
  'Test Webshop Import',
  'test-webshop-import',
  'https://test.dk',
  'active',
  ARRAY['elektronik'],
  ARRAY['Test USP']
) ON CONFLICT (slug) DO NOTHING;

-- 8. Verify the test insert worked
SELECT name, slug, categories, usp_items 
FROM webshops_dk847392 
WHERE slug = 'test-webshop-import';

-- 9. Clean up test data
DELETE FROM webshops_dk847392 WHERE slug = 'test-webshop-import';

-- 10. Final verification - show table structure
\d webshops_dk847392