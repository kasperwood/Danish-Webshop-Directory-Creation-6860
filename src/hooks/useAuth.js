// Simplified auth hook for public admin mode
import { useState, useEffect } from 'react'

export const useAuth = () => {
  const [user] = useState({ id: 'public-admin', email: 'public@admin.local' })
  const [loading] = useState(false)
  const [adminData] = useState({
    id: 'public-admin',
    full_name: 'Public Admin',
    role: 'super_admin',
    permissions: {
      can_edit_content: true,
      can_manage_users: true,
      can_view_analytics: true
    }
  })

  // Mock functions for compatibility
  const signIn = async (email, password) => {
    return { data: { user }, error: null }
  }

  const signOut = async () => {
    return { error: null }
  }

  const createAdminUser = async (userData) => {
    return { data: userData, error: null }
  }

  return {
    user,
    loading,
    adminData,
    isAdmin: true,
    isSuperAdmin: true,
    canManageUsers: true,
    canEditContent: true,
    canViewAnalytics: true,
    signIn,
    signOut,
    createAdminUser
  }
}