import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import AreaGuideTemplate from '@/components/area-guides/AreaGuideTemplate'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'
import { notFound } from 'next/navigation'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'

interface Props {
  params: {
    slug: string[]
  }
}

// Get location data from Supabase
async function getLocationData(slugPath: string) {
  // Handle nested paths like portsmouth/southsea
  const slugs = slugPath.split('/')
  const locationSlug = slugs[slugs.length - 1] // Get the final slug

  const supabase = createClient()
  const { data: location, error } = await supabase
    .from('locations' as any)
    .select(`
      id,
      name,
      slug,
      location_type,
      description,
      latitude,
      longitude,
      bounds_ne_lat,
      bounds_ne_lng,
      bounds_sw_lat,
      bounds_sw_lng,
      population,
      property_count_sale,
      property_count_rent,
      average_price,
      average_rent,
      parent:locations!locations_parent_id_fkey(name, slug),
      children:locations!locations_parent_id_fkey(name, slug, location_type)
    `)
    .eq('slug', locationSlug)
    .single()

  if (error || !location) {
    return null
  }

  return location
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slugPath = params.slug.join('/')
  const location = await getLocationData(slugPath)

  if (!location) {
    return {
      title: 'Area Not Found | Settlewick'
    }
  }

  const parentLocation = (location as any)?.parent?.name
  const fullLocationName = parentLocation
    ? `${(location as any).name}, ${parentLocation}`
    : (location as any).name

  return generateSEOMetadata({
    title: `Living in ${fullLocationName} — Area Guide | Settlewick`,
    description: `Discover what it's like to live in ${fullLocationName}. Average house prices, schools, transport links, and properties for sale and rent in ${(location as any).name}.`,
    keywords: [
      `${(location as any).name} area guide`,
      `living in ${(location as any).name}`,
      `${(location as any).name} property prices`,
      `${(location as any).name} schools`,
      `${(location as any).name} transport`,
      `${(location as any).name} UK`,
      'area guide',
      'property market'
    ],
    url: `/area-guide/${slugPath}`,
    type: 'article'
  })
}

export default async function AreaGuidePage({ params }: Props) {
  const slugPath = params.slug.join('/')
  const location = await getLocationData(slugPath)

  if (!location) {
    notFound()
  }

  // Build breadcrumb path
  const breadcrumbItems = [
    { name: 'Home', url: 'https://www.settlewick.co.uk' },
    { name: 'Area Guides', url: 'https://www.settlewick.co.uk/area-guides' }
  ]

  // Add parent locations to breadcrumb if they exist
  if ((location as any).parent) {
    breadcrumbItems.push({
      name: (location as any).parent.name,
      url: `https://www.settlewick.co.uk/area-guide/${(location as any).parent.slug}`
    })
  }

  // Add current location
  breadcrumbItems.push({
    name: (location as any).name,
    url: `https://www.settlewick.co.uk/area-guide/${slugPath}`
  })

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-8xl mx-auto px-4">
          <AreaGuideTemplate location={location as any} />
        </div>
      </div>
    </>
  )
}