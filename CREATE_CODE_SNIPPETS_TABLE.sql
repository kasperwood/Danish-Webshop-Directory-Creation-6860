-- Create code snippets table for site-wide header and footer code
-- Run this in your Supabase SQL Editor

-- Create code snippets table
CREATE TABLE IF NOT EXISTS code_snippets_dk847392 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  header_code TEXT DEFAULT '',
  footer_code TEXT DEFAULT '',
  body_start_code TEXT DEFAULT '',
  body_end_code TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT header_code_length CHECK (length(header_code) <= 50000),
  CONSTRAINT footer_code_length CHECK (length(footer_code) <= 50000),
  CONSTRAINT body_start_code_length CHECK (length(body_start_code) <= 50000),
  CONSTRAINT body_end_code_length CHECK (length(body_end_code) <= 50000)
);

-- Enable RLS
ALTER TABLE code_snippets_dk847392 ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Enable read access for all users" ON code_snippets_dk847392
  FOR SELECT USING (true);

CREATE POLICY "Enable all operations for authenticated users" ON code_snippets_dk847392
  FOR ALL USING (true) WITH CHECK (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_code_snippets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-updating timestamps
DROP TRIGGER IF EXISTS trigger_code_snippets_updated_at ON code_snippets_dk847392;
CREATE TRIGGER trigger_code_snippets_updated_at
  BEFORE UPDATE ON code_snippets_dk847392
  FOR EACH ROW EXECUTE FUNCTION update_code_snippets_updated_at();

-- Insert default empty record
INSERT INTO code_snippets_dk847392 (
  header_code,
  footer_code,
  body_start_code,
  body_end_code
) VALUES (
  '',
  '',
  '',
  ''
) ON CONFLICT DO NOTHING;

-- Comments
COMMENT ON TABLE code_snippets_dk847392 IS 'Site-wide code snippets for header, footer and body injection';
COMMENT ON COLUMN code_snippets_dk847392.header_code IS 'HTML/CSS/JS code injected into <head> section';
COMMENT ON COLUMN code_snippets_dk847392.footer_code IS 'HTML/CSS/JS code injected into footer component';
COMMENT ON COLUMN code_snippets_dk847392.body_start_code IS 'HTML/CSS/JS code injected after <body> tag';
COMMENT ON COLUMN code_snippets_dk847392.body_end_code IS 'HTML/CSS/JS code injected before </body> tag';

-- Verify the setup
SELECT 'Code snippets table created successfully' as status,
       COUNT(*) as records_count
FROM code_snippets_dk847392;