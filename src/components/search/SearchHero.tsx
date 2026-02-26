'use client'

import { useState } from 'react'
import { Search, MapPin, Sliders, Home, Bath, Bed } from 'lucide-react'
import { useRouter } from 'next/navigation'
import AdvancedFilters from './AdvancedFilters'
import LocationAutocomplete from '@/components/ui/LocationAutocomplete'
import type { PropertyFilters } from '@/types/filters'

export default function SearchHero() {
  const [searchType, setSearchType] = useState<'sale' | 'rent'>('sale')
  const [location, setLocation] = useState('')
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false)
  const [filters, setFilters] = useState<PropertyFilters>({
    listingType: 'SALE'
  })
  const [quickFilters, setQuickFilters] = useState({
    priceMin: '',
    priceMax: '',
    bedrooms: '',
    propertyType: ''
  })
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!location.trim()) return

    // Build query params from filters and quick filters
    const params = new URLSearchParams()
    params.set('location', location)

    if (quickFilters.priceMin) params.set('priceMin', quickFilters.priceMin)
    if (quickFilters.priceMax) params.set('priceMax', quickFilters.priceMax)
    if (quickFilters.bedrooms) params.set('bedrooms', quickFilters.bedrooms)
    if (quickFilters.propertyType) params.set('propertyType', quickFilters.propertyType)

    const path = searchType === 'sale' ? '/for-sale' : '/to-rent'
    const searchQuery = location.toLowerCase().replace(/\s+/g, '-')

    router.push(`${path}/${searchQuery}${params.toString() ? `?${params.toString()}` : ''}`)
  }

  const handleSearchTypeChange = (type: 'sale' | 'rent') => {
    setSearchType(type)
    setFilters(prev => ({
      ...prev,
      listingType: type === 'sale' ? 'SALE' : 'RENT'
    }))
  }

  const popularSearches = [
    { label: 'Southsea', path: '/for-sale/southsea' },
    { label: 'Old Portsmouth', path: '/for-sale/old-portsmouth' },
    { label: 'Fratton', path: '/for-sale/fratton' },
    { label: 'Cosham', path: '/for-sale/cosham' },
    { label: 'PO4', path: '/for-sale/po4' },
    { label: 'PO1', path: '/for-sale/po1' }
  ]

  return (
    <div className="bg-gradient-to-b from-background to-secondary py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary mb-6">
          Search properly.
        </h1>

        <p className="text-lg sm:text-xl lg:text-2xl text-text-secondary mb-8 lg:mb-12 px-4">
          Find your perfect home in Portsmouth with comprehensive filters,
          <br className="hidden sm:block" />
          detailed information, and local insights.
        </p>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          {/* Buy/Rent Toggle - Mobile optimized */}
          <div className="flex justify-center mb-6">
            <div className="bg-surface rounded-xl p-1 shadow-sm border border-border">
              <button
                type="button"
                onClick={() => handleSearchTypeChange('sale')}
                className={`px-4 sm:px-6 py-3 rounded-lg font-medium transition-all text-sm sm:text-base ${
                  searchType === 'sale'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                For Sale
              </button>
              <button
                type="button"
                onClick={() => handleSearchTypeChange('rent')}
                className={`px-4 sm:px-6 py-3 rounded-lg font-medium transition-all text-sm sm:text-base ${
                  searchType === 'rent'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                To Rent
              </button>
            </div>
          </div>

          {/* Search Bar - Mobile optimized with autocomplete */}
          <div className="flex flex-col gap-3 p-3 bg-surface rounded-xl shadow-lg border border-border max-w-2xl mx-auto">
            <LocationAutocomplete
              value={location}
              onChange={setLocation}
              onSelect={(suggestion) => {
                setLocation(suggestion.name)
                // Optional: Auto-submit on selection
                // handleSearch()
              }}
              className="flex-1"
            />
            <button
              type="submit"
              className="btn-accent w-full py-4 text-base sm:text-lg flex items-center justify-center gap-2 font-medium"
            >
              <Search className="w-5 h-5" />
              <span className="hidden xs:inline">Search Properties</span>
              <span className="xs:hidden">Search</span>
            </button>
          </div>
        </form>

        {/* Quick Filters - Mobile stacked design */}
        <div className="mb-8 max-w-4xl mx-auto">
          <div className="bg-surface rounded-xl p-4 sm:p-6 shadow-sm border border-border">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap items-center gap-4 lg:justify-center">
              {/* Price Range */}
              <div className="flex items-center gap-2 lg:flex-1 lg:justify-center">
                <span className="text-sm font-medium text-text-secondary whitespace-nowrap">Price:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={quickFilters.priceMin}
                    onChange={(e) => setQuickFilters(prev => ({ ...prev, priceMin: e.target.value }))}
                    className="w-20 px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                  />
                  <span className="text-text-muted">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={quickFilters.priceMax}
                    onChange={(e) => setQuickFilters(prev => ({ ...prev, priceMax: e.target.value }))}
                    className="w-20 px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                  />
                </div>
              </div>

              {/* Bedrooms */}
              <div className="flex items-center gap-2">
                <Bed className="w-4 h-4 text-text-muted" />
                <select
                  value={quickFilters.bedrooms}
                  onChange={(e) => setQuickFilters(prev => ({ ...prev, bedrooms: e.target.value }))}
                  className="flex-1 px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                >
                  <option value="">Beds</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
              </div>

              {/* Property Type */}
              <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-1">
                <Home className="w-4 h-4 text-text-muted" />
                <select
                  value={quickFilters.propertyType}
                  onChange={(e) => setQuickFilters(prev => ({ ...prev, propertyType: e.target.value }))}
                  className="flex-1 px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                >
                  <option value="">Property Type</option>
                  <option value="FLAT">Flat</option>
                  <option value="TERRACED">Terraced</option>
                  <option value="SEMI_DETACHED">Semi-detached</option>
                  <option value="DETACHED">Detached</option>
                  <option value="BUNGALOW">Bungalow</option>
                </select>
              </div>

              {/* Advanced Filters Toggle */}
              <div className="sm:col-span-2 lg:col-span-1 lg:flex lg:justify-center">
                <button
                  type="button"
                  onClick={() => setIsAdvancedFiltersOpen(true)}
                  className="w-full lg:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-accent hover:bg-accent-light text-white rounded-lg transition-colors"
                >
                  <Sliders className="w-4 h-4" />
                  <span className="text-sm font-medium">More Filters</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Searches - Better mobile spacing */}
        <div className="text-center px-4">
          <p className="text-text-muted mb-4">Popular searches:</p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {popularSearches.map((search) => (
              <button
                key={search.label}
                onClick={() => router.push(search.path)}
                className="px-3 sm:px-4 py-2 bg-surface hover:bg-accent-light rounded-lg text-sm sm:text-base text-text-secondary hover:text-text-primary transition-colors border border-border"
              >
                {search.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Filters Modal */}
      <AdvancedFilters
        filters={{ ...filters, location }}
        onFiltersChange={setFilters}
        isOpen={isAdvancedFiltersOpen}
        onToggle={() => setIsAdvancedFiltersOpen(false)}
      />
    </div>
  )
}