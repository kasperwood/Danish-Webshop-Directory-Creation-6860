# Admin User Setup for ShopDK

## 🔐 Creating Your First Admin User

Since you're using Supabase authentication, you need to create an admin user in your database.

### Method 1: Using Supabase Dashboard (Recommended)

1. **Go to your Supabase Dashboard**
   - Navigate to https://supabase.com/dashboard
   - Select your project

2. **Create Auth User**
   - Go to "Authentication" > "Users"
   - Click "Add user"
   - Enter email: `admin@shopdk.dk`
   - Enter password: `AdminPassword123!`
   - Set "Email Confirmed" to `true`
   - Click "Create user"

3. **Create Admin Record**
   - Go to "Table Editor"
   - Select `admin_users_dk847392` table
   - Click "Insert" > "Insert row"
   - Fill in:
     - `user_id`: Copy the User ID from the auth user you just created
     - `email`: `admin@shopdk.dk`
     - `full_name`: `System Administrator`
     - `role`: `super_admin`
     - `permissions`: 
     ```json
     {
       "can_edit_content": true,
       "can_manage_users": true,
       "can_view_analytics": true
     }
     ```

### Method 2: Using SQL (Advanced)

Run this SQL in your Supabase SQL Editor:

```sql
-- First, create the auth user (you might need to do this via dashboard)
-- Then create the admin record

INSERT INTO admin_users_dk847392 (
  user_id, 
  email, 
  full_name, 
  role, 
  permissions
) VALUES (
  'USER_ID_FROM_AUTH_USERS', -- Replace with actual user ID
  'admin@shopdk.dk',
  'System Administrator',
  'super_admin',
  '{
    "can_edit_content": true,
    "can_manage_users": true,
    "can_view_analytics": true
  }'::jsonb
);
```

## 🚀 Access Admin Panel

1. **Navigate to Admin Panel**
   - Local: `http://localhost:5173/#/admin`
   - Deployed: `https://yourdomain.com/#/admin`

2. **Login Credentials**
   - Email: `admin@shopdk.dk`
   - Password: `AdminPassword123!`

3. **Admin Features Available**
   - ✅ Dashboard with analytics
   - ✅ Webshop management
   - ✅ Bulk import
   - ✅ User management
   - ✅ Analytics
   - ✅ Blog management (placeholder)

## 🔧 Database Tables Required

Make sure these tables exist in your Supabase database:

- `admin_users_dk847392` - Admin user records
- `webshops_dk847392` - Webshop data
- `page_views_dk847392` - Analytics data
- `webshop_clicks_dk847392` - Click tracking
- `categories_dk847392` - Category data

## 🛡️ Security Notes

- Change default admin password after first login
- Use strong passwords for production
- Set up proper RLS policies
- Regular backup of admin data

## 📞 Need Help?

If you encounter issues:
1. Check Supabase connection in browser console
2. Verify database tables exist
3. Confirm RLS policies allow operations
4. Check admin user record exists