-- Add new headline fields to webshops table
ALTER TABLE webshops_dk847392 
ADD COLUMN IF NOT EXISTS headline_bg_color TEXT DEFAULT '#ff0000',
ADD COLUMN IF NOT EXISTS headline_speed INTEGER DEFAULT 10;

-- Update existing webshops with default values
UPDATE webshops_dk847392 
SET 
    headline_bg_color = '#ff0000',
    headline_speed = 10 
WHERE headline_bg_color IS NULL OR headline_speed IS NULL;

-- Verify the changes
SELECT name, headline_active, headline_text, headline_color, headline_bg_color, headline_speed 
FROM webshops_dk847392 
WHERE headline_active = true 
LIMIT 5;