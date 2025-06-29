# Database Fix: Add Categories Column

## Problem
The `webshops_dk847392` table is missing the `categories` column, which is needed to store multiple categories per webshop.

## Solution
Run this SQL in your Supabase SQL Editor:

```sql
-- Add categories column to webshops table
ALTER TABLE webshops_dk847392 
ADD COLUMN IF NOT EXISTS categories TEXT[] DEFAULT '{}';

-- Add index for better performance when filtering by categories
CREATE INDEX IF NOT EXISTS idx_webshops_categories 
ON webshops_dk847392 USING GIN (categories);

-- Update existing webshops to have at least one category based on their content
-- You can customize these updates based on your existing data

-- Example: Set default categories for existing webshops
UPDATE webshops_dk847392 
SET categories = ARRAY['elektronik'] 
WHERE name ILIKE '%proshop%' OR name ILIKE '%power%' OR name ILIKE '%elgiganten%';

UPDATE webshops_dk847392 
SET categories = ARRAY['herremode'] 
WHERE name ILIKE '%wavell%' OR name ILIKE '%selected%' OR name ILIKE '%jack%jones%';

UPDATE webshops_dk847392 
SET categories = ARRAY['damemode'] 
WHERE name ILIKE '%vero%' OR name ILIKE '%vila%' OR name ILIKE '%only%';

UPDATE webshops_dk847392 
SET categories = ARRAY['boern'] 
WHERE name ILIKE '%babysam%' OR name ILIKE '%baby%' OR name ILIKE '%børn%';

UPDATE webshops_dk847392 
SET categories = ARRAY['voksen'] 
WHERE name ILIKE '%sinful%' OR name ILIKE '%erotik%';

-- Set default category for any webshops without categories
UPDATE webshops_dk847392 
SET categories = ARRAY['elektronik'] 
WHERE categories = '{}' OR categories IS NULL;

-- Verify the changes
SELECT name, categories FROM webshops_dk847392 LIMIT 10;
```

## Alternative: If you prefer a single category approach
If you want to keep it simple with just one category per webshop, use this instead:

```sql
-- Add single category column instead
ALTER TABLE webshops_dk847392 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'elektronik';

-- Add index
CREATE INDEX IF NOT EXISTS idx_webshops_category 
ON webshops_dk847392 (category);
```

## After running the SQL
1. Go to your Supabase dashboard
2. Navigate to "SQL Editor"
3. Paste and run the SQL above
4. The webshop creation should now work properly