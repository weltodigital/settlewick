import { NextResponse } from 'next/server'

// In a real app, this would come from your database
const getProperties = async () => {
  // Mock property data - replace with actual database query
  return [
    {
      slug: '3-bed-terraced-albert-road-southsea',
      updatedAt: new Date('2024-02-20'),
      listingType: 'SALE',
      town: 'southsea'
    },
    {
      slug: '2-bed-flat-osborne-road-southsea',
      updatedAt: new Date('2024-02-19'),
      listingType: 'RENT',
      town: 'southsea'
    },
    {
      slug: '4-bed-detached-highland-road-portsmouth',
      updatedAt: new Date('2024-02-18'),
      listingType: 'SALE',
      town: 'portsmouth'
    }
  ]
}

const getAreaGuides = async () => {
  // Mock area guide data
  return [
    { slug: 'southsea', updatedAt: new Date('2024-02-15') },
    { slug: 'portsmouth', updatedAt: new Date('2024-02-14') },
    { slug: 'fratton', updatedAt: new Date('2024-02-13') },
    { slug: 'copnor', updatedAt: new Date('2024-02-12') },
    { slug: 'old-portsmouth', updatedAt: new Date('2024-02-11') }
  ]
}

const getSoldPricesAreas = async () => {
  // Mock sold prices areas
  return [
    { slug: 'southsea', updatedAt: new Date('2024-02-20') },
    { slug: 'portsmouth', updatedAt: new Date('2024-02-19') },
    { slug: 'fratton', updatedAt: new Date('2024-02-18') }
  ]
}

export async function GET() {
  const baseUrl = 'https://settlewick.com'
  const currentDate = new Date().toISOString()

  const properties = await getProperties()
  const areaGuides = await getAreaGuides()
  const soldPricesAreas = await getSoldPricesAreas()

  const staticPages = [
    {
      url: `${baseUrl}/`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0
    },
    {
      url: `${baseUrl}/for-sale`,
      lastModified: currentDate,
      changeFrequency: 'hourly',
      priority: 0.9
    },
    {
      url: `${baseUrl}/to-rent`,
      lastModified: currentDate,
      changeFrequency: 'hourly',
      priority: 0.9
    },
    {
      url: `${baseUrl}/sold-prices`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8
    },
    {
      url: `${baseUrl}/area-guides`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7
    },
    {
      url: `${baseUrl}/mortgage-calculator`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6
    },
    {
      url: `${baseUrl}/auth/signin`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3
    },
    {
      url: `${baseUrl}/auth/signup`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3
    },
    {
      url: `${baseUrl}/agent`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5
    }
  ]

  // Property search pages
  const searchPages = [
    { url: `${baseUrl}/for-sale/portsmouth`, priority: 0.8 },
    { url: `${baseUrl}/for-sale/southsea`, priority: 0.8 },
    { url: `${baseUrl}/for-sale/fratton`, priority: 0.7 },
    { url: `${baseUrl}/for-sale/copnor`, priority: 0.7 },
    { url: `${baseUrl}/to-rent/portsmouth`, priority: 0.8 },
    { url: `${baseUrl}/to-rent/southsea`, priority: 0.8 },
    { url: `${baseUrl}/to-rent/fratton`, priority: 0.7 },
    { url: `${baseUrl}/to-rent/copnor`, priority: 0.7 }
  ].map(page => ({
    ...page,
    lastModified: currentDate,
    changeFrequency: 'hourly'
  }))

  // Property detail pages
  const propertyPages = properties.map(property => ({
    url: `${baseUrl}/property/${property.slug}`,
    lastModified: property.updatedAt.toISOString(),
    changeFrequency: 'weekly',
    priority: 0.8
  }))

  // Area guide pages
  const areaGuidePages = areaGuides.map(guide => ({
    url: `${baseUrl}/area-guides/${guide.slug}`,
    lastModified: guide.updatedAt.toISOString(),
    changeFrequency: 'monthly',
    priority: 0.6
  }))

  // Sold prices pages
  const soldPricesPages = soldPricesAreas.map(area => ({
    url: `${baseUrl}/sold-prices/${area.slug}`,
    lastModified: area.updatedAt.toISOString(),
    changeFrequency: 'daily',
    priority: 0.7
  }))

  const allPages = [
    ...staticPages,
    ...searchPages,
    ...propertyPages,
    ...areaGuidePages,
    ...soldPricesPages
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, must-revalidate'
    }
  })
}