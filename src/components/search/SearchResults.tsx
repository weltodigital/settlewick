'use client'

import { useState } from 'react'
import PropertyCard from '@/components/property/PropertyCard'
import FilterPanel from './FilterPanel'
import { ChevronDown, Grid, List, Map, X } from 'lucide-react'
import type { PropertyWithDetails } from '@/types/property'
import type { PropertyFilters, ActiveFilter } from '@/types/filters'

interface SearchResultsProps {
  properties: PropertyWithDetails[]
  total: number
  filters: PropertyFilters
  onFiltersChange: (filters: PropertyFilters) => void
  loading?: boolean
}

export default function SearchResults({
  properties,
  total,
  filters,
  onFiltersChange,
  loading = false
}: SearchResultsProps) {
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'map'>('grid')
  const [sortBy, setSortBy] = useState(filters.sortBy || 'newest')
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false)

  const sortOptions = [
    { value: 'newest', label: 'Newest Listed' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'most_reduced', label: 'Most Reduced' }
  ]

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy as any)
    onFiltersChange({
      ...filters,
      sortBy: newSortBy as any
    })
  }

  const getActiveFilters = (): ActiveFilter[] => {
    const activeFilters: ActiveFilter[] = []

    if (filters.priceMin) {
      activeFilters.push({
        key: 'priceMin',
        value: filters.priceMin,
        label: 'Min Price',
        displayValue: `£${filters.priceMin.toLocaleString()}${filters.listingType === 'RENT' ? ' pcm' : ''}`
      })
    }

    if (filters.priceMax) {
      activeFilters.push({
        key: 'priceMax',
        value: filters.priceMax,
        label: 'Max Price',
        displayValue: `£${filters.priceMax.toLocaleString()}${filters.listingType === 'RENT' ? ' pcm' : ''}`
      })
    }

    if (filters.bedrooms && filters.bedrooms.length > 0) {
      activeFilters.push({
        key: 'bedrooms',
        value: filters.bedrooms,
        label: 'Bedrooms',
        displayValue: filters.bedrooms.map(b => `${b}+`).join(', ')
      })
    }

    if (filters.propertyType && filters.propertyType.length > 0) {
      activeFilters.push({
        key: 'propertyType',
        value: filters.propertyType,
        label: 'Property Type',
        displayValue: filters.propertyType.map(t =>
          t.replace('_', ' ').toLowerCase().replace(/^\w/, c => c.toUpperCase())
        ).join(', ')
      })
    }

    // Add boolean filters
    const booleanFilters = [
      { key: 'chainFree', label: 'Chain Free' },
      { key: 'newBuild', label: 'New Build' },
      { key: 'garage', label: 'Garage' },
      { key: 'garden', label: 'Garden' }
    ] as const

    booleanFilters.forEach(({ key, label }) => {
      if (filters[key]) {
        activeFilters.push({
          key,
          value: true,
          label,
          displayValue: label
        })
      }
    })

    return activeFilters
  }

  const removeFilter = (filterKey: keyof PropertyFilters) => {
    const newFilters = { ...filters }
    delete newFilters[filterKey]
    onFiltersChange(newFilters)
  }

  const clearAllFilters = () => {
    onFiltersChange({
      listingType: filters.listingType,
      location: filters.location
    })
  }

  const activeFilters = getActiveFilters()

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Filter Panel */}
      <FilterPanel
        filters={filters}
        onFiltersChange={onFiltersChange}
        isOpen={isFilterPanelOpen}
        onToggle={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
        resultCount={total}
      />

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Search Header */}
        <div className="bg-surface rounded-xl shadow-sm border border-border p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-text-primary">
                {filters.listingType === 'SALE' ? 'Properties for Sale' : 'Properties to Rent'}
                {filters.location && (
                  <span className="text-text-secondary"> in {filters.location}</span>
                )}
              </h1>
              <p className="text-text-secondary mt-1">
                {loading ? 'Searching...' : `${total.toLocaleString()} properties found`}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-secondary rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-surface text-primary shadow-sm'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                  title="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-surface text-primary shadow-sm'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                  title="List view"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'map'
                      ? 'bg-surface text-primary shadow-sm'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                  title="Map view"
                >
                  <Map className="w-4 h-4" />
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="appearance-none bg-surface border border-border rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="bg-surface rounded-xl shadow-sm border border-border p-4 mb-6">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-medium text-text-secondary">Active filters:</span>
              {activeFilters.map((filter) => (
                <div
                  key={`${filter.key}-${JSON.stringify(filter.value)}`}
                  className="flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-lg px-3 py-1"
                >
                  <span className="text-sm text-accent font-medium">
                    {filter.displayValue}
                  </span>
                  <button
                    onClick={() => removeFilter(filter.key)}
                    className="text-accent hover:text-accent-light"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {activeFilters.length > 2 && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-text-secondary hover:text-text-primary underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="aspect-[4/3] bg-secondary rounded-t-xl" />
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-secondary rounded" />
                  <div className="h-4 bg-secondary rounded w-2/3" />
                  <div className="h-4 bg-secondary rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : properties.length > 0 ? (
          <>
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onToggleSave={() => {
                      // TODO: Implement save functionality
                      console.log('Save property:', property.id)
                    }}
                    onHide={() => {
                      // TODO: Implement hide functionality
                      console.log('Hide property:', property.id)
                    }}
                  />
                ))}
              </div>
            )}

            {viewMode === 'list' && (
              <div className="space-y-4">
                {properties.map((property) => (
                  <div key={property.id} className="md:grid md:grid-cols-1">
                    <PropertyCard
                      property={property}
                      onToggleSave={() => console.log('Save property:', property.id)}
                      onHide={() => console.log('Hide property:', property.id)}
                    />
                  </div>
                ))}
              </div>
            )}

            {viewMode === 'map' && (
              <div className="bg-surface rounded-xl shadow-sm border border-border p-8 text-center">
                <div className="text-text-muted">
                  <Map className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Map View Coming Soon</h3>
                  <p>Interactive map with property pins and area drawing tools will be available here.</p>
                </div>
              </div>
            )}

            {/* Pagination */}
            {total > properties.length && (
              <div className="mt-12 flex justify-center">
                <button className="btn-primary">
                  Load More Properties
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-surface rounded-xl shadow-sm border border-border p-12 text-center">
            <div className="text-text-muted">
              <h3 className="text-lg font-semibold mb-2">No properties found</h3>
              <p className="mb-4">Try adjusting your search criteria or removing some filters.</p>
              <button
                onClick={clearAllFilters}
                className="btn-secondary"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}