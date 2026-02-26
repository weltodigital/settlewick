'use client'

import { useState, useEffect } from 'react'
import { X, Heart, TrendingUp, ArrowRight } from 'lucide-react'
import { formatPrice } from '@/lib/format'
import type { Property } from '@/types/property'

interface ComparisonBarProps {
  isVisible: boolean
  onClose: () => void
  className?: string
}

export default function ComparisonBar({ isVisible, onClose, className = '' }: ComparisonBarProps) {
  const [comparisonProperties, setComparisonProperties] = useState<Property[]>([])

  useEffect(() => {
    // Get comparison properties from localStorage or state management
    const savedComparisons = localStorage.getItem('comparisonProperties')
    if (savedComparisons) {
      try {
        setComparisonProperties(JSON.parse(savedComparisons))
      } catch (error) {
        console.error('Error loading comparison properties:', error)
      }
    }
  }, [isVisible])

  const removeFromComparison = (propertyId: string) => {
    const updated = comparisonProperties.filter(p => p.id !== propertyId)
    setComparisonProperties(updated)
    localStorage.setItem('comparisonProperties', JSON.stringify(updated))
  }

  const clearAll = () => {
    setComparisonProperties([])
    localStorage.removeItem('comparisonProperties')
  }

  if (!isVisible || comparisonProperties.length === 0) {
    return null
  }

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-lg z-50 ${className}`}>
      <div className="max-w-8xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-accent" />
              <span className="font-semibold text-text-primary">
                Compare Properties ({comparisonProperties.length})
              </span>
            </div>
            <div className="flex gap-3 max-w-2xl overflow-x-auto">
              {comparisonProperties.slice(0, 4).map((property) => (
                <div
                  key={property.id}
                  className="flex-shrink-0 bg-secondary rounded-lg p-3 min-w-48"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-sm font-medium text-text-primary truncate">
                      {property.addressLine1}
                    </div>
                    <button
                      onClick={() => removeFromComparison(property.id)}
                      className="text-text-muted hover:text-accent transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-xs text-text-secondary mb-1">
                    {property.addressTown}
                  </div>
                  <div className="text-sm font-semibold text-accent">
                    {formatPrice(property.price, property.listingType)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {comparisonProperties.length >= 2 && (
              <button className="btn-accent flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Compare
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={clearAll}
              className="text-text-muted hover:text-accent transition-colors text-sm"
            >
              Clear all
            </button>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-accent transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}