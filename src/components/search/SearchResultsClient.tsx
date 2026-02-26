'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import SearchResultsWithMap from '@/components/search/SearchResultsWithMap'
import type { PropertyWithDetails } from '@/types/property'
import type { PropertyFilters } from '@/types/filters'

interface SearchResultData {
  properties: PropertyWithDetails[]
  total: number
  page: number
  totalPages: number
  filters: PropertyFilters
}

interface SearchResultsClientProps {
  location: string
  searchParams: { [key: string]: string | string[] | undefined }
  listingType: 'SALE' | 'RENT'
}

export default function SearchResultsClient({
  location,
  searchParams,
  listingType
}: SearchResultsClientProps) {
  const router = useRouter()

  const [results, setResults] = useState<SearchResultData>({
    properties: [],
    total: 0,
    page: 1,
    totalPages: 0,
    filters: { listingType }
  })
  const [loading, setLoading] = useState(true)

  // Parse location from URL
  const locationFormatted = location
    ? location.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
    : ''

  // Parse filters from URL search params
  const getFiltersFromURL = (): PropertyFilters => {
    const filters: PropertyFilters = {
      listingType,
      location: locationFormatted || undefined
    }

    // Price range
    const priceMin = searchParams.priceMin as string
    const priceMax = searchParams.priceMax as string
    if (priceMin) filters.priceMin = Number(priceMin)
    if (priceMax) filters.priceMax = Number(priceMax)

    // Bedrooms
    const bedrooms = Array.isArray(searchParams.bedrooms)
      ? searchParams.bedrooms
      : searchParams.bedrooms ? [searchParams.bedrooms] : []
    if (bedrooms.length > 0) {
      filters.bedrooms = bedrooms.map(Number)
    }

    // Bathrooms
    const bathrooms = Array.isArray(searchParams.bathrooms)
      ? searchParams.bathrooms
      : searchParams.bathrooms ? [searchParams.bathrooms] : []
    if (bathrooms.length > 0) {
      filters.bathrooms = bathrooms.map(Number)
    }

    // Property types
    const propertyTypes = Array.isArray(searchParams.propertyType)
      ? searchParams.propertyType
      : searchParams.propertyType ? [searchParams.propertyType] : []
    if (propertyTypes.length > 0) {
      filters.propertyType = propertyTypes as any[]
    }

    // Boolean filters
    const booleanFilters = ['chainFree', 'newBuild', 'garage'] as const
    booleanFilters.forEach(filter => {
      if (searchParams[filter] === 'true') {
        filters[filter] = true
      }
    })

    // Sorting
    const sortBy = searchParams.sortBy as string
    if (sortBy) filters.sortBy = sortBy as any

    // Pagination
    const page = searchParams.page as string
    if (page) filters.page = Number(page)

    return filters
  }

  const updateURL = (filters: PropertyFilters) => {
    const params = new URLSearchParams()

    // Add all filter parameters to URL
    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return

      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, String(v)))
      } else if (typeof value === 'boolean' && value) {
        params.set(key, 'true')
      } else if (key !== 'location' && key !== 'listingType') {
        params.set(key, String(value))
      }
    })

    const newURL = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`
    router.replace(newURL)
  }

  const fetchProperties = async (filters: PropertyFilters) => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams()

      Object.entries(filters).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') return

        if (Array.isArray(value)) {
          value.forEach(v => queryParams.append(key, String(v)))
        } else if (typeof value === 'boolean' && value) {
          queryParams.set(key, 'true')
        } else {
          queryParams.set(key, String(value))
        }
      })

      const response = await fetch(`/api/properties?${queryParams.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch properties')

      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('Error fetching properties:', error)
      // Show error state or fallback data
      setResults({
        properties: [],
        total: 0,
        page: 1,
        totalPages: 0,
        filters
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFiltersChange = (newFilters: PropertyFilters) => {
    const updatedFilters = {
      ...newFilters,
      page: 1 // Reset to first page when filters change
    }

    updateURL(updatedFilters)
    fetchProperties(updatedFilters)
    setResults(prev => ({ ...prev, filters: updatedFilters }))
  }

  // Load initial data
  useEffect(() => {
    const filters = getFiltersFromURL()
    setResults(prev => ({ ...prev, filters }))
    fetchProperties(filters)
  }, [location]) // Only re-run when location changes

  // Update page title
  useEffect(() => {
    const actionText = listingType === 'SALE' ? 'for Sale' : 'to Rent'
    const title = locationFormatted
      ? `Properties ${actionText} in ${locationFormatted} | Settlewick`
      : `Properties ${actionText} | Settlewick`
    document.title = title
  }, [locationFormatted, listingType])

  return (
    <SearchResultsWithMap
      properties={results.properties}
      total={results.total}
      filters={results.filters}
      onFiltersChange={handleFiltersChange}
      loading={loading}
    />
  )
}