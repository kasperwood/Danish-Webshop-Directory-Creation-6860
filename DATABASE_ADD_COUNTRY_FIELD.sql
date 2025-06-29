-- Add country field to webshops table
ALTER TABLE webshops_dk847392 
ADD COLUMN IF NOT EXISTS country VARCHAR(20) DEFAULT 'denmark';

-- Update existing webshops based on danish_based field
UPDATE webshops_dk847392 
SET country = CASE 
  WHEN danish_based = true THEN 'denmark'
  ELSE 'denmark'  -- Default to Denmark for all existing records
END
WHERE country IS NULL;

-- Add comment to document the field
COMMENT ON COLUMN webshops_dk847392.country IS 'Country of the webshop: denmark, norway, or sweden';

-- Verify the changes
SELECT name, country, danish_based FROM webshops_dk847392 LIMIT 5;