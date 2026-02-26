'use client'

import { useState } from 'react'
import { X, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react'
import type { PropertyFilters } from '@/types/filters'
import { PROPERTY_FEATURE_GROUPS } from '@/types/filters'

interface FilterPanelProps {
  filters: PropertyFilters
  onFiltersChange: (filters: PropertyFilters) => void
  isOpen: boolean
  onToggle: () => void
  resultCount?: number
}

export default function FilterPanel({
  filters,
  onFiltersChange,
  isOpen,
  onToggle,
  resultCount = 0
}: FilterPanelProps) {
  const [expandedSections, setExpandedSections] = useState({
    basics: true,
    features: false,
    tenure: false,
    energy: false,
    outdoor: false,
    status: false,
    rental: false
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const updateFilter = (key: keyof PropertyFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      listingType: filters.listingType,
      location: filters.location
    })
  }

  const bedroomOptions = [
    { value: 1, label: '1+' },
    { value: 2, label: '2+' },
    { value: 3, label: '3+' },
    { value: 4, label: '4+' },
    { value: 5, label: '5+' }
  ]

  const bathroomOptions = [
    { value: 1, label: '1+' },
    { value: 2, label: '2+' },
    { value: 3, label: '3+' },
    { value: 4, label: '4+' }
  ]

  const propertyTypeOptions = [
    { value: 'FLAT', label: 'Flat' },
    { value: 'TERRACED', label: 'Terraced' },
    { value: 'SEMI_DETACHED', label: 'Semi-detached' },
    { value: 'DETACHED', label: 'Detached' },
    { value: 'BUNGALOW', label: 'Bungalow' },
    { value: 'MAISONETTE', label: 'Maisonette' }
  ]

  const tenureOptions = [
    { value: 'FREEHOLD', label: 'Freehold' },
    { value: 'LEASEHOLD', label: 'Leasehold' },
    { value: 'SHARE_OF_FREEHOLD', label: 'Share of Freehold' }
  ]

  const FilterSection = ({
    title,
    sectionKey,
    children
  }: {
    title: string
    sectionKey: keyof typeof expandedSections
    children: React.ReactNode
  }) => (
    <div className="border-b border-border pb-6 mb-6">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full mb-4 text-left"
      >
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        {expandedSections[sectionKey] ?
          <ChevronUp className="w-5 h-5" /> :
          <ChevronDown className="w-5 h-5" />
        }
      </button>
      {expandedSections[sectionKey] && children}
    </div>
  )

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={onToggle}
        className="md:hidden fixed bottom-6 right-6 z-50 bg-primary text-white p-4 rounded-full shadow-lg flex items-center gap-2"
      >
        <SlidersHorizontal className="w-5 h-5" />
        <span className="font-medium">Filters</span>
        {resultCount > 0 && (
          <span className="bg-accent px-2 py-1 rounded text-sm">
            {resultCount}
          </span>
        )}
      </button>

      {/* Filter Panel */}
      <div className={`
        ${isOpen ? 'block' : 'hidden'} md:block
        fixed md:relative inset-0 md:inset-auto
        z-40 md:z-auto
        bg-background md:bg-transparent
        overflow-y-auto
        w-full md:w-80
        p-4 md:p-0
      `}>
        <div className="bg-surface rounded-xl shadow-sm border border-border h-full md:h-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-bold text-text-primary">Filters</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={clearAllFilters}
                className="text-text-secondary hover:text-text-primary text-sm"
              >
                Clear all
              </button>
              <button
                onClick={onToggle}
                className="md:hidden p-2 hover:bg-secondary rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Basics */}
            <FilterSection title="Basics" sectionKey="basics">
              <div className="space-y-4">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Price Range
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      placeholder={filters.listingType === 'sale' ? 'Min £' : 'Min £ pcm'}
                      value={filters.priceMin || ''}
                      onChange={(e) => updateFilter('priceMin', e.target.value ? Number(e.target.value) : undefined)}
                      className="input-field text-sm"
                    />
                    <input
                      type="number"
                      placeholder={filters.listingType === 'sale' ? 'Max £' : 'Max £ pcm'}
                      value={filters.priceMax || ''}
                      onChange={(e) => updateFilter('priceMax', e.target.value ? Number(e.target.value) : undefined)}
                      className="input-field text-sm"
                    />
                  </div>
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Bedrooms
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {bedroomOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => {
                          const current = filters.bedrooms || []
                          const updated = current.includes(option.value)
                            ? current.filter(v => v !== option.value)
                            : [...current, option.value]
                          updateFilter('bedrooms', updated.length > 0 ? updated : undefined)
                        }}
                        className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                          filters.bedrooms?.includes(option.value)
                            ? 'bg-accent text-white border-accent'
                            : 'bg-surface border-border hover:border-accent'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bathrooms */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Bathrooms
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {bathroomOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => {
                          const current = (filters.bathrooms as number[]) || []
                          const updated = current.includes(option.value)
                            ? current.filter(v => v !== option.value)
                            : [...current, option.value]
                          updateFilter('bathrooms', updated.length > 0 ? updated : undefined)
                        }}
                        className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                          (filters.bathrooms as number[])?.includes(option.value)
                            ? 'bg-accent text-white border-accent'
                            : 'bg-surface border-border hover:border-accent'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Property Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {propertyTypeOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => {
                          const current = filters.propertyType || []
                          const updated = current.includes(option.value as any)
                            ? current.filter(v => v !== option.value)
                            : [...current, option.value as any]
                          updateFilter('propertyType', updated.length > 0 ? updated : undefined)
                        }}
                        className={`px-3 py-2 rounded-lg text-sm border transition-colors text-left ${
                          filters.propertyType?.includes(option.value as any)
                            ? 'bg-accent text-white border-accent'
                            : 'bg-surface border-border hover:border-accent'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </FilterSection>

            {/* Property Features */}
            <FilterSection title="Property Features" sectionKey="features">
              <div className="space-y-4">
                {Object.entries(PROPERTY_FEATURE_GROUPS).map(([groupName, features]) => (
                  <div key={groupName}>
                    <h4 className="text-sm font-medium text-text-secondary mb-2">{groupName}</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {features.slice(0, 4).map(feature => (
                        <label
                          key={feature}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={filters[feature as keyof PropertyFilters] === true}
                            onChange={(e) => updateFilter(feature as keyof PropertyFilters, e.target.checked || undefined)}
                            className="w-4 h-4 text-accent border-border rounded focus:ring-accent"
                          />
                          <span className="text-sm text-text-primary">
                            {feature.replace(/([A-Z])/g, ' $1').replace(/^./, (str: string) => str.toUpperCase())}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </FilterSection>

            {/* Status */}
            <FilterSection title="Status & Preferences" sectionKey="status">
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.chainFree === true}
                    onChange={(e) => updateFilter('chainFree', e.target.checked || undefined)}
                    className="w-4 h-4 text-accent border-border rounded focus:ring-accent"
                  />
                  <span className="text-sm text-text-primary">Chain Free Only</span>
                </label>
                <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.newBuild === true}
                    onChange={(e) => updateFilter('newBuild', e.target.checked || undefined)}
                    className="w-4 h-4 text-accent border-border rounded focus:ring-accent"
                  />
                  <span className="text-sm text-text-primary">New Build Only</span>
                </label>
                <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.priceReduced === true}
                    onChange={(e) => updateFilter('priceReduced', e.target.checked || undefined)}
                    className="w-4 h-4 text-accent border-border rounded focus:ring-accent"
                  />
                  <span className="text-sm text-text-primary">Price Reduced Only</span>
                </label>
                <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.excludeUnderOffer === true}
                    onChange={(e) => updateFilter('excludeUnderOffer', e.target.checked || undefined)}
                    className="w-4 h-4 text-accent border-border rounded focus:ring-accent"
                  />
                  <span className="text-sm text-text-primary">Exclude Under Offer/SSTC</span>
                </label>
              </div>
            </FilterSection>

            {/* Rental Specific Filters */}
            {filters.listingType === 'rent' && (
              <FilterSection title="Rental Preferences" sectionKey="rental">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Furnished
                    </label>
                    <div className="space-y-2">
                      {['FURNISHED', 'UNFURNISHED', 'PART_FURNISHED'].map(option => (
                        <label
                          key={option}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={filters.furnished?.includes(option as any) || false}
                            onChange={(e) => {
                              const current = filters.furnished || []
                              const updated = e.target.checked
                                ? [...current, option as any]
                                : current.filter(v => v !== option)
                              updateFilter('furnished', updated.length > 0 ? updated : undefined)
                            }}
                            className="w-4 h-4 text-accent border-border rounded focus:ring-accent"
                          />
                          <span className="text-sm text-text-primary">
                            {option.replace('_', ' ').toLowerCase().replace(/^\w/, (c: string) => c.toUpperCase())}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.petsAllowed === true}
                      onChange={(e) => updateFilter('petsAllowed', e.target.checked || undefined)}
                      className="w-4 h-4 text-accent border-border rounded focus:ring-accent"
                    />
                    <span className="text-sm text-text-primary">Pets Allowed</span>
                  </label>

                  <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.billsIncluded === true}
                      onChange={(e) => updateFilter('billsIncluded', e.target.checked || undefined)}
                      className="w-4 h-4 text-accent border-border rounded focus:ring-accent"
                    />
                    <span className="text-sm text-text-primary">Bills Included</span>
                  </label>
                </div>
              </FilterSection>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={onToggle}
        />
      )}
    </>
  )
}