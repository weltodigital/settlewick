'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, X, Sliders } from 'lucide-react'
import type { PropertyFilters } from '@/types/filters'

interface ComprehensiveFiltersProps {
  filters: PropertyFilters
  onFiltersChange: (filters: PropertyFilters) => void
  isOpen: boolean
  onToggle: () => void
}

export default function ComprehensiveFilters({ filters, onFiltersChange, isOpen, onToggle }: ComprehensiveFiltersProps) {
  const [localFilters, setLocalFilters] = useState<PropertyFilters>(filters)
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({})

  const handleFilterChange = (key: keyof PropertyFilters, value: any) => {
    const updated = { ...localFilters, [key]: value }
    setLocalFilters(updated)

    // Auto-apply filters for instant feedback
    onFiltersChange(updated)
  }

  const handleArrayToggle = (key: keyof PropertyFilters, value: string) => {
    const currentArray = (localFilters[key] as string[]) || []
    const updated = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value]
    handleFilterChange(key, updated.length > 0 ? updated : undefined)
  }

  const applyFilters = () => {
    onFiltersChange(localFilters)
    onToggle()
  }

  const clearAllFilters = () => {
    const basicFilters: PropertyFilters = {
      listingType: filters.listingType,
      location: filters.location
    }
    setLocalFilters(basicFilters)
  }

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const getActiveFilterCount = () => {
    let count = 0
    Object.keys(localFilters).forEach(key => {
      if (key !== 'listingType' && key !== 'location' && localFilters[key as keyof PropertyFilters] !== undefined) {
        count++
      }
    })
    return count
  }

  if (!isOpen) return null

  const isRental = localFilters.listingType === 'rent' || localFilters.listingType === 'RENT'

  return (
    <div className="fixed inset-0 bg-black/50 z-50">
      <div className="h-full flex">
        {/* Desktop: Sidebar, Mobile: Full screen */}
        <div className="bg-background w-full md:w-96 lg:w-[420px] h-full flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sliders className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-semibold text-text-primary">Filters</h2>
                {getActiveFilterCount() > 0 && (
                  <span className="bg-accent text-white text-xs px-2 py-1 rounded-full">
                    {getActiveFilterCount()}
                  </span>
                )}
              </div>
              <button
                onClick={onToggle}
                className="p-2 text-text-muted hover:text-text-secondary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filters Content - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-6">

              {/* Section 1: Price & Size */}
              <FilterSection
                title="Price & Size"
                isCollapsed={collapsedSections['priceSize']}
                onToggle={() => toggleSection('priceSize')}
              >
                {/* Price Range */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-text-primary">
                    Price Range {isRental ? '(per month)' : ''}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={localFilters.priceMin || ''}
                      onChange={(e) => handleFilterChange('priceMin', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="input-field text-sm"
                    >
                      <option value="">Min price</option>
                      {isRental ? [
                        300, 400, 500, 600, 700, 800, 900, 1000, 1250, 1500, 1750, 2000, 2500, 3000, 4000, 5000
                      ].map(price => (
                        <option key={price} value={price * 100}>£{price}</option>
                      )) : [
                        50000, 75000, 100000, 125000, 150000, 175000, 200000, 225000, 250000, 275000, 300000,
                        325000, 350000, 375000, 400000, 450000, 500000, 550000, 600000, 650000, 700000, 750000,
                        800000, 900000, 1000000, 1250000, 1500000, 2000000, 3000000, 5000000
                      ].map(price => (
                        <option key={price} value={price * 100}>£{(price / 1000)}k</option>
                      ))}
                    </select>
                    <select
                      value={localFilters.priceMax || ''}
                      onChange={(e) => handleFilterChange('priceMax', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="input-field text-sm"
                    >
                      <option value="">Max price</option>
                      {isRental ? [
                        300, 400, 500, 600, 700, 800, 900, 1000, 1250, 1500, 1750, 2000, 2500, 3000, 4000, 5000
                      ].map(price => (
                        <option key={price} value={price * 100}>£{price}</option>
                      )) : [
                        50000, 75000, 100000, 125000, 150000, 175000, 200000, 225000, 250000, 275000, 300000,
                        325000, 350000, 375000, 400000, 450000, 500000, 550000, 600000, 650000, 700000, 750000,
                        800000, 900000, 1000000, 1250000, 1500000, 2000000, 3000000, 5000000
                      ].map(price => (
                        <option key={price} value={price * 100}>£{(price / 1000)}k</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Bedrooms */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-text-primary">Bedrooms</label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={Array.isArray(localFilters.bedrooms) ? localFilters.bedrooms[0] || '' : ''}
                      onChange={(e) => handleFilterChange('bedrooms', e.target.value ? [parseInt(e.target.value)] : undefined)}
                      className="input-field text-sm"
                    >
                      <option value="">Min beds</option>
                      <option value="0">Studio</option>
                      {[1,2,3,4,5,6,7].map(num => (
                        <option key={num} value={num}>{num}+</option>
                      ))}
                    </select>
                    <select
                      value={Array.isArray(localFilters.bedrooms) ? localFilters.bedrooms[1] || '' : ''}
                      onChange={(e) => {
                        const minBeds = Array.isArray(localFilters.bedrooms) ? localFilters.bedrooms[0] : undefined
                        const maxBeds = e.target.value ? parseInt(e.target.value) : undefined
                        if (minBeds !== undefined || maxBeds !== undefined) {
                          handleFilterChange('bedrooms', [minBeds || 0, maxBeds || 10])
                        }
                      }}
                      className="input-field text-sm"
                    >
                      <option value="">Max beds</option>
                      {[1,2,3,4,5,6,7].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Bathrooms */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-text-primary">Bathrooms</label>
                  <select
                    value={typeof localFilters.bathrooms === 'object' ? localFilters.bathrooms?.min || '' : ''}
                    onChange={(e) => {
                      const min = e.target.value ? parseInt(e.target.value) : undefined
                      handleFilterChange('bathrooms', min ? { min } : undefined)
                    }}
                    className="input-field text-sm"
                  >
                    <option value="">Min bathrooms</option>
                    {[1,2,3,4,5].map(num => (
                      <option key={num} value={num}>{num}+</option>
                    ))}
                  </select>
                </div>

                {/* Reception Rooms */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-text-primary">Reception Rooms</label>
                  <select
                    value={localFilters.receptionRoomsMin || ''}
                    onChange={(e) => handleFilterChange('receptionRoomsMin', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="input-field text-sm"
                  >
                    <option value="">Any</option>
                    {[1,2,3,4].map(num => (
                      <option key={num} value={num}>{num}+</option>
                    ))}
                  </select>
                </div>

                {/* Floor Area */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-text-primary">Floor Area (sq ft)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={localFilters.floorAreaMin || ''}
                      onChange={(e) => handleFilterChange('floorAreaMin', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="input-field text-sm"
                    >
                      <option value="">Min sq ft</option>
                      {[250, 500, 750, 1000, 1250, 1500, 2000, 2500, 3000, 4000, 5000].map(area => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                    <select
                      value={localFilters.floorAreaMax || ''}
                      onChange={(e) => handleFilterChange('floorAreaMax', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="input-field text-sm"
                    >
                      <option value="">Max sq ft</option>
                      {[500, 750, 1000, 1250, 1500, 2000, 2500, 3000, 4000, 5000].map(area => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Plot Size */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-text-primary">Plot Size (sq ft)</label>
                  <select
                    value={localFilters.plotSizeMin || ''}
                    onChange={(e) => handleFilterChange('plotSizeMin', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="input-field text-sm"
                  >
                    <option value="">Any plot size</option>
                    {[500, 1000, 2000, 5000, 10000, 20000].map(size => (
                      <option key={size} value={size}>{size}+ sq ft</option>
                    ))}
                  </select>
                </div>
              </FilterSection>

              {/* Section 2: Property Type */}
              <FilterSection
                title="Property Type"
                isCollapsed={collapsedSections['propertyType']}
                onToggle={() => toggleSection('propertyType')}
              >
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { value: 'detached', label: 'Detached' },
                    { value: 'semi_detached', label: 'Semi-detached' },
                    { value: 'terraced', label: 'Terraced' },
                    { value: 'flat', label: 'Flat/Apartment' },
                    { value: 'bungalow', label: 'Bungalow' },
                    { value: 'maisonette', label: 'Maisonette' },
                    { value: 'cottage', label: 'Cottage' },
                    { value: 'town_house', label: 'Town house' },
                    { value: 'park_home', label: 'Park home' },
                    { value: 'land', label: 'Land' },
                    { value: 'other', label: 'Other' }
                  ].map(type => (
                    <label key={type.value} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={(localFilters.propertyType || []).includes(type.value as any)}
                        onChange={() => handleArrayToggle('propertyType', type.value)}
                        className="w-4 h-4 text-accent"
                      />
                      <span className="text-text-primary">{type.label}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* Section 3: Property Features */}
              <FilterSection
                title="Property Features"
                isCollapsed={collapsedSections['features']}
                onToggle={() => toggleSection('features')}
              >
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {[
                    { key: 'periodProperty', label: 'Period property' },
                    { key: 'modern', label: 'Modern' },
                    { key: 'cottage', label: 'Cottage' },
                    { key: 'fixerUpper', label: 'Fixer upper' },
                    { key: 'newBuild', label: 'New build' },
                    { key: 'enSuite', label: 'En-suite' },
                    { key: 'bathtub', label: 'Bathtub' },
                    { key: 'wetRoom', label: 'Wet room' },
                    { key: 'walkInWardrobe', label: 'Walk-in wardrobe' },
                    { key: 'kitchenIsland', label: 'Kitchen island' },
                    { key: 'openPlanKitchen', label: 'Open-plan kitchen' },
                    { key: 'separateDiningRoom', label: 'Separate dining room' },
                    { key: 'utilityRoom', label: 'Utility room' },
                    { key: 'conservatory', label: 'Conservatory' },
                    { key: 'homeOffice', label: 'Home office' },
                    { key: 'basement', label: 'Basement / cellar' },
                    { key: 'loftConversion', label: 'Loft conversion' },
                    { key: 'annexe', label: 'Annexe / granny flat' },
                    { key: 'downstairsWc', label: 'Downstairs WC' },
                    { key: 'doubleGlazing', label: 'Double glazing' },
                    { key: 'logBurner', label: 'Log burner / wood stove' },
                    { key: 'underfloorHeating', label: 'Underfloor heating' },
                    { key: 'bayWindows', label: 'Bay windows' },
                    { key: 'bifoldDoors', label: 'Bi-fold doors' },
                    { key: 'originalFeatures', label: 'Original features' },
                    { key: 'balcony', label: 'Balcony' },
                    { key: 'roofTerrace', label: 'Roof terrace' },
                    { key: 'patio', label: 'Patio' },
                    { key: 'swimmingPool', label: 'Swimming pool' },
                    { key: 'outbuildings', label: 'Outbuildings / shed' },
                    { key: 'garage', label: 'Garage' }
                  ].map(feature => (
                    <label key={feature.key} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={localFilters[feature.key as keyof PropertyFilters] as boolean || false}
                        onChange={(e) => handleFilterChange(feature.key as keyof PropertyFilters, e.target.checked || undefined)}
                        className="w-4 h-4 text-accent"
                      />
                      <span className="text-text-primary">{feature.label}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* Section 4: Outdoor Space & Parking */}
              <FilterSection
                title="Outdoor Space & Parking"
                isCollapsed={collapsedSections['outdoor']}
                onToggle={() => toggleSection('outdoor')}
              >
                <div className="space-y-4">
                  {/* Garden */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Garden</label>
                    <select
                      value={(localFilters.gardenType || [])[0] || ''}
                      onChange={(e) => handleFilterChange('gardenType', e.target.value ? [e.target.value] : undefined)}
                      className="input-field text-sm w-full"
                    >
                      <option value="">Any</option>
                      <option value="private">Private garden</option>
                      <option value="communal">Communal garden</option>
                      <option value="none">No garden</option>
                    </select>
                  </div>

                  {/* Garden Orientation */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Garden Orientation</label>
                    <select
                      value={(localFilters.gardenOrientation || [])[0] || ''}
                      onChange={(e) => handleFilterChange('gardenOrientation', e.target.value ? [e.target.value] : undefined)}
                      className="input-field text-sm w-full"
                    >
                      <option value="">Any</option>
                      <option value="south">South-facing</option>
                      <option value="east">East-facing</option>
                      <option value="west">West-facing</option>
                      <option value="north">North-facing</option>
                    </select>
                  </div>

                  {/* Parking */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Parking</label>
                    <select
                      value={(localFilters.parkingType || [])[0] || ''}
                      onChange={(e) => handleFilterChange('parkingType', e.target.value ? [e.target.value] : undefined)}
                      className="input-field text-sm w-full"
                    >
                      <option value="">Any</option>
                      <option value="driveway">Driveway</option>
                      <option value="garage">Garage</option>
                      <option value="allocated">Allocated space</option>
                      <option value="on_street">On-street only</option>
                      <option value="none">No parking</option>
                    </select>
                  </div>

                  {/* EV Charging */}
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={localFilters.evCharging || false}
                      onChange={(e) => handleFilterChange('evCharging', e.target.checked || undefined)}
                      className="w-4 h-4 text-accent"
                    />
                    <span className="text-text-primary">EV charging</span>
                  </label>
                </div>
              </FilterSection>

              {/* Section 5: Energy & Utilities */}
              <FilterSection
                title="Energy & Utilities"
                isCollapsed={collapsedSections['energy']}
                onToggle={() => toggleSection('energy')}
              >
                <div className="space-y-4">
                  {/* EPC Rating */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Minimum EPC Rating</label>
                    <select
                      value={localFilters.epcRatingMin || ''}
                      onChange={(e) => handleFilterChange('epcRatingMin', e.target.value || undefined)}
                      className="input-field text-sm w-full"
                    >
                      <option value="">Any</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                      <option value="E">E</option>
                      <option value="F">F</option>
                      <option value="G">G</option>
                    </select>
                  </div>

                  {/* Heating Type */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Heating Type</label>
                    <div className="space-y-1">
                      {[
                        { value: 'gas_central', label: 'Gas central heating' },
                        { value: 'electric', label: 'Electric' },
                        { value: 'oil', label: 'Oil' },
                        { value: 'heat_pump', label: 'Heat pump' },
                        { value: 'other', label: 'Other' }
                      ].map(heating => (
                        <label key={heating.value} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={(localFilters.heatingType || []).includes(heating.value as any)}
                            onChange={() => handleArrayToggle('heatingType', heating.value)}
                            className="w-4 h-4 text-accent"
                          />
                          <span className="text-text-primary">{heating.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Utilities */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={localFilters.mainsGas || false}
                        onChange={(e) => handleFilterChange('mainsGas', e.target.checked || undefined)}
                        className="w-4 h-4 text-accent"
                      />
                      <span className="text-text-primary">Mains gas</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={localFilters.mainsSewer || false}
                        onChange={(e) => handleFilterChange('mainsSewer', e.target.checked || undefined)}
                        className="w-4 h-4 text-accent"
                      />
                      <span className="text-text-primary">Mains sewer</span>
                    </label>
                  </div>
                </div>
              </FilterSection>

              {/* Section 6: Tenure & Costs */}
              <FilterSection
                title="Tenure & Costs"
                isCollapsed={collapsedSections['tenure']}
                onToggle={() => toggleSection('tenure')}
              >
                <div className="space-y-4">
                  {/* Tenure */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Tenure</label>
                    <div className="space-y-1">
                      {[
                        { value: 'freehold', label: 'Freehold only' },
                        { value: 'leasehold', label: 'Leasehold only' },
                        { value: 'share_of_freehold', label: 'Share of freehold' }
                      ].map(tenure => (
                        <label key={tenure.value} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={(localFilters.tenure || []).includes(tenure.value as any)}
                            onChange={() => handleArrayToggle('tenure', tenure.value)}
                            className="w-4 h-4 text-accent"
                          />
                          <span className="text-text-primary">{tenure.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Service Charge */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Max Service Charge (per year)</label>
                    <select
                      value={localFilters.serviceChargeMax || ''}
                      onChange={(e) => handleFilterChange('serviceChargeMax', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="input-field text-sm w-full"
                    >
                      <option value="">Any</option>
                      {[500, 1000, 1500, 2000, 2500, 3000, 4000, 5000].map(charge => (
                        <option key={charge} value={charge * 100}>£{charge}</option>
                      ))}
                    </select>
                  </div>

                  {/* Ground Rent */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Max Ground Rent (per year)</label>
                    <select
                      value={localFilters.groundRentMax || ''}
                      onChange={(e) => handleFilterChange('groundRentMax', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="input-field text-sm w-full"
                    >
                      <option value="">Any</option>
                      {[100, 200, 300, 500, 750, 1000].map(rent => (
                        <option key={rent} value={rent * 100}>£{rent}</option>
                      ))}
                    </select>
                  </div>

                  {/* Lease Length */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Min Lease Length Remaining</label>
                    <select
                      value={localFilters.leaseLengthMin || ''}
                      onChange={(e) => handleFilterChange('leaseLengthMin', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="input-field text-sm w-full"
                    >
                      <option value="">Any</option>
                      {[80, 90, 100, 125, 150, 200, 500].map(years => (
                        <option key={years} value={years}>{years}+ years</option>
                      ))}
                    </select>
                  </div>
                </div>
              </FilterSection>

              {/* Section 7: Listing Status */}
              <FilterSection
                title="Listing Status"
                isCollapsed={collapsedSections['status']}
                onToggle={() => toggleSection('status')}
              >
                <div className="space-y-4">
                  {/* Added to site */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Added to site</label>
                    <select
                      value={localFilters.addedToMarket || ''}
                      onChange={(e) => handleFilterChange('addedToMarket', e.target.value || undefined)}
                      className="input-field text-sm w-full"
                    >
                      <option value="">Any time</option>
                      <option value="1">Last 24 hours</option>
                      <option value="3">Last 3 days</option>
                      <option value="7">Last 7 days</option>
                      <option value="14">Last 14 days</option>
                      <option value="30">Last 30 days</option>
                    </select>
                  </div>

                  {/* Days on market */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Max days on market</label>
                    <select
                      value={localFilters.daysOnMarketMax || ''}
                      onChange={(e) => handleFilterChange('daysOnMarketMax', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="input-field text-sm w-full"
                    >
                      <option value="">Any</option>
                      {[7, 14, 30, 60, 90, 180, 365].map(days => (
                        <option key={days} value={days}>{days} days</option>
                      ))}
                    </select>
                  </div>

                  {/* Status checkboxes */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={localFilters.priceReduced || false}
                        onChange={(e) => handleFilterChange('priceReduced', e.target.checked || undefined)}
                        className="w-4 h-4 text-accent"
                      />
                      <span className="text-text-primary">Price reduced</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={localFilters.chainFree || false}
                        onChange={(e) => handleFilterChange('chainFree', e.target.checked || undefined)}
                        className="w-4 h-4 text-accent"
                      />
                      <span className="text-text-primary">Chain free</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={localFilters.newListings || false}
                        onChange={(e) => handleFilterChange('newListings', e.target.checked || undefined)}
                        className="w-4 h-4 text-accent"
                      />
                      <span className="text-text-primary">New listings only</span>
                    </label>
                  </div>
                </div>
              </FilterSection>

              {/* Section 8: Rental Only */}
              {isRental && (
                <FilterSection
                  title="Rental Specific"
                  isCollapsed={collapsedSections['rental']}
                  onToggle={() => toggleSection('rental')}
                >
                  <div className="space-y-4">
                    {/* Furnished */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-primary">Furnished</label>
                      <select
                        value={(localFilters.furnished || [])[0] || ''}
                        onChange={(e) => handleFilterChange('furnished', e.target.value ? [e.target.value] : undefined)}
                        className="input-field text-sm w-full"
                      >
                        <option value="">Any</option>
                        <option value="furnished">Furnished</option>
                        <option value="unfurnished">Unfurnished</option>
                        <option value="part_furnished">Part-furnished</option>
                      </select>
                    </div>

                    {/* Rental checkboxes */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={localFilters.petsAllowed || false}
                          onChange={(e) => handleFilterChange('petsAllowed', e.target.checked || undefined)}
                          className="w-4 h-4 text-accent"
                        />
                        <span className="text-text-primary">Pets allowed</span>
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={localFilters.billsIncluded || false}
                          onChange={(e) => handleFilterChange('billsIncluded', e.target.checked || undefined)}
                          className="w-4 h-4 text-accent"
                        />
                        <span className="text-text-primary">Bills included</span>
                      </label>
                    </div>

                    {/* Max Deposit */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-primary">Max deposit</label>
                      <select
                        value={localFilters.depositMax || ''}
                        onChange={(e) => handleFilterChange('depositMax', e.target.value ? parseInt(e.target.value) : undefined)}
                        className="input-field text-sm w-full"
                      >
                        <option value="">Any</option>
                        <option value="2">2 weeks rent</option>
                        <option value="4">4 weeks rent</option>
                        <option value="5">5 weeks rent</option>
                        <option value="6">6 weeks rent</option>
                      </select>
                    </div>
                  </div>
                </FilterSection>
              )}

            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-border bg-surface">
            <div className="flex gap-3">
              <button
                onClick={clearAllFilters}
                className="flex-1 py-3 px-4 text-sm font-medium text-text-secondary border border-border rounded-lg hover:bg-background transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={applyFilters}
                className="flex-1 py-3 px-4 text-sm font-medium bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>

        {/* Close overlay on mobile */}
        <div
          className="flex-1 md:hidden"
          onClick={onToggle}
        />
      </div>
    </div>
  )
}

function FilterSection({
  title,
  isCollapsed,
  onToggle,
  children
}: {
  title: string
  isCollapsed: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="border border-border rounded-lg">
      <button
        onClick={onToggle}
        className="w-full p-3 flex items-center justify-between bg-surface hover:bg-accent/5 rounded-t-lg transition-colors"
      >
        <span className="font-medium text-text-primary text-sm">{title}</span>
        {isCollapsed ? (
          <ChevronDown className="w-4 h-4 text-text-secondary" />
        ) : (
          <ChevronUp className="w-4 h-4 text-text-secondary" />
        )}
      </button>
      {!isCollapsed && (
        <div className="p-3 border-t border-border">
          {children}
        </div>
      )}
    </div>
  )
}