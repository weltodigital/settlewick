import { NextResponse } from 'next/server'

export async function GET() {
  const robotsTxt = `User-agent: *
Allow: /

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /dashboard/
Disallow: /profile/
Disallow: /agent/dashboard/

# Allow specific API endpoints for SEO
Allow: /api/properties/sitemap
Allow: /api/areas/sitemap

# Sitemap location
Sitemap: https://settlewick.com/sitemap.xml

# Crawl delay (be respectful)
Crawl-delay: 1`

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400'
    }
  })
}