import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase/client'
import { generateSearchMetadata } from '@/lib/seo'
import SearchResultsClient from '@/components/search/SearchResultsClient'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'
import { notFound } from 'next/navigation'

interface ToRentPageProps {
  params: { slug: string[] }
  searchParams: { [key: string]: string | string[] | undefined }
}

async function getLocationData(slugPath: string) {
  const slugs = slugPath.split('/')
  const locationSlug = slugs[slugs.length - 1]

  const { data: location, error } = await supabase
    .from('locations')
    .select(`
      id,
      name,
      slug,
      location_type,
      description,
      latitude,
      longitude,
      property_count_rent,
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

export async function generateMetadata({ params, searchParams }: ToRentPageProps): Promise<Metadata> {
  const slugPath = params.slug.join('/')
  const location = await getLocationData(slugPath)

  if (!location) {
    return {
      title: 'Location Not Found | Settlewick'
    }
  }

  const filters: Record<string, any> = {}

  if (searchParams.priceMin) filters.minPrice = Number(searchParams.priceMin)
  if (searchParams.priceMax) filters.maxPrice = Number(searchParams.priceMax)
  if (searchParams.bedrooms) {
    const bedrooms = Array.isArray(searchParams.bedrooms)
      ? searchParams.bedrooms.map(Number)
      : [Number(searchParams.bedrooms)]
    filters.bedrooms = Math.min(...bedrooms)
  }
  if (searchParams.propertyType) {
    filters.propertyType = Array.isArray(searchParams.propertyType)
      ? searchParams.propertyType[0]
      : searchParams.propertyType
  }

  const parentLocation = location.parent?.name
  const fullLocationName = parentLocation
    ? `${location.name}, ${parentLocation}`
    : location.name

  return generateSearchMetadata({
    location: fullLocationName,
    listingType: 'RENT',
    filters
  })
}

export default async function ToRentPage({ params, searchParams }: ToRentPageProps) {
  const slugPath = params.slug.join('/')
  const location = await getLocationData(slugPath)

  if (!location) {
    notFound()
  }

  // Build breadcrumb path
  const breadcrumbItems = [
    { name: 'Home', url: 'https://www.settlewick.co.uk' },
    { name: 'To Rent', url: 'https://www.settlewick.co.uk/to-rent' }
  ]

  // Add parent locations to breadcrumb if they exist
  if (location.parent) {
    breadcrumbItems.push({
      name: location.parent.name,
      url: `https://www.settlewick.co.uk/to-rent/${location.parent.slug}`
    })
  }

  // Add current location
  breadcrumbItems.push({
    name: location.name,
    url: `https://www.settlewick.co.uk/to-rent/${slugPath}`
  })

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <div className="max-w-8xl mx-auto px-4 py-8">
        <SearchResultsClient
          location={location}
          searchParams={searchParams}
          listingType="RENT"
        />
      </div>
    </>
  )
}