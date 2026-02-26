'use client'

import { useState, useEffect } from 'react'
import { Calculator, TrendingUp, Home, MapPin, Calendar, Info } from 'lucide-react'

interface ValuationData {
  address: string
  postcode: string
  propertyType: string
  bedrooms: number
  bathrooms: number
  floorArea: number
  yearBuilt: number
  condition: 'excellent' | 'good' | 'fair' | 'poor'
  hasGarden: boolean
  hasParking: boolean
  hasGarage: boolean
  modernised: boolean
}

interface ValuationResult {
  estimatedValue: number
  confidenceRange: {
    min: number
    max: number
  }
  comparables: Array<{
    address: string
    soldPrice: number
    soldDate: string
    bedrooms: number
    propertyType: string
    distance: number
  }>
  marketTrend: 'rising' | 'stable' | 'declining'
  trendPercentage: number
  factors: Array<{
    factor: string
    impact: string
    adjustment: number
  }>
}

export default function PropertyValuationCalculator() {
  const [step, setStep] = useState(1)
  const [valuationData, setValuationData] = useState<ValuationData>({
    address: '',
    postcode: '',
    propertyType: '',
    bedrooms: 3,
    bathrooms: 2,
    floorArea: 1000,
    yearBuilt: 1950,
    condition: 'good',
    hasGarden: false,
    hasParking: false,
    hasGarage: false,
    modernised: false
  })
  const [result, setResult] = useState<ValuationResult | null>(null)
  const [loading, setLoading] = useState(false)

  const propertyTypes = [
    { value: 'TERRACED', label: 'Terraced House' },
    { value: 'SEMI_DETACHED', label: 'Semi-detached House' },
    { value: 'DETACHED', label: 'Detached House' },
    { value: 'FLAT', label: 'Flat/Apartment' },
    { value: 'BUNGALOW', label: 'Bungalow' },
    { value: 'COTTAGE', label: 'Cottage' }
  ]

  const conditions = [
    { value: 'excellent', label: 'Excellent', description: 'Recently renovated, modern fixtures' },
    { value: 'good', label: 'Good', description: 'Well maintained, minor updates needed' },
    { value: 'fair', label: 'Fair', description: 'Some maintenance required' },
    { value: 'poor', label: 'Poor', description: 'Significant renovation needed' }
  ]

  const handleInputChange = (field: keyof ValuationData, value: any) => {
    setValuationData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const calculateValuation = async () => {
    setLoading(true)

    // Simulate API call for property valuation
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Mock calculation based on Portsmouth property data
    const basePrice = getBasePriceByType(valuationData.propertyType)
    let adjustedPrice = basePrice

    // Bedroom adjustment
    adjustedPrice += (valuationData.bedrooms - 3) * 25000

    // Bathroom adjustment
    adjustedPrice += (valuationData.bathrooms - 1) * 15000

    // Floor area adjustment (£200 per sq ft above/below 1000)
    adjustedPrice += (valuationData.floorArea - 1000) * 200

    // Age adjustment
    const currentYear = new Date().getFullYear()
    const age = currentYear - valuationData.yearBuilt
    if (age < 10) adjustedPrice += 50000
    else if (age < 30) adjustedPrice += 20000
    else if (age > 100) adjustedPrice -= 30000

    // Condition adjustment
    const conditionAdjustments = {
      excellent: 0.15,
      good: 0,
      fair: -0.1,
      poor: -0.25
    }
    adjustedPrice *= (1 + conditionAdjustments[valuationData.condition])

    // Features adjustments
    if (valuationData.hasGarden) adjustedPrice += 15000
    if (valuationData.hasParking) adjustedPrice += 8000
    if (valuationData.hasGarage) adjustedPrice += 12000
    if (valuationData.modernised) adjustedPrice += 25000

    // Generate mock result
    const mockResult: ValuationResult = {
      estimatedValue: Math.round(adjustedPrice),
      confidenceRange: {
        min: Math.round(adjustedPrice * 0.9),
        max: Math.round(adjustedPrice * 1.1)
      },
      comparables: [
        {
          address: '42 Albert Road, Southsea',
          soldPrice: adjustedPrice - 15000,
          soldDate: '2024-08-15',
          bedrooms: valuationData.bedrooms,
          propertyType: valuationData.propertyType,
          distance: 0.2
        },
        {
          address: '18 Victoria Street, Portsmouth',
          soldPrice: adjustedPrice + 8000,
          soldDate: '2024-09-03',
          bedrooms: valuationData.bedrooms - 1,
          propertyType: valuationData.propertyType,
          distance: 0.4
        },
        {
          address: '65 Elm Grove, Southsea',
          soldPrice: adjustedPrice - 5000,
          soldDate: '2024-07-22',
          bedrooms: valuationData.bedrooms,
          propertyType: valuationData.propertyType,
          distance: 0.3
        }
      ],
      marketTrend: 'rising',
      trendPercentage: 3.2,
      factors: [
        { factor: 'Property Type', impact: 'Positive', adjustment: 0 },
        { factor: 'Location (Portsmouth)', impact: 'Positive', adjustment: 15000 },
        { factor: 'Size & Layout', impact: valuationData.bedrooms >= 3 ? 'Positive' : 'Neutral', adjustment: (valuationData.bedrooms - 3) * 25000 },
        { factor: 'Condition', impact: valuationData.condition === 'excellent' ? 'Very Positive' : valuationData.condition === 'good' ? 'Positive' : 'Negative', adjustment: Math.round(basePrice * conditionAdjustments[valuationData.condition]) },
        { factor: 'Garden', impact: valuationData.hasGarden ? 'Positive' : 'None', adjustment: valuationData.hasGarden ? 15000 : 0 },
        { factor: 'Parking', impact: valuationData.hasParking ? 'Positive' : 'None', adjustment: valuationData.hasParking ? 8000 : 0 }
      ]
    }

    setResult(mockResult)
    setLoading(false)
    setStep(4)
  }

  const getBasePriceByType = (type: string): number => {
    const basePrices = {
      TERRACED: 280000,
      SEMI_DETACHED: 320000,
      DETACHED: 450000,
      FLAT: 200000,
      BUNGALOW: 350000,
      COTTAGE: 380000
    }
    return basePrices[type as keyof typeof basePrices] || 300000
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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-accent/10 rounded-lg">
            <Calculator className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary">Property Valuation Calculator</h1>
        </div>
        <p className="text-text-secondary text-lg">
          Get an instant estimate of your property's current market value in Portsmouth
        </p>
      </div>

      <div className="card p-8">
        {/* Progress Bar */}
        <div className="flex items-center mb-8">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNumber
                  ? 'bg-accent text-white'
                  : 'bg-secondary text-text-muted'
              }`}>
                {stepNumber}
              </div>
              {stepNumber < 4 && (
                <div className={`w-16 h-1 mx-2 ${
                  step > stepNumber ? 'bg-accent' : 'bg-secondary'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Property Details */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-semibold text-text-primary mb-6">Property Details</h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Property Address *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input
                      type="text"
                      value={valuationData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="e.g. 123 Albert Road, Southsea"
                      className="input-field pl-10 w-full"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Postcode *
                  </label>
                  <input
                    type="text"
                    value={valuationData.postcode}
                    onChange={(e) => handleInputChange('postcode', e.target.value.toUpperCase())}
                    placeholder="PO4 0DX"
                    className="input-field w-full"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Property Type *
                </label>
                <select
                  value={valuationData.propertyType}
                  onChange={(e) => handleInputChange('propertyType', e.target.value)}
                  className="input-field w-full"
                  required
                >
                  <option value="">Select property type</option>
                  {propertyTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    value={valuationData.bedrooms}
                    onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value))}
                    min="1"
                    max="10"
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    value={valuationData.bathrooms}
                    onChange={(e) => handleInputChange('bathrooms', parseInt(e.target.value))}
                    min="1"
                    max="5"
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Floor Area (sq ft)
                  </label>
                  <input
                    type="number"
                    value={valuationData.floorArea}
                    onChange={(e) => handleInputChange('floorArea', parseInt(e.target.value))}
                    min="200"
                    max="5000"
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Year Built
                  </label>
                  <input
                    type="number"
                    value={valuationData.yearBuilt}
                    onChange={(e) => handleInputChange('yearBuilt', parseInt(e.target.value))}
                    min="1800"
                    max={new Date().getFullYear()}
                    className="input-field w-full"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={() => setStep(2)}
                disabled={!valuationData.address || !valuationData.postcode || !valuationData.propertyType}
                className="btn-accent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Property Condition
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Property Condition */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-semibold text-text-primary mb-6">Property Condition & Features</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-4">
                  Overall Condition
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {conditions.map(condition => (
                    <label key={condition.value} className="cursor-pointer">
                      <div className={`p-4 rounded-lg border-2 transition-colors ${
                        valuationData.condition === condition.value
                          ? 'border-accent bg-accent/5'
                          : 'border-border bg-surface hover:border-accent/50'
                      }`}>
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="condition"
                            value={condition.value}
                            checked={valuationData.condition === condition.value}
                            onChange={(e) => handleInputChange('condition', e.target.value)}
                            className="w-4 h-4 text-accent border-border focus:ring-accent"
                          />
                          <div>
                            <div className="font-medium text-text-primary">{condition.label}</div>
                            <div className="text-sm text-text-secondary">{condition.description}</div>
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-4">
                  Property Features
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: 'hasGarden', label: 'Garden', icon: '🌱' },
                    { key: 'hasParking', label: 'Parking Space', icon: '🚗' },
                    { key: 'hasGarage', label: 'Garage', icon: '🏠' },
                    { key: 'modernised', label: 'Recently Modernised', icon: '✨' }
                  ].map(feature => (
                    <label key={feature.key} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary cursor-pointer">
                      <input
                        type="checkbox"
                        checked={valuationData[feature.key as keyof ValuationData] as boolean}
                        onChange={(e) => handleInputChange(feature.key as keyof ValuationData, e.target.checked)}
                        className="w-4 h-4 text-accent border-border rounded focus:ring-accent"
                      />
                      <span className="text-lg">{feature.icon}</span>
                      <span className="text-text-primary">{feature.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(1)}
                className="btn-outline"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="btn-accent"
              >
                Next: Review & Calculate
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-semibold text-text-primary mb-6">Review Your Details</h2>

            <div className="bg-secondary rounded-lg p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-text-secondary">Address</div>
                  <div className="font-medium text-text-primary">{valuationData.address}</div>
                </div>
                <div>
                  <div className="text-sm text-text-secondary">Postcode</div>
                  <div className="font-medium text-text-primary">{valuationData.postcode}</div>
                </div>
                <div>
                  <div className="text-sm text-text-secondary">Property Type</div>
                  <div className="font-medium text-text-primary">
                    {propertyTypes.find(t => t.value === valuationData.propertyType)?.label}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-text-secondary">Size</div>
                  <div className="font-medium text-text-primary">
                    {valuationData.bedrooms} bed, {valuationData.bathrooms} bath, {valuationData.floorArea} sq ft
                  </div>
                </div>
                <div>
                  <div className="text-sm text-text-secondary">Year Built</div>
                  <div className="font-medium text-text-primary">{valuationData.yearBuilt}</div>
                </div>
                <div>
                  <div className="text-sm text-text-secondary">Condition</div>
                  <div className="font-medium text-text-primary capitalize">{valuationData.condition}</div>
                </div>
              </div>

              {/* Features */}
              <div>
                <div className="text-sm text-text-secondary mb-2">Features</div>
                <div className="flex flex-wrap gap-2">
                  {valuationData.hasGarden && (
                    <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">Garden</span>
                  )}
                  {valuationData.hasParking && (
                    <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">Parking</span>
                  )}
                  {valuationData.hasGarage && (
                    <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">Garage</span>
                  )}
                  {valuationData.modernised && (
                    <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">Recently Modernised</span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-info/10 border border-info/20 rounded-lg p-4 mt-6">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
                <div className="text-sm text-info">
                  <div className="font-medium mb-1">About This Valuation</div>
                  <div>
                    This valuation is based on recent sales data, local market trends, and property characteristics.
                    For a more accurate valuation, we recommend a professional survey.
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(2)}
                className="btn-outline"
              >
                Back
              </button>
              <button
                onClick={calculateValuation}
                disabled={loading}
                className="btn-accent flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Calculator className="w-4 h-4" />
                    Calculate Valuation
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Results */}
        {step === 4 && result && (
          <div>
            <h2 className="text-2xl font-semibold text-text-primary mb-6">Your Property Valuation</h2>

            {/* Main Result */}
            <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-xl p-8 mb-8 text-center">
              <div className="text-sm text-text-secondary mb-2">Estimated Market Value</div>
              <div className="text-4xl font-bold text-accent mb-4">
                {formatPrice(result.estimatedValue)}
              </div>
              <div className="text-text-secondary">
                Confidence range: {formatPrice(result.confidenceRange.min)} - {formatPrice(result.confidenceRange.max)}
              </div>
              <div className="flex items-center justify-center gap-2 mt-4">
                <TrendingUp className="w-5 h-5 text-success" />
                <span className="text-success font-medium">
                  Market is {result.marketTrend} by {result.trendPercentage}% this year
                </span>
              </div>
            </div>

            {/* Valuation Factors */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-text-primary mb-4">Valuation Factors</h3>
              <div className="space-y-3">
                {result.factors.map((factor, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-surface rounded-lg">
                    <div>
                      <div className="font-medium text-text-primary">{factor.factor}</div>
                      <div className="text-sm text-text-secondary">{factor.impact} impact</div>
                    </div>
                    <div className={`font-medium ${
                      factor.adjustment > 0 ? 'text-success' : factor.adjustment < 0 ? 'text-error' : 'text-text-muted'
                    }`}>
                      {factor.adjustment > 0 ? '+' : ''}{factor.adjustment === 0 ? 'Base' : formatPrice(factor.adjustment)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Comparables */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-text-primary mb-4">Recent Sales Nearby</h3>
              <div className="space-y-4">
                {result.comparables.map((comp, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-surface rounded-lg">
                    <div>
                      <div className="font-medium text-text-primary">{comp.address}</div>
                      <div className="text-sm text-text-secondary">
                        {comp.bedrooms} bed {comp.propertyType.toLowerCase().replace('_', ' ')} • {comp.distance} miles away
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-text-primary">{formatPrice(comp.soldPrice)}</div>
                      <div className="text-sm text-text-secondary">{formatDate(comp.soldDate)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setStep(1)
                  setResult(null)
                }}
                className="btn-outline"
              >
                Start New Valuation
              </button>
              <button
                onClick={() => window.print()}
                className="btn-accent"
              >
                Download Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}