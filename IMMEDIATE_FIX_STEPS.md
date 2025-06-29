# 🚨 IMMEDIATE FIX: Supabase Schema Cache Issue

## Problem
The `headline_bg_color` column exists in the database but Supabase's schema cache hasn't refreshed, causing the error.

## Solution Steps

### Step 1: Add Missing Columns (Run in Supabase SQL Editor)
```sql
-- Add the missing headline columns
ALTER TABLE webshops_dk847392 
ADD COLUMN IF NOT EXISTS headline_bg_color TEXT DEFAULT '#ff0000';

ALTER TABLE webshops_dk847392 
ADD COLUMN IF NOT EXISTS headline_speed INTEGER DEFAULT 10;

-- Verify columns were added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'webshops_dk847392' 
AND column_name IN ('headline_bg_color', 'headline_speed');
```

### Step 2: Force Supabase Schema Cache Refresh
1. Go to Supabase Dashboard
2. Navigate to **Settings** → **API**
3. Click **Refresh Schema Cache** button
4. Wait 30 seconds

### Step 3: Alternative - Restart Supabase Connection
If schema refresh doesn't work, add this to your admin panel:

```javascript
// Add this button to force reconnection
const forceSchemaRefresh = async () => {
  // Force a simple query to refresh schema
  const { data, error } = await supabase
    .from('webshops_dk847392')
    .select('id')
    .limit(1);
  
  console.log('Schema refresh attempt:', { data, error });
};
```

### Step 4: Temporary Workaround (If above fails)
Remove the problematic fields temporarily from the form submission:

```javascript
// In WebshopManager.jsx, modify the webshopData object
const webshopData = {
  name: formData.name,
  slug: generateSlug(formData.name),
  description: formData.description,
  logo_url: formData.logo_url,
  website_url: formData.website_url,
  trustpilot_url: formData.trustpilot_url,
  categories: Array.isArray(formData.categories) ? formData.categories : [],
  emaerket: formData.emaerket,
  tryghedsmaerket: formData.tryghedsmaerket,
  mobilepay_accepted: formData.mobilepay_accepted,
  danish_based: formData.danish_based,
  discount_text: formData.discount_text,
  featured: formData.featured,
  status: formData.status,
  sort_order: formData.sort_order,
  usp_items: formData.usp_items.filter(item => item.trim() !== ''),
  headline_text: formData.headline_text,
  headline_active: formData.headline_active,
  headline_color: formData.headline_color,
  // Temporarily comment out these lines until schema refreshes:
  // headline_bg_color: formData.headline_bg_color,
  // headline_speed: formData.headline_speed,
  updated_at: new Date().toISOString()
};
```