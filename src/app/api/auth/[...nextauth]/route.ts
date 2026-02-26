// NextAuth route no longer needed - removed for Supabase migration
// All authentication is now handled by Supabase Auth
export function GET() {
  return Response.json({ message: 'Auth route moved to Supabase' }, { status: 404 })
}

export function POST() {
  return Response.json({ message: 'Auth route moved to Supabase' }, { status: 404 })
}