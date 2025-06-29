# 🔧 Admin User Setup Guide

## 🚨 **Step 1: Create Admin Users Table**

First, you need to create the admin users table. Run this SQL in your **Supabase SQL Editor**:

```sql
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

-- Verify the setup
SELECT 'Admin users table created successfully' as status;
```

## 🎯 **Step 2: Create Your First Admin User**

### Option A: Using the Admin Panel (Recommended)

1. **Go to your admin panel**: `http://localhost:5173/#/admin`
2. **Click "Opret første admin bruger"**
3. **Fill in the form**:
   - **Fulde navn**: Your full name
   - **Email adresse**: Your email (e.g., `admin@shopdk.dk`)
   - **Adgangskode**: Strong password (min 6 characters)
4. **Click "Opret Admin Bruger"**

### Option B: Using Default Credentials

Try logging in with these pre-filled credentials:
- **Email**: `admin@shopdk.dk`
- **Password**: `ShopDK2024!Admin`

## ✅ **What Was Fixed**

### 🔧 **Enhanced Error Handling**
- ✅ **Proper error messages** instead of "undefined"
- ✅ **Input validation** for all form fields
- ✅ **Specific error handling** for common issues
- ✅ **User-friendly feedback** throughout the process

### 🎯 **Improved Auth Flow**
- ✅ **Three-step process**: Create auth user → Create admin record → Auto sign-in
- ✅ **Cleanup on failure** to prevent orphaned records
- ✅ **Detailed logging** for debugging
- ✅ **Graceful error recovery**

### 🛡️ **Security Improvements**
- ✅ **Email validation**
- ✅ **Password strength requirements**
- ✅ **Proper RLS policies**
- ✅ **Secure authentication flow**

## 🔍 **Troubleshooting**

### If you still get errors:

1. **Check Supabase Connection**:
   - Verify your Supabase URL and keys in `src/lib/supabase.js`
   - Test connection in browser console

2. **Verify Table Creation**:
   - Go to Supabase Dashboard → Table Editor
   - Confirm `admin_users_dk847392` table exists

3. **Check RLS Policies**:
   - Ensure policies allow authenticated users to insert/read

4. **Email Confirmation**:
   - In Supabase Dashboard → Authentication → Settings
   - Disable "Enable email confirmations" for easier testing

## 🚀 **Success!**

Once you create your first admin user, you'll have full access to:
- ✅ **Dashboard** with analytics
- ✅ **Webshop Management**
- ✅ **Bulk Import**
- ✅ **Blog Management**
- ✅ **Site Settings**
- ✅ **User Management**

Your admin system is now properly configured! 🎉