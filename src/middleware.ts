import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Additional middleware logic can go here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect dashboard and profile routes
        if (req.nextUrl.pathname.startsWith('/dashboard') ||
            req.nextUrl.pathname.startsWith('/profile')) {
          return !!token
        }

        // Protect agent routes - require AGENT role
        if (req.nextUrl.pathname.startsWith('/agent/dashboard')) {
          return token?.role === 'AGENT'
        }

        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/agent/dashboard/:path*'
  ]
}