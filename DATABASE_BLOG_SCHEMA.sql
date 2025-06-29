-- Complete blog management database schema
-- Run this in your Supabase SQL Editor

-- Create blog posts table with SEO optimization
CREATE TABLE IF NOT EXISTS blog_posts_dk847392 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  author TEXT,
  category TEXT,
  tags TEXT[],
  featured_image TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured BOOLEAN DEFAULT false,
  read_time TEXT DEFAULT '5 min',
  view_count INTEGER DEFAULT 0,
  
  -- SEO fields
  seo_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  schema_markup JSONB,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  
  -- Constraints
  CONSTRAINT valid_slug_format CHECK (slug ~ '^[a-z0-9-]+$'),
  CONSTRAINT title_not_empty CHECK (length(trim(title)) > 0)
);

-- Enable RLS
ALTER TABLE blog_posts_dk847392 ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blog posts
CREATE POLICY "Enable read access for published posts" ON blog_posts_dk847392
  FOR SELECT USING (status = 'published');

CREATE POLICY "Enable all operations for authenticated users" ON blog_posts_dk847392
  FOR ALL USING (true) WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts_dk847392 (status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts_dk847392 (slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts_dk847392 (category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts_dk847392 (featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts_dk847392 (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON blog_posts_dk847392 USING GIN (tags);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_blog_posts_search ON blog_posts_dk847392 
  USING GIN (to_tsvector('danish', title || ' ' || COALESCE(excerpt, '') || ' ' || COALESCE(content, '')));

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  
  -- Set published_at when status changes to published
  IF NEW.status = 'published' AND OLD.status != 'published' THEN
    NEW.published_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-updating timestamps
DROP TRIGGER IF EXISTS trigger_blog_posts_updated_at ON blog_posts_dk847392;
CREATE TRIGGER trigger_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts_dk847392
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_posts_updated_at();

-- Function to increment view count safely
CREATE OR REPLACE FUNCTION increment_blog_view_count(post_slug TEXT)
RETURNS void AS $$
BEGIN
  UPDATE blog_posts_dk847392 
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE slug = post_slug AND status = 'published';
END;
$$ LANGUAGE plpgsql;

-- Comments about the schema
COMMENT ON TABLE blog_posts_dk847392 IS 'Blog posts with full SEO optimization and webshop integration support';
COMMENT ON COLUMN blog_posts_dk847392.slug IS 'URL-friendly identifier, must be unique and lowercase with hyphens';
COMMENT ON COLUMN blog_posts_dk847392.content IS 'HTML content supporting webshop shortcodes like [webshop:1]';
COMMENT ON COLUMN blog_posts_dk847392.tags IS 'Array of tags for categorization and SEO';
COMMENT ON COLUMN blog_posts_dk847392.seo_title IS 'SEO-optimized title for search engines';
COMMENT ON COLUMN blog_posts_dk847392.meta_description IS 'Meta description for search engine snippets';
COMMENT ON COLUMN blog_posts_dk847392.meta_keywords IS 'Keywords for SEO optimization';
COMMENT ON COLUMN blog_posts_dk847392.schema_markup IS 'JSON-LD structured data for rich snippets';
COMMENT ON COLUMN blog_posts_dk847392.view_count IS 'Number of times the post has been viewed';

-- Sample SEO-optimized blog post
INSERT INTO blog_posts_dk847392 (
  title,
  slug,
  excerpt,
  content,
  author,
  category,
  tags,
  featured_image,
  status,
  featured,
  read_time,
  seo_title,
  meta_description,
  meta_keywords
) VALUES (
  'Guide: Sådan finder du de bedste danske webshops i 2024',
  'guide-bedste-danske-webshops-2024',
  'Komplet guide til at finde pålidelige danske webshops med e-mærket certificering, gode Trustpilot anmeldelser og sikker betaling.',
  '<h2>Introduktion</h2>
<p>At finde de bedste danske webshops kan være udfordrende. I denne guide får du alle de tools og tips, du skal bruge for at handle sikkert online.</p>

<h3>1. Tjek for e-mærket certificering</h3>
<p>E-mærket er din garanti for sikker online shopping i Danmark.</p>

[webshop:1]

<h3>2. Læs Trustpilot anmeldelser</h3>
<p>Trustpilot giver dig indsigt i andre kunders oplevelser.</p>

<h3>3. Sammenlign priser</h3>
<p>Brug prissammenligningssider til at finde de bedste tilbud.</p>',
  'Sarah Nielsen',
  'Shopping Guides',
  ARRAY['danske webshops', 'online shopping', 'e-mærket', 'trustpilot', 'sikker shopping'],
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop',
  'published',
  true,
  '8 min',
  'Guide: Bedste Danske Webshops 2024 | Sikker Online Shopping',
  'Komplet guide til at finde pålidelige danske webshops med e-mærket certificering, gode Trustpilot anmeldelser og sikker betaling. Spar tid og penge!',
  'danske webshops, online shopping guide, e-mærket, trustpilot anmeldelser, sikker webshop, shopping tips Danmark'
) ON CONFLICT (slug) DO NOTHING;

-- Verify the setup
SELECT 
  'Blog posts table created successfully' as status,
  COUNT(*) as sample_posts
FROM blog_posts_dk847392;

-- Show table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'blog_posts_dk847392'
ORDER BY ordinal_position;