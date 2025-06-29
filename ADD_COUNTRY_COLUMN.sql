-- Add country column to webshops table
-- Run this in your Supabase SQL Editor

-- 1. Add the country column if it doesn't exist
ALTER TABLE webshops_dk847392 
ADD COLUMN IF NOT EXISTS country VARCHAR(20) DEFAULT 'denmark';

-- 2. Update existing webshops based on danish_based field
UPDATE webshops_dk847392 
SET country = CASE 
  WHEN danish_based = true THEN 'denmark'
  ELSE 'denmark'  -- Default to Denmark for all existing records
END
WHERE country IS NULL OR country = '';

-- 3. Add comment to document the field
COMMENT ON COLUMN webshops_dk847392.country IS 'Country of the webshop: denmark, norway, or sweden';

-- 4. Create index for better performance
CREATE INDEX IF NOT EXISTS idx_webshops_country ON webshops_dk847392 (country);

-- 5. Verify the column exists and has data
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default 
FROM information_schema.columns 
WHERE table_name = 'webshops_dk847392' 
AND column_name = 'country';

-- 6. Show sample data to confirm
SELECT id, name, country, danish_based 
FROM webshops_dk847392 
LIMIT 5;

-- 7. Show count by country
SELECT country, COUNT(*) as count
FROM webshops_dk847392 
GROUP BY country
ORDER BY count DESC;