# 🔧 Database Setup Instructions

## 🚨 **CRITICAL: Run This SQL First**

The site settings table needs to be created with the proper schema. Copy and paste this SQL into your **Supabase SQL Editor**:

### Step 1: Create Site Settings Table
```sql
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
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE site_settings_dk847392 ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Enable read access for all users" ON site_settings_dk847392
  FOR SELECT USING (true);

CREATE POLICY "Enable all operations for authenticated users" ON site_settings_dk847392
  FOR ALL USING (true) WITH CHECK (true);

-- Insert default settings
INSERT INTO site_settings_dk847392 (
  site_name,
  site_description,
  logo_url,
  primary_color,
  secondary_color,
  meta_keywords,
  meta_description
) VALUES (
  'Webshop oversigt',
  'Danmarks største webshop directory med over 1000+ verificerede webshops',
  'https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751187545596-freepik_br_814ede14-2fc7-447b-b665-328e08873468.png',
  '#3b82f6',
  '#1e40af',
  'danske webshops,online shopping,e-handel Danmark,sammenlign priser,webshop anmeldelser,trustpilot',
  'Danmarks største webshop directory med over 1000+ verificerede webshops. Find de bedste tilbud, sammenlign priser og læs Trustpilot anmeldelser.'
);

-- Verify the setup
SELECT 'Site settings table created successfully' as status,
       COUNT(*) as records_count
FROM site_settings_dk847392;
```

### Step 2: How to Run the SQL

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Navigate to SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New query"

3. **Paste and Execute**
   - Copy the entire SQL above
   - Paste it into the editor
   - Click "Run" button

4. **Verify Success**
   - You should see "Site settings table created successfully"
   - Records count should be 1

### Step 3: Test the Fix

1. Go to your admin panel: `/admin`
2. Click "Site Indstillinger"
3. Try changing the site description
4. Click "Gem Indstillinger"
5. Should now save successfully!

## 🔍 **Debug Features Added**

The updated Site Settings component now includes:
- ✅ **Debug panel** showing record ID and operation type
- ✅ **Test Connection** button to verify database access
- ✅ **Detailed console logging** for troubleshooting
- ✅ **Proper error handling** with user-friendly messages
- ✅ **Smart insert/update logic** based on existing records

## 🎯 **What This Fixes**

- ❌ **Before**: `Could not find the 'created_at' column`
- ✅ **After**: Proper table with all required columns
- ✅ **Bonus**: Default settings pre-populated
- ✅ **Bonus**: Better error handling and debugging

Run the SQL and your site settings will work perfectly! 🚀