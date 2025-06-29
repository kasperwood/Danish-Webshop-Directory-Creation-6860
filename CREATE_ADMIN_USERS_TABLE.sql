-- Create admin users table for authentication
-- Run this in your Supabase SQL Editor

-- Create admin users table
CREATE TABLE IF NOT EXISTS admin_users_dk847392 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  permissions JSONB DEFAULT '{"can_edit_content": true, "can_manage_users": false, "can_view_analytics": true}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  
  -- Constraints
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT full_name_not_empty CHECK (length(trim(full_name)) > 0)
);

-- Enable RLS
ALTER TABLE admin_users_dk847392 ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Enable read access for authenticated users" ON admin_users_dk847392
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all operations for authenticated users" ON admin_users_dk847392
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users_dk847392 (user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users_dk847392 (email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users_dk847392 (role);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_admin_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-updating timestamps
DROP TRIGGER IF EXISTS trigger_admin_users_updated_at ON admin_users_dk847392;
CREATE TRIGGER trigger_admin_users_updated_at
  BEFORE UPDATE ON admin_users_dk847392
  FOR EACH ROW EXECUTE FUNCTION update_admin_users_updated_at();

-- Function to update last login
CREATE OR REPLACE FUNCTION update_admin_last_login(admin_email TEXT)
RETURNS void AS $$
BEGIN
  UPDATE admin_users_dk847392 
  SET last_login = NOW() 
  WHERE email = admin_email;
END;
$$ LANGUAGE plpgsql;

-- Comments
COMMENT ON TABLE admin_users_dk847392 IS 'Admin users with roles and permissions for the admin panel';
COMMENT ON COLUMN admin_users_dk847392.user_id IS 'Reference to auth.users table';
COMMENT ON COLUMN admin_users_dk847392.role IS 'Admin role: admin or super_admin';
COMMENT ON COLUMN admin_users_dk847392.permissions IS 'JSON object defining user permissions';

-- Verify the setup
SELECT 'Admin users table created successfully' as status,
       COUNT(*) as admin_count
FROM admin_users_dk847392;

-- Show table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'admin_users_dk847392'
ORDER BY ordinal_position;