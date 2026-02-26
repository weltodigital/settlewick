'use client'

import { useState } from 'react'
import { Search, MapPin, Calendar, TrendingUp, Home, Filter, Download } from 'lucide-react'

interface SoldProperty {
  id: string
  address: string
  postcode: string
  price: number
  soldDate: string
  propertyType: string
  bedrooms: number
  tenure: 'FREEHOLD' | 'LEASEHOLD'
  newBuild: boolean
  pricePerSqFt?: number
  floorArea?: number
}

interface SearchFilters {
  location: string
  priceMin?: number
  priceMax?: number
  propertyType?: string
  bedrooms?: number
  dateFrom?: string
  dateTo?: string
  radius: number
}

export default function SoldPricesSearch() {
  const [filters, setFilters] = useState<SearchFilters>({
    location: '',
    radius: 1
  })
  const [results, setResults] = useState<SoldProperty[]>([])
  const [loading, setLoading] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'pricePerSqFt'>('date')

  // Mock sold properties data
  const mockSoldProperties: SoldProperty[] = [
    {
      id: '1',
      address: '42 Albert Road',
      postcode: 'PO4 0JH',
      price: 285000,
      soldDate: '2024-01-15',
      propertyType: 'TERRACED',
      bedrooms: 3,
      tenure: 'FREEHOLD',
      newBuild: false,
      pricePerSqFt: 285,
      floorArea: 1000
    },
    {
      id: '2',
      address: '18 Victoria Street',
      postcode: 'PO1 2HU',
      price: 320000,
      soldDate: '2024-01-20',
      propertyType: 'TERRACED',
      bedrooms: 4,
      tenure: 'FREEHOLD',
      newBuild: false,
      pricePerSqFt: 267,
      floorArea: 1200
    },
    {
      id: '3',
      address: 'Flat 12, Marina Heights',
      postcode: 'PO1 3AX',
      price: 195000,
      soldDate: '2024-01-25',
      propertyType: 'FLAT',
      bedrooms: 2,
      tenure: 'LEASEHOLD',
      newBuild: true,
      pricePerSqFt: 325,
      floorArea: 600
    },
    {
      id: '4',
      address: '65 Elm Grove',
      postcode: 'PO5 3QB',
      price: 275000,
      soldDate: '2024-02-01',
      propertyType: 'TERRACED',
      bedrooms: 3,
      tenure: 'FREEHOLD',
      newBuild: false,
      pricePerSqFt: 275,
      floorArea: 1000
    },
    {
      id: '5',
      address: '23 Osborne Road',
      postcode: 'PO5 3LU',
      price: 420000,
      soldDate: '2024-02-08',
      propertyType: 'SEMI_DETACHED',
      bedrooms: 4,
      tenure: 'FREEHOLD',
      newBuild: false,
      pricePerSqFt: 280,
      floorArea: 1500
    },
    {
      id: '6',
      address: '7 Castle Road',
      postcode: 'PO5 3DE',
      price: 180000,
      soldDate: '2024-02-12',
      propertyType: 'FLAT',
      bedrooms: 1,
      tenure: 'LEASEHOLD',
      newBuild: false,
      pricePerSqFt: 360,
      floorArea: 500
    }
  ]

  const handleSearch = () => {
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      let filteredResults = [...mockSoldProperties]

      // Filter by location (simple contains check)
      if (filters.location) {
        filteredResults = filteredResults.filter(property =>
          property.address.toLowerCase().includes(filters.location.toLowerCase()) ||
          property.postcode.toLowerCase().includes(filters.location.toLowerCase())
        )
      }

      // Filter by price range
      if (filters.priceMin) {
        filteredResults = filteredResults.filter(property => property.price >= filters.priceMin!)
      }
      if (filters.priceMax) {
        filteredResults = filteredResults.filter(property => property.price <= filters.priceMax!)
      }

      // Filter by property type
      if (filters.propertyType) {
        filteredResults = filteredResults.filter(property => property.propertyType === filters.propertyType)
      }

      // Filter by bedrooms
      if (filters.bedrooms) {
        filteredResults = filteredResults.filter(property => property.bedrooms === filters.bedrooms)
      }

      // Sort results
      filteredResults.sort((a, b) => {
        switch (sortBy) {
          case 'price':
            return b.price - a.price
          case 'pricePerSqFt':
            return (b.pricePerSqFt || 0) - (a.pricePerSqFt || 0)
          case 'date':
          default:
            return new Date(b.soldDate).getTime() - new Date(a.soldDate).getTime()
        }
      })

      setResults(filteredResults)
      setLoading(false)
    }, 1000)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getPropertyTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'TERRACED': 'Terraced House',
      'SEMI_DETACHED': 'Semi-detached House',
      'DETACHED': 'Detached House',
      'FLAT': 'Flat/Apartment',
      'BUNGALOW': 'Bungalow'
    }
    return labels[type] || type
  }

  const calculateAveragePrice = () => {
    if (results.length === 0) return 0
    return Math.round(results.reduce((sum, property) => sum + property.price, 0) / results.length)
  }

  const calculatePriceGrowth = () => {
    // Simulate year-over-year growth calculation
    return 3.2 // Mock 3.2% growth
  }

  return (
    <div className="max-w-8xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-accent/10 rounded-lg">
            <TrendingUp className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary">Sold House Prices</h1>
        </div>
        <p className="text-text-secondary text-lg">
          Search recent property sales in Portsmouth to understand local market trends
        </p>
      </div>

      {/* Search Form */}
      <div className="card p-6 mb-8">
        <div className="space-y-6">
          {/* Main Search */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Enter location, postcode, or road name..."
                className="input-field pl-10 w-full"
              />
            </div>
            <div className="flex items-center gap-4">
              <select
                value={filters.radius}
                onChange={(e) => setFilters(prev => ({ ...prev, radius: Number(e.target.value) }))}
                className="input-field"
              >
                <option value={0.25}>0.25 miles</option>
                <option value={0.5}>0.5 miles</option>
                <option value={1}>1 mile</option>
                <option value={2}>2 miles</option>
                <option value={5}>5 miles</option>
              </select>
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="btn-outline flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
              <button
                onClick={handleSearch}
                className="btn-accent flex items-center gap-2"
                disabled={loading}
              >
                <Search className="w-4 h-4" />
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-secondary rounded-lg">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Min Price</label>
                <input
                  type="number"
                  value={filters.priceMin || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, priceMin: e.target.value ? Number(e.target.value) : undefined }))}
                  placeholder="£100,000"
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Max Price</label>
                <input
                  type="number"
                  value={filters.priceMax || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, priceMax: e.target.value ? Number(e.target.value) : undefined }))}
                  placeholder="£500,000"
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Property Type</label>
                <select
                  value={filters.propertyType || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, propertyType: e.target.value || undefined }))}
                  className="input-field w-full"
                >
                  <option value="">All Types</option>
                  <option value="TERRACED">Terraced</option>
                  <option value="SEMI_DETACHED">Semi-detached</option>
                  <option value="DETACHED">Detached</option>
                  <option value="FLAT">Flat</option>
                  <option value="BUNGALOW">Bungalow</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Bedrooms</label>
                <select
                  value={filters.bedrooms || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, bedrooms: e.target.value ? Number(e.target.value) : undefined }))}
                  className="input-field w-full"
                >
                  <option value="">Any</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5+</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Summary */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6 text-center">
            <div className="text-2xl font-bold text-accent mb-2">{results.length}</div>
            <div className="text-text-secondary text-sm">Properties Found</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-2xl font-bold text-accent mb-2">
              {formatPrice(calculateAveragePrice())}
            </div>
            <div className="text-text-secondary text-sm">Average Price</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-2xl font-bold text-success mb-2">
              +{calculatePriceGrowth()}%
            </div>
            <div className="text-text-secondary text-sm">Annual Growth</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-2xl font-bold text-accent mb-2">
              £{Math.round(results.reduce((sum, p) => sum + (p.pricePerSqFt || 0), 0) / results.length)}
            </div>
            <div className="text-text-secondary text-sm">Price per sq ft</div>
          </div>
        </div>
      )}

      {/* Results Controls */}
      {results.length > 0 && (
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <span className="text-text-secondary">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="input-field"
            >
              <option value="date">Most Recent</option>
              <option value="price">Highest Price</option>
              <option value="pricePerSqFt">Price per sq ft</option>
            </select>
          </div>
          <button className="btn-outline flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      )}

      {/* Results List */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="h-4 bg-secondary rounded w-3/4"></div>
                  <div className="h-3 bg-secondary rounded w-1/2"></div>
                </div>
                <div className="h-4 bg-secondary rounded w-1/2"></div>
                <div className="h-4 bg-secondary rounded w-1/3"></div>
                <div className="h-4 bg-secondary rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-4">
          {results.map((property) => (
            <div key={property.id} className="card p-6 hover:shadow-md transition-shadow">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                {/* Property Details */}
                <div>
                  <div className="font-semibold text-text-primary">{property.address}</div>
                  <div className="text-text-secondary text-sm">{property.postcode}</div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-text-muted">
                    <span>{getPropertyTypeLabel(property.propertyType)}</span>
                    <span>{property.bedrooms} bed</span>
                    {property.newBuild && (
                      <span className="px-2 py-1 bg-accent/10 text-accent rounded text-xs">New Build</span>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div className="text-center">
                  <div className="text-xl font-bold text-accent">{formatPrice(property.price)}</div>
                  {property.pricePerSqFt && (
                    <div className="text-sm text-text-muted">£{property.pricePerSqFt}/sq ft</div>
                  )}
                </div>

                {/* Date */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="w-4 h-4 text-text-muted" />
                    <span className="text-text-primary">{formatDate(property.soldDate)}</span>
                  </div>
                </div>

                {/* Tenure */}
                <div className="text-center">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    property.tenure === 'FREEHOLD'
                      ? 'bg-success/10 text-success'
                      : 'bg-warning/10 text-warning'
                  }`}>
                    {property.tenure}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : !loading && filters.location ? (
        <div className="card p-12 text-center">
          <Home className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">No properties found</h3>
          <p className="text-text-secondary mb-4">
            Try adjusting your search criteria or expanding your search radius.
          </p>
        </div>
      ) : (
        <div className="card p-12 text-center">
          <Search className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">Search for sold properties</h3>
          <p className="text-text-secondary">
            Enter a location above to find recent property sales in Portsmouth
          </p>
        </div>
      )}

      {/* Market Insights */}
      {results.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-text-primary mb-6">Market Insights</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Price Distribution */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Price Distribution</h3>
              <div className="space-y-3">
                {[
                  { range: 'Under £200k', count: results.filter(p => p.price < 200000).length },
                  { range: '£200k - £300k', count: results.filter(p => p.price >= 200000 && p.price < 300000).length },
                  { range: '£300k - £400k', count: results.filter(p => p.price >= 300000 && p.price < 400000).length },
                  { range: 'Over £400k', count: results.filter(p => p.price >= 400000).length }
                ].map(item => (
                  <div key={item.range} className="flex justify-between items-center">
                    <span className="text-text-secondary">{item.range}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-secondary rounded-full h-2">
                        <div
                          className="bg-accent h-2 rounded-full transition-all"
                          style={{ width: `${(item.count / results.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-text-primary w-8">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Property Types */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Property Types</h3>
              <div className="space-y-3">
                {['TERRACED', 'FLAT', 'SEMI_DETACHED', 'DETACHED'].map(type => {
                  const count = results.filter(p => p.propertyType === type).length
                  if (count === 0) return null

                  return (
                    <div key={type} className="flex justify-between items-center">
                      <span className="text-text-secondary">{getPropertyTypeLabel(type)}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-secondary rounded-full h-2">
                          <div
                            className="bg-accent h-2 rounded-full transition-all"
                            style={{ width: `${(count / results.length) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-text-primary w-8">{count}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}