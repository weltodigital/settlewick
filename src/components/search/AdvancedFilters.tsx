'use client'

import { useState } from 'react'
import { ChevronDown, X, Sliders } from 'lucide-react'
import type { PropertyFilters } from '@/types/filters'

interface AdvancedFiltersProps {
  filters: PropertyFilters
  onFiltersChange: (filters: PropertyFilters) => void
  isOpen: boolean
  onToggle: () => void
}

export default function AdvancedFilters({ filters, onFiltersChange, isOpen, onToggle }: AdvancedFiltersProps) {
  const [localFilters, setLocalFilters] = useState<PropertyFilters>(filters)

  const handleFilterChange = (key: string, value: any) => {
    const updated = { ...localFilters, [key]: value }
    setLocalFilters(updated)
  }

  const applyFilters = () => {
    onFiltersChange(localFilters)
    onToggle()
  }

  const resetFilters = () => {
    const resetFilters: PropertyFilters = {
      location: filters.location,
      listingType: filters.listingType,
      priceMin: filters.priceMin,
      priceMax: filters.priceMax,
      bedrooms: filters.bedrooms
    }
    setLocalFilters(resetFilters)
    onFiltersChange(resetFilters)
  }

  const propertyTypes = [
    { value: 'DETACHED', label: 'Detached' },
    { value: 'SEMI_DETACHED', label: 'Semi-Detached' },
    { value: 'TERRACED', label: 'Terraced' },
    { value: 'FLAT', label: 'Flat/Apartment' },
    { value: 'BUNGALOW', label: 'Bungalow' },
    { value: 'COTTAGE', label: 'Cottage' }
  ]

  const tenures = [
    { value: 'FREEHOLD', label: 'Freehold' },
    { value: 'LEASEHOLD', label: 'Leasehold' },
    { value: 'SHARED_OWNERSHIP', label: 'Shared Ownership' }
  ]

  const parkingTypes = [
    { value: 'GARAGE', label: 'Garage' },
    { value: 'DRIVEWAY', label: 'Driveway' },
    { value: 'ON_STREET', label: 'On Street' },
    { value: 'OFF_STREET', label: 'Off Street' }
  ]

  const gardenTypes = [
    { value: 'PRIVATE', label: 'Private' },
    { value: 'COMMUNAL', label: 'Communal' },
    { value: 'REAR', label: 'Rear Garden' },
    { value: 'FRONT', label: 'Front Garden' }
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Sliders className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-semibold text-text-primary">Advanced Filters</h2>
            </div>
            <button
              onClick={onToggle}
              className="p-2 text-text-muted hover:text-text-secondary"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Property Types */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4">Property Types</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {propertyTypes.map(type => (
                <label key={type.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localFilters.propertyTypes?.includes(type.value) || false}
                    onChange={(e) => {
                      const current = localFilters.propertyTypes || []
                      const updated = e.target.checked
                        ? [...current, type.value]
                        : current.filter(t => t !== type.value)
                      handleFilterChange('propertyTypes', updated.length > 0 ? updated : undefined)
                    }}
                    className="rounded border-border text-accent focus:ring-accent"
                  />
                  <span className="text-text-primary text-sm">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Floor Area */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4">Floor Area (sq ft)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Minimum</label>
                <input
                  type="number"
                  placeholder="Min sq ft"
                  value={localFilters.floorArea?.min || ''}
                  onChange={(e) => {
                    const min = e.target.value ? parseInt(e.target.value) : undefined
                    handleFilterChange('floorArea', {
                      ...localFilters.floorArea,
                      min
                    })
                  }}
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Maximum</label>
                <input
                  type="number"
                  placeholder="Max sq ft"
                  value={localFilters.floorArea?.max || ''}
                  onChange={(e) => {
                    const max = e.target.value ? parseInt(e.target.value) : undefined
                    handleFilterChange('floorArea', {
                      ...localFilters.floorArea,
                      max
                    })
                  }}
                  className="input-field w-full"
                />
              </div>
            </div>
          </div>

          {/* Bathrooms */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4">Bathrooms</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Minimum</label>
                <select
                  value={(localFilters.bathrooms as any)?.min || ''}
                  onChange={(e) => {
                    const min = e.target.value ? parseInt(e.target.value) : undefined
                    handleFilterChange('bathrooms', {
                      ...localFilters.bathrooms,
                      min
                    })
                  }}
                  className="input-field w-full"
                >
                  <option value="">Any</option>
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num}+</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Maximum</label>
                <select
                  value={(localFilters.bathrooms as any)?.max || ''}
                  onChange={(e) => {
                    const max = e.target.value ? parseInt(e.target.value) : undefined
                    handleFilterChange('bathrooms', {
                      ...localFilters.bathrooms,
                      max
                    })
                  }}
                  className="input-field w-full"
                >
                  <option value="">Any</option>
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tenure */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4">Tenure</h3>
            <div className="grid grid-cols-3 gap-3">
              {tenures.map(tenure => (
                <label key={tenure.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localFilters.tenure?.includes(tenure.value as any) || false}
                    onChange={(e) => {
                      const current = localFilters.tenure || []
                      const updated = e.target.checked
                        ? [...current, tenure.value]
                        : current.filter(t => t !== tenure.value)
                      handleFilterChange('tenure', updated.length > 0 ? updated : undefined)
                    }}
                    className="rounded border-border text-accent focus:ring-accent"
                  />
                  <span className="text-text-primary text-sm">{tenure.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* EPC Rating */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4">EPC Rating</h3>
            <div className="flex space-x-2">
              {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(rating => (
                <button
                  key={rating}
                  onClick={() => {
                    const current = localFilters.epcRating || []
                    const updated = current.includes(rating)
                      ? current.filter(r => r !== rating)
                      : [...current, rating]
                    handleFilterChange('epcRating', updated.length > 0 ? updated : undefined)
                  }}
                  className={`w-10 h-10 rounded-lg border font-semibold text-sm transition-colors ${
                    localFilters.epcRating?.includes(rating)
                      ? 'bg-accent text-white border-accent'
                      : 'bg-surface text-text-primary border-border hover:border-accent'
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>
          </div>

          {/* Parking */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4">Parking</h3>
            <div className="grid grid-cols-2 gap-3">
              {parkingTypes.map(parking => (
                <label key={parking.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localFilters.parkingType?.includes(parking.value as any) || false}
                    onChange={(e) => {
                      const current = localFilters.parkingType || []
                      const updated = e.target.checked
                        ? [...current, parking.value]
                        : current.filter(p => p !== parking.value)
                      handleFilterChange('parkingType', updated.length > 0 ? updated : undefined)
                    }}
                    className="rounded border-border text-accent focus:ring-accent"
                  />
                  <span className="text-text-primary text-sm">{parking.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Garden */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4">Garden</h3>
            <div className="grid grid-cols-2 gap-3">
              {gardenTypes.map(garden => (
                <label key={garden.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localFilters.gardenType?.includes(garden.value as any) || false}
                    onChange={(e) => {
                      const current = localFilters.gardenType || []
                      const updated = e.target.checked
                        ? [...current, garden.value]
                        : current.filter(g => g !== garden.value)
                      handleFilterChange('gardenType', updated.length > 0 ? updated : undefined)
                    }}
                    className="rounded border-border text-accent focus:ring-accent"
                  />
                  <span className="text-text-primary text-sm">{garden.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Property Features */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4">Property Features</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
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
              ].map(feature => (
                <label key={feature.key} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localFilters[feature.key as keyof PropertyFilters] as boolean || false}
                    onChange={(e) => {
                      handleFilterChange(feature.key, e.target.checked || undefined)
                    }}
                    className="rounded border-border text-accent focus:ring-accent"
                  />
                  <span className="text-text-primary text-sm">{feature.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Added to Market */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4">Added to Market</h3>
            <select
              value={localFilters.addedToMarket || ''}
              onChange={(e) => handleFilterChange('addedToMarket', e.target.value || undefined)}
              className="input-field w-full md:w-auto"
            >
              <option value="">Any time</option>
              <option value="1">Last 24 hours</option>
              <option value="3">Last 3 days</option>
              <option value="7">Last week</option>
              <option value="14">Last 2 weeks</option>
              <option value="30">Last month</option>
            </select>
          </div>

          {/* Keywords */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4">Keywords</h3>
            <input
              type="text"
              placeholder="e.g. sea view, modern, Victorian"
              value={localFilters.keywords || ''}
              onChange={(e) => handleFilterChange('keywords', e.target.value || undefined)}
              className="input-field w-full"
            />
            <p className="text-xs text-text-muted mt-1">
              Search property descriptions for specific terms
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-border bg-surface rounded-b-xl">
          <div className="flex items-center justify-between">
            <button
              onClick={resetFilters}
              className="text-accent hover:text-accent-dark font-medium"
            >
              Reset All Filters
            </button>
            <div className="flex items-center space-x-3">
              <button
                onClick={onToggle}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={applyFilters}
                className="btn-accent"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}