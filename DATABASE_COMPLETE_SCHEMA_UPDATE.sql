-- Complete schema update for webshops table
-- Run this to ensure all required columns exist

-- Add MobilePay field
ALTER TABLE webshops_dk847392 
ADD COLUMN IF NOT EXISTS mobilepay_accepted BOOLEAN DEFAULT false;

-- Add enhanced headline fields
ALTER TABLE webshops_dk847392 
ADD COLUMN IF NOT EXISTS headline_bg_color TEXT DEFAULT '#ff0000',
ADD COLUMN IF NOT EXISTS headline_speed INTEGER DEFAULT 10;

-- Add USP items field if not exists
ALTER TABLE webshops_dk847392 
ADD COLUMN IF NOT EXISTS usp_items TEXT[] DEFAULT '{}';

-- Add categories field if not exists
ALTER TABLE webshops_dk847392 
ADD COLUMN IF NOT EXISTS categories TEXT[] DEFAULT '{}';

-- Add index for better performance when filtering by categories
CREATE INDEX IF NOT EXISTS idx_webshops_categories ON webshops_dk847392 USING GIN (categories);

-- Update existing webshops with default values where NULL
UPDATE webshops_dk847392 
SET 
    mobilepay_accepted = COALESCE(mobilepay_accepted, false),
    headline_bg_color = COALESCE(headline_bg_color, '#ff0000'),
    headline_speed = COALESCE(headline_speed, 10),
    usp_items = COALESCE(usp_items, '{}'),
    categories = COALESCE(categories, '{}')
WHERE 
    mobilepay_accepted IS NULL 
    OR headline_bg_color IS NULL 
    OR headline_speed IS NULL 
    OR usp_items IS NULL 
    OR categories IS NULL;

-- Add comments to document the columns
COMMENT ON COLUMN webshops_dk847392.mobilepay_accepted IS 'Indicates whether the webshop accepts MobilePay payments';
COMMENT ON COLUMN webshops_dk847392.headline_bg_color IS 'Background color for the running headline banner';
COMMENT ON COLUMN webshops_dk847392.headline_speed IS 'Speed in seconds for one complete marquee cycle';
COMMENT ON COLUMN webshops_dk847392.usp_items IS 'Array of unique selling points displayed on webshop cards';
COMMENT ON COLUMN webshops_dk847392.categories IS 'Array of category slugs this webshop belongs to';

-- Verify all columns exist
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'webshops_dk847392' 
AND column_name IN ('mobilepay_accepted', 'headline_bg_color', 'headline_speed', 'usp_items', 'categories')
ORDER BY column_name;