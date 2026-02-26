import { createClient } from './supabase/client'
import { createClient as createServerClient } from './supabase/server'
import type { User, Session } from '@supabase/supabase-js'

// Client-side auth utilities
export const auth = {
  // Sign up with email and password
  signUp: async (email: string, password: string, userData?: { name?: string; role?: string }) => {
    const supabase = createClient()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData || {}
      }
    })

    return { data, error }
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    const supabase = createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    return { data, error }
  },

  // Sign in with magic link
  signInWithMagicLink: async (email: string) => {
    const supabase = createClient()

    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })

    return { data, error }
  },

  // Sign in with Google
  signInWithGoogle: async () => {
    const supabase = createClient()

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })

    return { data, error }
  },

  // Sign out
  signOut: async () => {
    const supabase = createClient()

    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current session
  getSession: async () => {
    const supabase = createClient()

    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  },

  // Get current user
  getUser: async () => {
    const supabase = createClient()

    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Reset password
  resetPassword: async (email: string) => {
    const supabase = createClient()

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })

    return { data, error }
  },

  // Update password
  updatePassword: async (password: string) => {
    const supabase = createClient()

    const { data, error } = await supabase.auth.updateUser({ password })
    return { data, error }
  },

  // Listen to auth state changes
  onAuthStateChange: (callback: (event: string, session: Session | null) => void) => {
    const supabase = createClient()

    return supabase.auth.onAuthStateChange(callback)
  }
}

// Server-side auth utilities
export const serverAuth = {
  // Get current session on server
  getSession: async () => {
    const supabase = createServerClient()

    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  },

  // Get current user on server
  getUser: async () => {
    const supabase = createServerClient()

    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Get user profile with role information
  getUserProfile: async () => {
    const supabase = createServerClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return { profile: null, error: userError }
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    return { profile, error: profileError }
  }
}

// Auth types
export type AuthUser = User
export type AuthSession = Session

// Helper function to check if user has required role
export function hasRole(user: any, requiredRole: string | string[]): boolean {
  if (!user || !user.role) return false

  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(user.role)
  }

  return user.role === requiredRole
}

// Helper function to check if user is authenticated
export function isAuthenticated(session: Session | null): session is Session {
  return !!session?.user
}

// Helper function to redirect unauthenticated users
export function requireAuth(session: Session | null, redirectTo = '/auth/signin'): session is Session {
  if (!isAuthenticated(session)) {
    if (typeof window !== 'undefined') {
      window.location.href = redirectTo
    }
    return false
  }
  return true
}

// Helper function to require specific role
export function requireRole(profile: any, role: string | string[], redirectTo = '/') {
  if (!profile || !hasRole(profile, role)) {
    if (typeof window !== 'undefined') {
      window.location.href = redirectTo
    }
    return false
  }
  return true
}