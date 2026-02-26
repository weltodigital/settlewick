'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface SavedProperty {
  id: string
  user_id: string
  property_id: string
  created_at: string
  property: any // Use your PropertyWithDetails type
}

export function useSavedProperties() {
  const [user, setUser] = useState<any>(null)
  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>([])
  const [savedPropertyIds, setSavedPropertyIds] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)

  // Check user auth
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
  }, [])

  // Fetch saved properties
  const fetchSavedProperties = async () => {
    if (!user) {
      setSavedProperties([])
      setSavedPropertyIds(new Set())
      return
    }

    setIsLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('saved_properties')
        .select(`
          id,
          user_id,
          property_id,
          created_at,
          property:properties!property_id (*)
        `)
        .eq('user_id', user.id)

      if (error) {
        console.error('Error fetching saved properties:', error)
      } else {
        const savedPropsData = data || []
        setSavedProperties(savedPropsData)
        setSavedPropertyIds(new Set(savedPropsData.map(sp => sp.property_id)))
      }
    } catch (error) {
      console.error('Error fetching saved properties:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Save a property
  const saveProperty = async (propertyId: string) => {
    if (!user) return false

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('saved_properties')
        .insert({
          user_id: user.id,
          property_id: propertyId
        })

      if (!error) {
        setSavedPropertyIds(prev => new Set([...Array.from(prev), propertyId]))
        await fetchSavedProperties() // Refresh the list
        return true
      }
      console.error('Error saving property:', error)
    } catch (error) {
      console.error('Error saving property:', error)
    }
    return false
  }

  // Remove a property
  const removeProperty = async (propertyId: string) => {
    if (!user) return false

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('saved_properties')
        .delete()
        .eq('user_id', user.id)
        .eq('property_id', propertyId)

      if (!error) {
        setSavedPropertyIds(prev => {
          const newSet = new Set(prev)
          newSet.delete(propertyId)
          return newSet
        })
        setSavedProperties(prev =>
          prev.filter(sp => sp.property?.id !== propertyId)
        )
        return true
      }
      console.error('Error removing saved property:', error)
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

  // Load saved properties when user changes
  useEffect(() => {
    fetchSavedProperties()
  }, [user?.id])

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