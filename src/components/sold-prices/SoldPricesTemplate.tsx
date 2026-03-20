'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Search, SortAsc, SortDesc, MapPin, Calendar, Home, PoundSterling } from 'lucide-react'

interface SoldPrice {
  id: string
  address: string
  postcode: string
  price: number
  date: string
  property_type: string
  tenure: string
  new_build: boolean
}

interface Location {
  id: string
  name: string
  slug: string
  location_type: string
  description?: string
  latitude?: number
  longitude?: number
  population?: number
  property_count_sale?: number
  average_price?: number
  parent?: {
    name: string
    slug: string
  }
  children?: Array<{
    name: string
    slug: string
    location_type: string
  }>
}

interface SoldPricesTemplateProps {
  location: Location
  searchParams: {
    page?: string
    sortBy?: 'date_desc' | 'date_asc' | 'price_desc' | 'price_asc'
    propertyType?: string
    minPrice?: string
    maxPrice?: string
  }
}

export default function SoldPricesTemplate({
  location,
  searchParams
}: SoldPricesTemplateProps) {
  const [soldPrices, setSoldPrices] = useState<SoldPrice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [totalResults, setTotalResults] = useState(0)
  const [summary, setSummary] = useState<{
    averagePrice: number
    totalSales: number
    priceChange: number
  } | null>(null)

  const currentPage = parseInt(searchParams.page || '1')
  const sortBy = searchParams.sortBy || 'date_desc'
  const propertyType = searchParams.propertyType
  const minPrice = searchParams.minPrice ? parseInt(searchParams.minPrice) : undefined
  const maxPrice = searchParams.maxPrice ? parseInt(searchParams.maxPrice) : undefined

  const resultsPerPage = 20

  useEffect(() => {
    fetchSoldPrices()
  }, [location.id, currentPage, sortBy, propertyType, minPrice, maxPrice, searchTerm])

  const fetchSoldPrices = async () => {
    const supabase = createClient()
    setIsLoading(true)
    try {
      let query = supabase
        .from('sold_prices')
        .select('*', { count: 'exact' })

      // Location filter - search by address containing location name
      query = query.ilike('address', `%${location.name}%`)

      // Search filter
      if (searchTerm.trim()) {
        query = query.or(`address.ilike.%${searchTerm}%,postcode.ilike.%${searchTerm}%`)
      }

      // Property type filter
      if (propertyType && propertyType !== 'all') {
        query = query.eq('property_type', propertyType)
      }

      // Price filters
      if (minPrice) {
        query = query.gte('price', minPrice * 100) // Convert to pence
      }
      if (maxPrice) {
        query = query.lte('price', maxPrice * 100) // Convert to pence
      }

      // Sorting
      const [field, direction] = sortBy.split('_')
      if (field === 'date') {
        query = query.order('date', { ascending: direction === 'asc' })
      } else if (field === 'price') {
        query = query.order('price', { ascending: direction === 'asc' })
      }

      // Pagination
      const startIndex = (currentPage - 1) * resultsPerPage
      query = query.range(startIndex, startIndex + resultsPerPage - 1)

      const { data, error, count } = await query

      if (error) {
        console.error('Error fetching sold prices:', error)
        setSoldPrices([])
        setTotalResults(0)
      } else {
        setSoldPrices(data || [])
        setTotalResults(count || 0)
      }

      // Fetch summary statistics
      await fetchSummary()

    } catch (error) {
      console.error('Error fetching sold prices:', error)
      setSoldPrices([])
      setTotalResults(0)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSummary = async () => {
    const supabase = createClient()
    try {
      // Get last 12 months data
      const twelveMonthsAgo = new Date()
      twelveMonthsAgo.setFullYear(twelveMonthsAgo.getFullYear() - 1)

      const { data: recentSales, error } = await supabase
        .from('sold_prices')
        .select('price, date')
        .ilike('address', `%${location.name}%`)
        .gte('date', twelveMonthsAgo.toISOString().split('T')[0])

      if (!error && recentSales && recentSales.length > 0) {
        const totalSales = recentSales.length
        const averagePrice = recentSales.reduce((sum, sale) => sum + sale.price, 0) / totalSales

        // Get previous 12 months for comparison
        const twentyFourMonthsAgo = new Date()
        twentyFourMonthsAgo.setFullYear(twentyFourMonthsAgo.getFullYear() - 2)

        const { data: previousSales } = await supabase
          .from('sold_prices')
          .select('price')
          .ilike('address', `%${location.name}%`)
          .gte('date', twentyFourMonthsAgo.toISOString().split('T')[0])
          .lt('date', twelveMonthsAgo.toISOString().split('T')[0])

        let priceChange = 0
        if (previousSales && previousSales.length > 0) {
          const previousAverage = previousSales.reduce((sum, sale) => sum + sale.price, 0) / previousSales.length
          priceChange = ((averagePrice - previousAverage) / previousAverage) * 100
        }

        setSummary({
          averagePrice: averagePrice / 100, // Convert from pence
          totalSales,
          priceChange
        })
      }
    } catch (error) {
      console.error('Error fetching summary:', error)
    }
  }

  const formatPropertyType = (type: string) => {
    switch (type.toLowerCase()) {
      case 'detached':
        return 'Detached'
      case 'semi_detached':
        return 'Semi-Detached'
      case 'terraced':
        return 'Terraced'
      case 'flat':
        return 'Flat/Apartment'
      case 'other':
        return 'Other'
      default:
        return type
    }
  }

  const formatTenure = (tenure: string) => {
    switch (tenure.toLowerCase()) {
      case 'freehold':
        return 'Freehold'
      case 'leasehold':
        return 'Leasehold'
      default:
        return tenure
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const parentLocation = location.parent?.name
  const fullLocationName = parentLocation
    ? `${location.name}, ${parentLocation}`
    : location.name

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary">
          Sold House Prices in {location.name}
        </h1>
        {parentLocation && (
          <p className="text-xl text-text-muted">
            {fullLocationName}
          </p>
        )}
        {location.description && (
          <p className="text-lg text-text-muted max-w-3xl mx-auto">
            {location.description}
          </p>
        )}
      </div>

      {/* Summary Stats */}
      {summary && (
        <div className="bg-surface rounded-xl p-6 border border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-text-muted">
                <PoundSterling className="w-5 h-5" />
                <span>Average Price</span>
              </div>
              <div className="text-2xl font-bold text-text-primary">
                £{Math.round(summary.averagePrice).toLocaleString()}
              </div>
            </div>

            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-text-muted">
                <Home className="w-5 h-5" />
                <span>Sales (12 months)</span>
              </div>
              <div className="text-2xl font-bold text-text-primary">
                {summary.totalSales.toLocaleString()}
              </div>
            </div>

            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-text-muted">
                <Calendar className="w-5 h-5" />
                <span>Price Change</span>
              </div>
              <div className={`text-2xl font-bold ${
                summary.priceChange > 0 ? 'text-green-600' :
                summary.priceChange < 0 ? 'text-red-600' : 'text-text-primary'
              }`}>
                {summary.priceChange > 0 ? '+' : ''}
                {summary.priceChange.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-surface rounded-xl p-6 border border-border space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              placeholder="Search by address or postcode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span className="text-text-muted">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => {
              const params = new URLSearchParams(window.location.search)
              params.set('sortBy', e.target.value)
              params.set('page', '1')
              window.history.pushState({}, '', `${window.location.pathname}?${params}`)
              window.location.reload()
            }}
            className="bg-background border border-border rounded px-3 py-1"
          >
            <option value="date_desc">Date (Newest)</option>
            <option value="date_asc">Date (Oldest)</option>
            <option value="price_desc">Price (Highest)</option>
            <option value="price_asc">Price (Lowest)</option>
          </select>

          <span className="text-text-muted">Property Type:</span>
          <select
            value={propertyType || 'all'}
            onChange={(e) => {
              const params = new URLSearchParams(window.location.search)
              if (e.target.value === 'all') {
                params.delete('propertyType')
              } else {
                params.set('propertyType', e.target.value)
              }
              params.set('page', '1')
              window.history.pushState({}, '', `${window.location.pathname}?${params}`)
              window.location.reload()
            }}
            className="bg-background border border-border rounded px-3 py-1"
          >
            <option value="all">All Types</option>
            <option value="detached">Detached</option>
            <option value="semi_detached">Semi-Detached</option>
            <option value="terraced">Terraced</option>
            <option value="flat">Flat/Apartment</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-text-primary">
            Recent Sales
          </h2>
          <div className="text-text-muted">
            {isLoading ? 'Loading...' : `${totalResults.toLocaleString()} properties found`}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-surface rounded-lg p-6 border border-border animate-pulse">
                <div className="space-y-3">
                  <div className="h-5 bg-border rounded w-3/4"></div>
                  <div className="h-4 bg-border rounded w-1/2"></div>
                  <div className="h-4 bg-border rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : soldPrices.length === 0 ? (
          <div className="bg-surface rounded-lg p-12 border border-border text-center">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-text-muted" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              No sold prices found
            </h3>
            <p className="text-text-muted mb-6">
              We don't have any recent sold price data for {location.name} matching your criteria.
            </p>
            <p className="text-sm text-text-muted">
              Try adjusting your search criteria or check back later as we regularly update our data.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {soldPrices.map((sale) => (
              <div key={sale.id} className="bg-surface rounded-lg p-6 border border-border hover:border-accent transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-text-primary text-lg">
                      {sale.address}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {sale.postcode}
                      </span>
                      <span className="flex items-center gap-1">
                        <Home className="w-4 h-4" />
                        {formatPropertyType(sale.property_type)}
                      </span>
                      <span>{formatTenure(sale.tenure)}</span>
                      {sale.new_build && (
                        <span className="px-2 py-1 bg-accent/10 text-accent rounded text-xs">
                          New Build
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="text-2xl font-bold text-text-primary">
                      £{Math.round(sale.price / 100).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-text-muted">
                      <Calendar className="w-4 h-4" />
                      {formatDate(sale.date)}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {totalResults > resultsPerPage && (
              <div className="flex items-center justify-center gap-2 pt-6">
                {currentPage > 1 && (
                  <button
                    onClick={() => {
                      const params = new URLSearchParams(window.location.search)
                      params.set('page', (currentPage - 1).toString())
                      window.history.pushState({}, '', `${window.location.pathname}?${params}`)
                      window.location.reload()
                    }}
                    className="px-4 py-2 bg-surface border border-border rounded-lg hover:bg-secondary transition-colors"
                  >
                    Previous
                  </button>
                )}

                <span className="px-4 py-2 text-text-muted">
                  Page {currentPage} of {Math.ceil(totalResults / resultsPerPage)}
                </span>

                {currentPage < Math.ceil(totalResults / resultsPerPage) && (
                  <button
                    onClick={() => {
                      const params = new URLSearchParams(window.location.search)
                      params.set('page', (currentPage + 1).toString())
                      window.history.pushState({}, '', `${window.location.pathname}?${params}`)
                      window.location.reload()
                    }}
                    className="px-4 py-2 bg-surface border border-border rounded-lg hover:bg-secondary transition-colors"
                  >
                    Next
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Related Locations */}
      {location.children && location.children.length > 0 && (
        <div className="bg-surface rounded-xl p-6 border border-border">
          <h3 className="text-xl font-bold text-text-primary mb-4">
            Sold Prices in Nearby Areas
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {location.children.map((child) => (
              <a
                key={child.slug}
                href={`/sold-prices/${child.slug}`}
                className="block p-4 bg-background rounded-lg border border-border hover:border-accent transition-colors"
              >
                <div className="font-medium text-text-primary">
                  {child.name}
                </div>
                <div className="text-sm text-text-muted capitalize">
                  {child.location_type.replace('_', ' ')}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}