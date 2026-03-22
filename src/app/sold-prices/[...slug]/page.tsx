import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import SoldPricesTemplate from '@/components/sold-prices/SoldPricesTemplate'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'
import { notFound } from 'next/navigation'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'

interface Props {
  params: {
    slug: string[]
  }
  searchParams: {
    page?: string
    sortBy?: 'date_desc' | 'date_asc' | 'price_desc' | 'price_asc'
    propertyType?: string
    minPrice?: string
    maxPrice?: string
  }
}

// Get location data from Supabase
async function getLocationData(slugPath: string) {
  const slugs = slugPath.split('/')
  const locationSlug = slugs[slugs.length - 1]

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
      parent:locations!locations_parent_id_fkey(name, slug)
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
      title: 'Location Not Found | Settlewick'
    }
  }

  // Get recent sales count for metadata
  const supabase = createClient()
  const { count: salesCount } = await supabase
    .from('sold_prices' as any)
    .select('*', { count: 'exact', head: true })
    .ilike('address', `%${(location as any).name}%`)

  const parentLocation = (location as any).parent?.name
  const fullLocationName = parentLocation
    ? `${(location as any).name}, ${parentLocation}`
    : (location as any).name

  const avgPriceText = (location as any).average_price
    ? ` with an average price of £${Math.round((location as any).average_price / 100).toLocaleString()}`
    : ''

  return generateSEOMetadata({
    title: `Sold House Prices in ${fullLocationName} | Settlewick`,
    description: `See recent sold house prices in ${fullLocationName}. ${salesCount || 'Recent'} properties sold in the last 12 months${avgPriceText}.`,
    keywords: [
      `${(location as any).name} sold prices`,
      `${(location as any).name} house prices`,
      `sold prices ${(location as any).name}`,
      'house prices',
      'sold house prices',
      'property prices',
      'land registry prices'
    ],
    url: `/sold-prices/${slugPath}`,
    type: 'website'
  })
}

export default async function SoldPricesPage({ params, searchParams }: Props) {
  const slugPath = params.slug.join('/')
  const location = await getLocationData(slugPath)

  if (!location) {
    notFound()
  }

  // Build breadcrumb path
  const breadcrumbItems = [
    { name: 'Home', url: 'https://www.settlewick.co.uk' },
    { name: 'Sold Prices', url: 'https://www.settlewick.co.uk/sold-prices' }
  ]

  // Add parent locations to breadcrumb if they exist
  if ((location as any).parent) {
    breadcrumbItems.push({
      name: (location as any).parent.name,
      url: `https://www.settlewick.co.uk/sold-prices/${(location as any).parent.slug}`
    })
  }

  // Add current location
  breadcrumbItems.push({
    name: (location as any).name,
    url: `https://www.settlewick.co.uk/sold-prices/${slugPath}`
  })

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-8xl mx-auto px-4">
          <SoldPricesTemplate
            location={location as any}
            searchParams={searchParams}
          />
        </div>
      </div>
    </>
  )
}