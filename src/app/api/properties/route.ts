import { NextRequest, NextResponse } from 'next/server'
import { searchProperties } from '@/lib/property-search'
import { getMockProperties } from '@/lib/mock-data'
import type { PropertyFilters } from '@/types/filters'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse query parameters into filters
    const filters: PropertyFilters = {
      listingType: (searchParams.get('listingType') as any) || 'SALE',
      location: searchParams.get('location') || undefined,
      priceMin: searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : undefined,
      priceMax: searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : undefined,
      bedrooms: searchParams.getAll('bedrooms').length > 0
        ? searchParams.getAll('bedrooms').map(Number)
        : undefined,
      bathrooms: searchParams.getAll('bathrooms').length > 0
        ? searchParams.getAll('bathrooms').map(Number)
        : undefined,
      propertyType: searchParams.getAll('propertyType').length > 0
        ? searchParams.getAll('propertyType') as any[]
        : undefined,
      sortBy: (searchParams.get('sortBy') as any) || 'newest',
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 20,
    }

    // Parse boolean filters
    const booleanFilters = [
      'chainFree', 'newBuild', 'garage', 'garden', 'parking',
      'periodProperty', 'modern', 'cottage'
    ] as const

    booleanFilters.forEach(filter => {
      const value = searchParams.get(filter)
      if (value === 'true') {
        filters[filter] = true
      }
    })

    // Parse location search
    if (filters.location) {
      // Clean up location string
      filters.location = filters.location
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase())
    }

    let results

    try {
      // Try to use database first
      results = await searchProperties(filters)
    } catch (dbError) {
      console.log('Database not available, using mock data')
      // Fallback to mock data if database is not available
      results = getMockProperties(filters)
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error('Property search error:', error)
    return NextResponse.json(
      { error: 'Failed to search properties' },
      { status: 500 }
    )
  }
}