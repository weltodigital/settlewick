import type { Metadata } from 'next'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import SearchResultsClient from '@/components/search/SearchResultsClient'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Properties to Rent UK | Find Rental Properties | Settlewick',
  description: 'Find rental properties across the UK. Search houses, flats and apartments to rent by location, price and features. Discover your perfect rental home.',
  keywords: [
    'properties to rent UK',
    'houses to rent',
    'flats to rent',
    'rental properties UK',
    'rent property UK',
    'apartments to rent',
    'rental search UK',
    'letting agents'
  ],
  url: '/to-rent',
  type: 'website'
})

export default function ToRentPage() {
  const breadcrumbItems = [
    { name: 'Home', url: 'https://www.settlewick.co.uk' },
    { name: 'To Rent', url: 'https://www.settlewick.co.uk/to-rent' }
  ]

  // Create a default location object for UK-wide search
  const defaultLocation = {
    id: 'uk',
    name: 'UK',
    slug: 'uk',
    location_type: 'country',
    description: 'Search rental properties across the United Kingdom'
  }

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <div className="max-w-8xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            Properties to Rent in the UK
          </h1>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            Find rental properties across the United Kingdom. Search by location, price, and features to discover your perfect rental home.
          </p>
        </div>

        <SearchResultsClient
          location={defaultLocation}
          searchParams={{}}
          listingType="RENT"
        />
      </div>
    </>
  )
}