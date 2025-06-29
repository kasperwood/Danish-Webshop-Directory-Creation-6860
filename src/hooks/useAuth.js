import {useState,useEffect} from 'react'
import supabase from '../lib/supabase'

export const useAuth=()=> {
  const [user,setUser]=useState(null)
  const [loading,setLoading]=useState(true)
  const [adminData,setAdminData]=useState(null)

  useEffect(()=> {
    // Get initial session
    supabase.auth.getSession().then(({data: {session}})=> {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchAdminData(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {data: {subscription}} = supabase.auth.onAuthStateChange((_event,session)=> {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchAdminData(session.user.id)
      } else {
        setAdminData(null)
      }
      setLoading(false)
    })

    return ()=> subscription.unsubscribe()
  },[])

  const fetchAdminData=async (userId)=> {
    try {
      const {data,error}=await supabase
        .from('admin_users_dk847392')
        .select('*')
        .eq('user_id',userId)
        .single()

      if (!error && data) {
        setAdminData(data)
      }
    } catch (error) {
      console.error('Error fetching admin data:',error)
    }
  }

  const signIn=async (email,password)=> {
    try {
      console.log('🔑 Attempting to sign in...')
      const {data,error}=await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('❌ Sign in error:',error)
        return {data: null,error}
      }

      console.log('✅ Sign in successful')
      return {data,error: null}
    } catch (error) {
      console.error('💥 Unexpected sign in error:',error)
      return {data: null,error}
    }
  }

  const signOut=async ()=> {
    try {
      const {error}=await supabase.auth.signOut()
      if (!error) {
        setUser(null)
        setAdminData(null)
      }
      return {error}
    } catch (error) {
      console.error('Error signing out:',error)
      return {error}
    }
  }

  const createAdminUser=async (userData)=> {
    try {
      console.log('🎯 Creating admin user with data:',userData)

      // Step 1: Create auth user
      console.log('📝 Step 1: Creating auth user...')
      const {data: authData,error: authError}=await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: undefined, // Disable email confirmation
          data: {
            full_name: userData.fullName
          }
        }
      })

      if (authError) {
        console.error('❌ Auth user creation failed:',authError)
        return {data: null,error: authError}
      }

      if (!authData.user) {
        const error=new Error('Failed to create auth user - no user returned')
        console.error('❌ No user returned from auth:',error)
        return {data: null,error}
      }

      console.log('✅ Auth user created:',authData.user.id)

      // Step 2: Create admin record
      console.log('📝 Step 2: Creating admin record...')
      const adminRecord={
        user_id: authData.user.id,
        email: userData.email,
        full_name: userData.fullName,
        role: 'super_admin',
        permissions: {
          can_edit_content: true,
          can_manage_users: true,
          can_view_analytics: true
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const {data: adminData,error: adminError}=await supabase
        .from('admin_users_dk847392')
        .insert([adminRecord])
        .select()
        .single()

      if (adminError) {
        console.error('❌ Admin record creation failed:',adminError)
        // Try to clean up the auth user if admin creation failed
        await supabase.auth.admin.deleteUser(authData.user.id)
        return {data: null,error: adminError}
      }

      console.log('✅ Admin record created:',adminData)

      // Step 3: Sign in the new user
      console.log('📝 Step 3: Signing in new user...')
      const {data: signInData,error: signInError}=await supabase.auth.signInWithPassword({
        email: userData.email,
        password: userData.password
      })

      if (signInError) {
        console.error('⚠️ Auto sign-in failed:',signInError)
        // Don't return error here, user creation was successful
      } else {
        console.log('✅ Auto sign-in successful')
      }

      return {
        data: {
          user: authData.user,
          admin: adminData,
          session: signInData?.session
        },
        error: null
      }

    } catch (error) {
      console.error('💥 Unexpected error in createAdminUser:',error)
      return {
        data: null,
        error: {
          message: error.message || 'Uventet fejl ved oprettelse af admin bruger'
        }
      }
    }
  }

  return {
    user,
    loading,
    adminData,
    isAdmin: !!adminData,
    isSuperAdmin: adminData?.role === 'super_admin',
    canManageUsers: adminData?.permissions?.can_manage_users || false,
    canEditContent: adminData?.permissions?.can_edit_content || false,
    canViewAnalytics: adminData?.permissions?.can_view_analytics || false,
    signIn,
    signOut,
    createAdminUser
  }
}