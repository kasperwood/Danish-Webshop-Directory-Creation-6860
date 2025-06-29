-- Fix blog categories table creation issue
-- Run this in your Supabase SQL Editor

-- Create blog categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS blog_categories_dk847392 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3b82f6',
  icon TEXT DEFAULT 'FiTag',
  sort_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Constraints
  CONSTRAINT valid_slug_format CHECK (slug ~ '^[a-z0-9-]+$'),
  CONSTRAINT name_not_empty CHECK (length(trim(name)) > 0)
);

-- Enable RLS
ALTER TABLE blog_categories_dk847392 ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Enable read access for all users" ON blog_categories_dk847392;
CREATE POLICY "Enable read access for all users" ON blog_categories_dk847392 
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON blog_categories_dk847392;
CREATE POLICY "Enable all operations for authenticated users" ON blog_categories_dk847392 
FOR ALL USING (true) WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories_dk847392 (slug);
CREATE INDEX IF NOT EXISTS idx_blog_categories_status ON blog_categories_dk847392 (status);
CREATE INDEX IF NOT EXISTS idx_blog_categories_sort_order ON blog_categories_dk847392 (sort_order);

-- Insert default categories
INSERT INTO blog_categories_dk847392 (name, slug, description, color, icon, sort_order, meta_title, meta_description) VALUES
('Shopping Guides', 'shopping-guides', 'Komplet guides til online shopping og de bedste webshops', '#3b82f6', 'FiShoppingBag', 1, 'Shopping Guides | Blog | Webshop Oversigt', 'Læs de bedste shopping guides og find de mest pålidelige danske webshops.'),
('Webshop Anmeldelser', 'webshop-anmeldelser', 'Dybdegående anmeldelser af danske webshops', '#10b981', 'FiStar', 2, 'Webshop Anmeldelser | Blog | Webshop Oversigt', 'Honest anmeldelser af danske webshops baseret på kundeservice og kvalitet.'),
('Sikkerhed', 'sikkerhed', 'Tips til sikker online shopping og beskyttelse mod svindel', '#ef4444', 'FiShield', 3, 'Online Shopping Sikkerhed | Blog | Webshop Oversigt', 'Lær hvordan du handler sikkert online og beskytter dig mod svindel.'),
('Tilbud & Rabatter', 'tilbud-rabatter', 'De bedste tilbud og rabatmuligheder på danske webshops', '#f59e0b', 'FiTag', 4, 'Tilbud & Rabatter | Blog | Webshop Oversigt', 'Find de bedste tilbud og rabatter på danske webshops.')
ON CONFLICT (slug) DO NOTHING;

-- Verify the setup
SELECT 'Blog categories table setup complete' as status, COUNT(*) as categories_count FROM blog_categories_dk847392;