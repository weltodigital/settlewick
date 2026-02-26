'use client'

// AuthProvider no longer needed since we're using Supabase Auth
// Components directly use createClient() for auth state
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}