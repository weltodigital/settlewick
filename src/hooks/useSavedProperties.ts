'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface SavedProperty {
  id: string
  createdAt: string
  property: any // Use your PropertyWithDetails type
}

export function useSavedProperties() {
  const { data: session } = useSession()
  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>([])
  const [savedPropertyIds, setSavedPropertyIds] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)

  // Fetch saved properties
  const fetchSavedProperties = async () => {
    if (!session?.user?.id) {
      setSavedProperties([])
      setSavedPropertyIds(new Set())
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/saved-properties')
      if (response.ok) {
        const data = await response.json()
        setSavedProperties(data)
        setSavedPropertyIds(new Set(data.map((sp: SavedProperty) => sp.property.id)))
      }
    } catch (error) {
      console.error('Error fetching saved properties:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Save a property
  const saveProperty = async (propertyId: string) => {
    if (!session?.user?.id) return false

    try {
      const response = await fetch('/api/saved-properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId })
      })

      if (response.ok) {
        setSavedPropertyIds(prev => new Set([...prev, propertyId]))
        await fetchSavedProperties() // Refresh the list
        return true
      }
    } catch (error) {
      console.error('Error saving property:', error)
    }
    return false
  }

  // Remove a property
  const removeProperty = async (propertyId: string) => {
    if (!session?.user?.id) return false

    try {
      const response = await fetch(`/api/saved-properties?propertyId=${propertyId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setSavedPropertyIds(prev => {
          const newSet = new Set(prev)
          newSet.delete(propertyId)
          return newSet
        })
        setSavedProperties(prev =>
          prev.filter(sp => sp.property.id !== propertyId)
        )
        return true
      }
    } catch (error) {
      console.error('Error removing saved property:', error)
    }
    return false
  }

  // Toggle save/unsave
  const toggleSave = async (propertyId: string) => {
    const isSaved = savedPropertyIds.has(propertyId)
    return isSaved ? removeProperty(propertyId) : saveProperty(propertyId)
  }

  // Check if a property is saved
  const isSaved = (propertyId: string) => savedPropertyIds.has(propertyId)

  // Load saved properties when session changes
  useEffect(() => {
    fetchSavedProperties()
  }, [session?.user?.id])

  return {
    savedProperties,
    savedPropertyIds,
    isLoading,
    saveProperty,
    removeProperty,
    toggleSave,
    isSaved,
    refetch: fetchSavedProperties
  }
}