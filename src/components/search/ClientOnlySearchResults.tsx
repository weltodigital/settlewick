'use client'

import { useEffect, useState } from 'react'
import SearchResultsClient from './SearchResultsClient'

interface Location {
  id: string
  name: string
  slug: string
  location_type: string
  description?: string
}

interface ClientOnlySearchResultsProps {
  location: Location
  searchParams: { [key: string]: string | string[] | undefined }
  listingType: 'SALE' | 'RENT'
}

export default function ClientOnlySearchResults({
  location,
  searchParams,
  listingType
}: ClientOnlySearchResultsProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <SearchResultsClient
      location={location}
      searchParams={searchParams}
      listingType={listingType}
    />
  )
}