import type { Metadata } from 'next'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import SearchResultsClient from '@/components/search/SearchResultsClient'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Properties for Sale UK | Find Your Perfect Home | Settlewick',
  description: 'Search thousands of properties for sale across the UK. Filter by location, price, bedrooms and more. Find houses, flats, and land for sale near you.',
  keywords: [
    'properties for sale UK',
    'houses for sale',
    'flats for sale',
    'property search UK',
    'real estate UK',
    'homes for sale',
    'buy property UK',
    'estate agents'
  ],
  url: '/for-sale',
  type: 'website'
})

export default function ForSalePage() {
  const breadcrumbItems = [
    { name: 'Home', url: 'https://www.settlewick.co.uk' },
    { name: 'For Sale', url: 'https://www.settlewick.co.uk/for-sale' }
  ]

  // Create a default location object for UK-wide search
  const defaultLocation = {
    id: 'uk',
    name: 'UK',
    slug: 'uk',
    location_type: 'country',
    description: 'Search properties across the United Kingdom'
  }

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <div className="max-w-8xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            Properties for Sale in the UK
          </h1>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            Search thousands of properties for sale across the United Kingdom. Use our advanced filters to find your perfect home.
          </p>
        </div>

        <SearchResultsClient
          location={defaultLocation}
          searchParams={{}}
          listingType="SALE"
        />
      </div>
    </>
  )
}