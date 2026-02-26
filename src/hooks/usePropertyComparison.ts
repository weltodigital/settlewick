'use client'

import { useState, useEffect } from 'react'
import type { PropertyWithDetails } from '@/types/property'

export function usePropertyComparison() {
  const [comparisonIds, setComparisonIds] = useState<string[]>([])
  const [isComparisonOpen, setIsComparisonOpen] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('propertyComparison')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setComparisonIds(Array.isArray(parsed) ? parsed : [])
      } catch (error) {
        console.error('Error parsing comparison data:', error)
        localStorage.removeItem('propertyComparison')
      }
    }
  }, [])

  // Save to localStorage whenever comparison changes
  useEffect(() => {
    localStorage.setItem('propertyComparison', JSON.stringify(comparisonIds))
  }, [comparisonIds])

  const addToComparison = (propertyId: string) => {
    if (comparisonIds.includes(propertyId)) return false
    if (comparisonIds.length >= 4) return false // Max 4 properties

    setComparisonIds(prev => [...prev, propertyId])
    return true
  }

  const removeFromComparison = (propertyId: string) => {
    setComparisonIds(prev => prev.filter(id => id !== propertyId))
  }

  const clearComparison = () => {
    setComparisonIds([])
  }

  const toggleComparison = (propertyId: string) => {
    if (comparisonIds.includes(propertyId)) {
      removeFromComparison(propertyId)
      return false
    } else {
      return addToComparison(propertyId)
    }
  }

  const openComparison = () => setIsComparisonOpen(true)
  const closeComparison = () => setIsComparisonOpen(false)

  const isInComparison = (propertyId: string) => comparisonIds.includes(propertyId)

  return {
    comparisonIds,
    comparisonCount: comparisonIds.length,
    isComparisonOpen,
    addToComparison,
    removeFromComparison,
    clearComparison,
    toggleComparison,
    openComparison,
    closeComparison,
    isInComparison,
    canAddMore: comparisonIds.length < 4,
    canCompare: comparisonIds.length >= 2
  }
}