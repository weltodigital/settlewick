// Registration route no longer needed - removed for Supabase migration
// User registration is now handled by Supabase Auth signup
export function POST() {
  return Response.json({ message: 'Registration moved to Supabase Auth' }, { status: 404 })
}