import type { Metadata } from 'next'
import { generateSearchMetadata } from '@/lib/seo'
import SearchResultsClient from '@/components/search/SearchResultsClient'

interface ForSalePageProps {
  params: { location: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params, searchParams }: ForSalePageProps): Promise<Metadata> {
  const location = params.location?.replace(/-/g, ' ')
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

  return generateSearchMetadata({
    location,
    listingType: 'SALE',
    filters
  })
}

export default function ForSalePage({ params, searchParams }: ForSalePageProps) {
  return (
    <div className="max-w-8xl mx-auto px-4 py-8">
      <SearchResultsClient
        location={params.location}
        searchParams={searchParams}
        listingType="SALE"
      />
    </div>
  )
}