'use client'

import { X } from 'lucide-react'
import type { PropertyFilters } from '@/types/filters'

interface ActiveFilterPillsProps {
  filters: PropertyFilters
  onRemoveFilter: (key: keyof PropertyFilters, value?: string) => void
  onClearAll: () => void
}

export default function ActiveFilterPills({ filters, onRemoveFilter, onClearAll }: ActiveFilterPillsProps) {
  const getActiveFilters = () => {
    const activeFilters: Array<{
      key: keyof PropertyFilters
      label: string
      value?: string
    }> = []

    // Price range
    if (filters.priceMin || filters.priceMax) {
      const minPrice = filters.priceMin ? `£${Math.round(filters.priceMin / 100).toLocaleString()}` : ''
      const maxPrice = filters.priceMax ? `£${Math.round(filters.priceMax / 100).toLocaleString()}` : ''

      let priceLabel = ''
      if (minPrice && maxPrice) {
        priceLabel = `${minPrice} - ${maxPrice}`
      } else if (minPrice) {
        priceLabel = `${minPrice}+`
      } else if (maxPrice) {
        priceLabel = `Up to ${maxPrice}`
      }

      if (priceLabel) {
        activeFilters.push({
          key: 'priceMin' as keyof PropertyFilters,
          label: `Price: ${priceLabel}`
        })
      }
    }

    // Bedrooms
    if (filters.bedrooms && filters.bedrooms.length > 0) {
      const bedroomsLabel = filters.bedrooms.length === 1
        ? `${filters.bedrooms[0]}+ beds`
        : `${filters.bedrooms.join(', ')} beds`

      activeFilters.push({
        key: 'bedrooms',
        label: bedroomsLabel
      })
    }

    // Bathrooms
    if (filters.bathrooms) {
      if (Array.isArray(filters.bathrooms)) {
        activeFilters.push({
          key: 'bathrooms',
          label: `${filters.bathrooms.join(', ')} baths`
        })
      } else if (typeof filters.bathrooms === 'object' && filters.bathrooms.min) {
        activeFilters.push({
          key: 'bathrooms',
          label: `${filters.bathrooms.min}+ baths`
        })
      }
    }

    // Property types
    if (filters.propertyType && filters.propertyType.length > 0) {
      filters.propertyType.forEach(type => {
        const typeLabel = type.replace('_', '-').replace(/\b\w/g, l => l.toUpperCase())
        activeFilters.push({
          key: 'propertyType',
          label: typeLabel,
          value: type
        })
      })
    }

    // Size filters
    if (filters.receptionRoomsMin) {
      activeFilters.push({
        key: 'receptionRoomsMin',
        label: `${filters.receptionRoomsMin}+ receptions`
      })
    }

    if (filters.floorAreaMin || filters.floorAreaMax) {
      let areaLabel = ''
      if (filters.floorAreaMin && filters.floorAreaMax) {
        areaLabel = `${filters.floorAreaMin}-${filters.floorAreaMax} sq ft`
      } else if (filters.floorAreaMin) {
        areaLabel = `${filters.floorAreaMin}+ sq ft`
      } else if (filters.floorAreaMax) {
        areaLabel = `Up to ${filters.floorAreaMax} sq ft`
      }

      if (areaLabel) {
        activeFilters.push({
          key: 'floorAreaMin' as keyof PropertyFilters,
          label: areaLabel
        })
      }
    }

    // Boolean filters
    const booleanFilters: Array<{key: keyof PropertyFilters, label: string}> = [
      { key: 'chainFree', label: 'Chain Free' },
      { key: 'newBuild', label: 'New Build' },
      { key: 'periodProperty', label: 'Period Property' },
      { key: 'modern', label: 'Modern' },
      { key: 'cottage', label: 'Cottage' },
      { key: 'utilityRoom', label: 'Utility Room' },
      { key: 'basement', label: 'Basement' },
      { key: 'conservatory', label: 'Conservatory' },
      { key: 'homeOffice', label: 'Home Office' },
      { key: 'enSuite', label: 'En-suite' },
      { key: 'bathtub', label: 'Bathtub' },
      { key: 'patio', label: 'Patio' },
      { key: 'garage', label: 'Garage' },
      { key: 'balcony', label: 'Balcony' },
      { key: 'garden', label: 'Garden' },
      { key: 'parking', label: 'Parking' },
      { key: 'petsAllowed', label: 'Pets Allowed' },
      { key: 'billsIncluded', label: 'Bills Included' },
      { key: 'studentsWelcome', label: 'Students Welcome' },
      { key: 'furnished', label: 'Furnished' },
      { key: 'unfurnished', label: 'Unfurnished' },
      { key: 'partFurnished', label: 'Part Furnished' }
    ]

    booleanFilters.forEach(({ key, label }) => {
      if (filters[key] === true) {
        activeFilters.push({ key, label })
      }
    })

    // Multi-select filters
    const multiSelectFilters: Array<{key: keyof PropertyFilters, label: string}> = [
      { key: 'tenure', label: 'Tenure' },
      { key: 'epcRating', label: 'EPC' },
      { key: 'gardenType', label: 'Garden' },
      { key: 'parkingType', label: 'Parking' }
    ]

    multiSelectFilters.forEach(({ key, label }) => {
      const values = filters[key] as string[] | undefined
      if (values && values.length > 0) {
        values.forEach(value => {
          const valueLabel = value.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
          activeFilters.push({
            key,
            label: `${label}: ${valueLabel}`,
            value
          })
        })
      }
    })

    return activeFilters
  }

  const activeFilters = getActiveFilters()

  if (activeFilters.length === 0) {
    return null
  }

  return (
    <div className="bg-surface rounded-lg p-4 border border-border">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-medium text-text-primary">
          Active Filters ({activeFilters.length})
        </div>
        <button
          onClick={onClearAll}
          className="text-xs text-text-muted hover:text-accent transition-colors"
        >
          Clear all
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {activeFilters.map((filter, index) => (
          <div
            key={`${filter.key}-${filter.value || index}`}
            className="flex items-center gap-1 bg-accent/10 text-accent border border-accent/20 rounded-full px-3 py-1 text-sm"
          >
            <span>{filter.label}</span>
            <button
              onClick={() => onRemoveFilter(filter.key, filter.value)}
              className="hover:bg-accent/20 rounded-full p-0.5 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}