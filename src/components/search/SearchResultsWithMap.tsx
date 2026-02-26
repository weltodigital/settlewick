'use client'

import { useState, useCallback } from 'react'
import PropertyCard from '@/components/property/PropertyCard'
import FilterPanel from './FilterPanel'
import AdvancedFilters from './AdvancedFilters'
import AISmartSearch from './AISmartSearch'
import PropertyMap from '@/components/map/PropertyMap'
import MapDrawTools from '@/components/map/MapDrawTools'
import { ChevronDown, Grid, List, Map, X, MapPin, Sliders } from 'lucide-react'
import type { PropertyWithDetails } from '@/types/property'
import type { PropertyFilters, ActiveFilter } from '@/types/filters'
import { LatLngBounds } from 'leaflet'
import { useSavedProperties } from '@/hooks/useSavedProperties'
import SaveSearchButton from './SaveSearchButton'
import LoadingCard from '@/components/ui/LoadingCard'
import ErrorState from '@/components/ui/ErrorState'
import ComparisonBar from '@/components/property/ComparisonBar'

interface SearchResultsWithMapProps {
  properties: PropertyWithDetails[]
  total: number
  filters: PropertyFilters
  onFiltersChange: (filters: PropertyFilters) => void
  loading?: boolean
  error?: string | null
  onRetry?: () => void
}

