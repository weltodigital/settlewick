// Re-export Supabase clients for backward compatibility
export { createClient } from './supabase/client'
export { createClient as createServerClient } from './supabase/server'
export { supabaseAdmin } from './supabase/admin'

// Default client export (browser client)
import { createClient } from './supabase/client'
export const supabase = createClient()