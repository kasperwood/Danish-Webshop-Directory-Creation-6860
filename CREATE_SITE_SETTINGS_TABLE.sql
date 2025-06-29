-- Create site settings table with proper schema
-- Run this in your Supabase SQL Editor

-- Drop existing table if it has wrong structure
DROP TABLE IF EXISTS site_settings_dk847392;

-- Create site settings table with all required columns
CREATE TABLE site_settings_dk847392 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name TEXT DEFAULT 'Webshop oversigt',
  site_description TEXT DEFAULT 'Danmarks største webshop directory',
  logo_url TEXT DEFAULT '/vite.svg',
  favicon_url TEXT DEFAULT '',
  primary_color TEXT DEFAULT '#3b82f6',
  secondary_color TEXT DEFAULT '#1e40af',
  meta_keywords TEXT DEFAULT 'danske webshops,online shopping,e-handel Danmark',
  meta_description TEXT DEFAULT 'Danmarks største webshop directory med over 1000+ verificerede webshops',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT site_name_not_empty CHECK (length(trim(site_name)) > 0),
  CONSTRAINT valid_colors CHECK (
    primary_color ~ '^#[0-9a-fA-F]{6}$' AND 
    secondary_color ~ '^#[0-9a-fA-F]{6}$'
  )
);

-- Enable RLS
ALTER TABLE site_settings_dk847392 ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Enable read access for all users" ON site_settings_dk847392
  FOR SELECT USING (true);

CREATE POLICY "Enable all operations for authenticated users" ON site_settings_dk847392
  FOR ALL USING (true) WITH CHECK (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_site_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-updating timestamps
DROP TRIGGER IF EXISTS trigger_site_settings_updated_at ON site_settings_dk847392;
CREATE TRIGGER trigger_site_settings_updated_at
  BEFORE UPDATE ON site_settings_dk847392
  FOR EACH ROW EXECUTE FUNCTION update_site_settings_updated_at();

-- Insert default settings
INSERT INTO site_settings_dk847392 (
  site_name,
  site_description,
  logo_url,
  favicon_url,
  primary_color,
  secondary_color,
  meta_keywords,
  meta_description
) VALUES (
  'Webshop oversigt',
  'Danmarks største webshop directory med over 1000+ verificerede webshops',
  'https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751187545596-freepik_br_814ede14-2fc7-447b-b665-328e08873468.png',
  '',
  '#3b82f6',
  '#1e40af',
  'danske webshops,online shopping,e-handel Danmark,sammenlign priser,webshop anmeldelser,trustpilot',
  'Danmarks største webshop directory med over 1000+ verificerede webshops. Find de bedste tilbud, sammenlign priser og læs Trustpilot anmeldelser.'
);

-- Comments
COMMENT ON TABLE site_settings_dk847392 IS 'Global site settings and branding configuration';
COMMENT ON COLUMN site_settings_dk847392.site_name IS 'Display name of the website';
COMMENT ON COLUMN site_settings_dk847392.site_description IS 'Brief description of the website';
COMMENT ON COLUMN site_settings_dk847392.logo_url IS 'URL to the site logo image';
COMMENT ON COLUMN site_settings_dk847392.favicon_url IS 'URL to the site favicon';
COMMENT ON COLUMN site_settings_dk847392.primary_color IS 'Primary brand color in hex format';
COMMENT ON COLUMN site_settings_dk847392.secondary_color IS 'Secondary brand color in hex format';
COMMENT ON COLUMN site_settings_dk847392.meta_keywords IS 'Global SEO keywords';
COMMENT ON COLUMN site_settings_dk847392.meta_description IS 'Global SEO meta description';

-- Verify the setup
SELECT 'Site settings table created successfully' as status,
       COUNT(*) as records_count
FROM site_settings_dk847392;

-- Show table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'site_settings_dk847392'
ORDER BY ordinal_position;