export default function SearchResultsWithMap({
  properties,
  total,
  filters,
  onFiltersChange,
  loading = false,
  error = null,
  onRetry
}: SearchResultsWithMapProps) {
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'map' | 'split'>('grid')
  const [sortBy, setSortBy] = useState(filters.sortBy || 'newest')
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [mapCenter, setMapCenter] = useState<[number, number]>([50.8058, -1.0872])
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false)
  const { toggleSave, isSaved } = useSavedProperties()

  const sortOptions = [
    { value: 'newest', label: 'Newest Listed' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'most_reduced', label: 'Most Reduced' },
    { value: 'nearest', label: 'Nearest' }
  ]

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy as any)
    onFiltersChange({
      ...filters,
      sortBy: newSortBy as any
    })
  }

  const handlePropertySelect = useCallback((propertyId: string | null) => {
    setSelectedProperty(propertyId)

    // Scroll to property card if in split view
    if (propertyId && (viewMode === 'split' || viewMode === 'grid' || viewMode === 'list')) {
      const element = document.getElementById(`property-${propertyId}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [viewMode])

  const handleMapBoundsChange = useCallback((bounds: LatLngBounds) => {
    // Update filters with new bounding box for server-side filtering
    const boundingBox = {
      swLat: bounds.getSouth(),
      swLng: bounds.getWest(),
      neLat: bounds.getNorth(),
      neLng: bounds.getEast()
    }

    onFiltersChange({
      ...filters,
      boundingBox,
      polygon: undefined // Clear polygon when using bounds
    })
  }, [filters, onFiltersChange])

  const handleAreaDrawn = useCallback((coordinates: Array<[number, number]>) => {
    onFiltersChange({
      ...filters,
      polygon: coordinates,
      boundingBox: undefined // Clear bounding box when using polygon
    })
  }, [filters, onFiltersChange])

  const handleAreaCleared = useCallback(() => {
    onFiltersChange({
      ...filters,
      polygon: undefined,
      boundingBox: undefined
    })
  }, [filters, onFiltersChange])

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
          t.replace('_', ' ').toLowerCase().replace(/^\w/, (c: string) => c.toUpperCase())
        ).join(', ')
      })
    }

    if (filters.polygon && filters.polygon.length > 0) {
      activeFilters.push({
        key: 'polygon',
        value: filters.polygon,
        label: 'Custom Area',
        displayValue: 'Custom search area'
      })
    }

    // Add property type filters
    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      activeFilters.push({
        key: 'propertyTypes',
        value: filters.propertyTypes,
        label: 'Property Types',
        displayValue: filters.propertyTypes.map(t =>
          t.replace('_', ' ').toLowerCase().replace(/^\w/, (c: string) => c.toUpperCase())
        ).join(', ')
      })
    }

    // Add floor area filter
    if (filters.floorArea?.min || filters.floorArea?.max) {
      const min = filters.floorArea.min ? `${filters.floorArea.min}` : ''
      const max = filters.floorArea.max ? `${filters.floorArea.max}` : ''
      activeFilters.push({
        key: 'floorArea',
        value: filters.floorArea,
        label: 'Floor Area',
        displayValue: `${min}${min && max ? '-' : ''}${max} sq ft`
      })
    }

    // Add bathrooms filter
    if ((filters.bathrooms as any)?.min || (filters.bathrooms as any)?.max) {
      const min = (filters.bathrooms as any).min ? `${(filters.bathrooms as any).min}+` : ''
      const max = (filters.bathrooms as any).max ? `${(filters.bathrooms as any).max}` : ''
      activeFilters.push({
        key: 'bathrooms',
        value: filters.bathrooms,
        label: 'Bathrooms',
        displayValue: min || max
      })
    }

    // Add tenure filter
    if (filters.tenure && filters.tenure.length > 0) {
      activeFilters.push({
        key: 'tenure',
        value: filters.tenure,
        label: 'Tenure',
        displayValue: filters.tenure.join(', ')
      })
    }

    // Add EPC rating filter
    if (filters.epcRating && filters.epcRating.length > 0) {
      activeFilters.push({
        key: 'epcRating',
        value: filters.epcRating,
        label: 'EPC Rating',
        displayValue: filters.epcRating.join(', ')
      })
    }

    // Add parking type filter
    if (filters.parkingType && filters.parkingType.length > 0) {
      activeFilters.push({
        key: 'parkingType',
        value: filters.parkingType,
        label: 'Parking',
        displayValue: filters.parkingType.map(p =>
          p.replace('_', ' ').toLowerCase().replace(/^\w/, (c: string) => c.toUpperCase())
        ).join(', ')
      })
    }

    // Add garden type filter
    if (filters.gardenType && filters.gardenType.length > 0) {
      activeFilters.push({
        key: 'gardenType',
        value: filters.gardenType,
        label: 'Garden',
        displayValue: filters.gardenType.map(g =>
          g.replace('_', ' ').toLowerCase().replace(/^\w/, (c: string) => c.toUpperCase())
        ).join(', ')
      })
    }

    // Add keywords filter
    if (filters.keywords) {
      activeFilters.push({
        key: 'keywords',
        value: filters.keywords,
        label: 'Keywords',
        displayValue: `"${filters.keywords}"`
      })
    }

    // Add boolean filters
    const booleanFilters = [
      { key: 'chainFree', label: 'Chain Free' },
      { key: 'newBuild', label: 'New Build' },
      { key: 'periodProperty', label: 'Period Property' },
      { key: 'garage', label: 'Garage' },
      { key: 'enSuite', label: 'En-suite' },
      { key: 'conservatory', label: 'Conservatory' },
      { key: 'doubleGlazing', label: 'Double Glazing' },
      { key: 'underfloorHeating', label: 'Underfloor Heating' },
      { key: 'solarPanels', label: 'Solar Panels' },
      { key: 'logBurner', label: 'Log Burner' },
      { key: 'swimmingPool', label: 'Swimming Pool' },
      { key: 'homeOffice', label: 'Home Office' }
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
        {/* AI Smart Search */}
        <div className="mb-6">
          <AISmartSearch
            onSearchExecute={(newFilters, searchQuery) => {
              onFiltersChange(newFilters)
            }}
            currentFilters={filters}
          />
        </div>

        {/* Search Header */}
        <div className="bg-surface rounded-xl shadow-sm border border-border p-4 md:p-6 mb-6">
          <div className="flex flex-col gap-4">
            {/* Title Section */}
            <div className="flex-1">
              <h1 className="text-xl md:text-2xl font-bold text-text-primary">
                {filters.listingType === 'SALE' ? 'Properties for Sale' : 'Properties to Rent'}
                {filters.location && (
                  <span className="text-text-secondary"> in {filters.location}</span>
                )}
              </h1>
              <p className="text-text-secondary mt-1">
                {loading ? 'Searching...' : `${total.toLocaleString()} properties found`}
              </p>
            </div>

            {/* Mobile Action Row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              {/* First Row - Save Search & Advanced Filters */}
              <div className="flex items-center gap-2 flex-1">
                <SaveSearchButton
                  filters={filters}
                  total={total}
                />
                <button
                  onClick={() => setIsAdvancedFiltersOpen(true)}
                  className="flex items-center space-x-2 px-3 md:px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors border border-border text-sm"
                >
                  <Sliders className="w-4 h-4 text-primary" />
                  <span className="text-text-primary font-medium hidden sm:inline">Advanced</span>
                  <span className="text-text-primary font-medium sm:hidden">Filters</span>
                </button>
              </div>

              {/* Second Row - View Mode & Sort */}
              <div className="flex items-center gap-3">
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
                  {/* Hide split view on mobile */}
                  <button
                    onClick={() => setViewMode('split')}
                    className={`hidden md:block p-2 rounded-md transition-colors ${
                      viewMode === 'split'
                        ? 'bg-surface text-primary shadow-sm'
                        : 'text-text-muted hover:text-text-primary'
                    }`}
                    title="Split view"
                  >
                    <div className="flex gap-1">
                      <div className="w-2 h-4 bg-current rounded-sm opacity-70" />
                      <div className="w-2 h-4 bg-current rounded-sm" />
                    </div>
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
                    className="appearance-none bg-surface border border-border rounded-lg px-3 md:px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent min-w-[120px]"
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
        </div>

        {/* Active Filters - Better mobile wrapping */}
        {activeFilters.length > 0 && (
          <div className="bg-surface rounded-xl shadow-sm border border-border p-4 mb-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text-secondary">Active filters:</span>
                {activeFilters.length > 1 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-text-secondary hover:text-text-primary underline"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
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
              </div>
            </div>
          </div>
        )}

        {/* Results Content */}
        {error ? (
          <ErrorState
            title="Unable to load properties"
            message={error}
            type="network"
            onRetry={onRetry}
          />
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
            <LoadingCard viewMode="grid" count={8} />
          </div>
        ) : properties.length > 0 ? (
          <>
            {/* Map Only View */}
            {viewMode === 'map' && (
              <div className="relative">
                <PropertyMap
                  properties={properties}
                  selectedProperty={selectedProperty}
                  onPropertySelect={handlePropertySelect}
                  height="70vh"
                  onBoundsChange={handleMapBoundsChange}
                  showDrawTools={true}
                />
                <MapDrawTools
                  onAreaDrawn={handleAreaDrawn}
                  onAreaCleared={handleAreaCleared}
                  isDrawing={isDrawing}
                  onDrawingStateChange={setIsDrawing}
                />
              </div>
            )}

            {/* Split View - Hide on mobile, fallback to grid */}
            {viewMode === 'split' && (
              <div className="hidden md:grid md:grid-cols-2 gap-6 h-[80vh]">
                {/* Properties List */}
                <div className="overflow-y-auto space-y-4 pr-2">
                  {properties.map((property) => (
                    <div
                      key={property.id}
                      id={`property-${property.id}`}
                      className={`transition-all ${
                        selectedProperty === property.id
                          ? 'ring-2 ring-accent ring-offset-2 ring-offset-background'
                          : ''
                      }`}
                      onClick={() => handlePropertySelect(property.id)}
                    >
                      <PropertyCard
                        property={property}
                        onToggleSave={toggleSave}
                        onHide={() => console.log('Hide property:', property.id)}
                        isSaved={isSaved(property.id)}
                        isViewed={selectedProperty === property.id}
                        viewMode="grid"
                      />
                    </div>
                  ))}
                </div>

                {/* Map */}
                <div className="relative">
                  <PropertyMap
                    properties={properties}
                    selectedProperty={selectedProperty}
                    onPropertySelect={handlePropertySelect}
                    height="100%"
                    onBoundsChange={handleMapBoundsChange}
                    showDrawTools={true}
                  />
                  <MapDrawTools
                    onAreaDrawn={handleAreaDrawn}
                    onAreaCleared={handleAreaCleared}
                    isDrawing={isDrawing}
                    onDrawingStateChange={setIsDrawing}
                  />
                </div>
              </div>
            )}

            {/* Mobile fallback for split view */}
            {viewMode === 'split' && (
              <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-6">
                {properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onToggleSave={toggleSave}
                    onHide={() => console.log('Hide property:', property.id)}
                    isSaved={isSaved(property.id)}
                    viewMode="grid"
                  />
                ))}
              </div>
            )}

            {/* Grid View - Better mobile responsiveness */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
                {properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onToggleSave={toggleSave}
                    onHide={() => console.log('Hide property:', property.id)}
                    isSaved={isSaved(property.id)}
                    viewMode="grid"
                  />
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div className="space-y-4">
                {loading ? (
                  <LoadingCard viewMode="list" count={6} />
                ) : (
                  properties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      onToggleSave={toggleSave}
                      onHide={() => console.log('Hide property:', property.id)}
                      isSaved={isSaved(property.id)}
                      viewMode="list"
                    />
                  ))
                )}
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
          <ErrorState
            title="No properties found"
            message="Try adjusting your search criteria or removing some filters to see more results."
            type="not-found"
            onRetry={clearAllFilters}
          />
        )}
      </div>

      {/* Advanced Filters Modal */}
      <AdvancedFilters
        filters={filters}
        onFiltersChange={onFiltersChange}
        isOpen={isAdvancedFiltersOpen}
        onToggle={() => setIsAdvancedFiltersOpen(false)}
      />

      {/* Property Comparison Bar */}
      <ComparisonBar isVisible={false} onClose={() => {}} />
    </div>
  )
}