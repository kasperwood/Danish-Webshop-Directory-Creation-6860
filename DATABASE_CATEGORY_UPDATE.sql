-- Update the category from "Bøger og kultur" to "Rejser og oplevelser"

-- First, update the categories table if it exists
UPDATE categories_dk847392 
SET 
  name = 'Rejser og oplevelser',
  slug = 'rejser-og-oplevelser',
  description = 'Rejser, oplevelser og aktiviteter',
  updated_at = NOW()
WHERE slug = 'boeger-og-kultur' OR name = 'Bøger og kultur';

-- If the category doesn't exist, create it
INSERT INTO categories_dk847392 (name, slug, description, sort_order, status, created_at, updated_at)
SELECT 'Rejser og oplevelser', 'rejser-og-oplevelser', 'Rejser, oplevelser og aktiviteter', 9, 'active', NOW(), NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM categories_dk847392 WHERE slug = 'rejser-og-oplevelser'
);

-- Update any webshops that had the old category
UPDATE webshops_dk847392 
SET categories = array_replace(categories, 'boeger-og-kultur', 'rejser-og-oplevelser')
WHERE 'boeger-og-kultur' = ANY(categories);

-- Update menu items
UPDATE menu_items_dk847392 
SET 
  label = 'Rejser og oplevelser',
  slug = 'rejser-og-oplevelser',
  updated_at = NOW()
WHERE slug = 'boeger-og-kultur';

-- Update footer links
UPDATE footer_links_dk847392 
SET 
  label = 'Rejser og oplevelser',
  slug = 'rejser-og-oplevelser',
  updated_at = NOW()
WHERE slug = 'boeger-og-kultur';

-- Verify the changes
SELECT name, slug FROM categories_dk847392 WHERE slug = 'rejser-og-oplevelser';