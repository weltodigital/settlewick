'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, MapPin, Clock } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

interface LocationSuggestion {
  id: string
  name: string
  type: 'neighbourhood' | 'city' | 'town' | 'county' | 'region' | 'postcode_district' | 'recent'
  fullName: string
  parentName?: string
  coordinates?: [number, number]
  slug: string
  propertyCountSale?: number
  propertyCountRent?: number
}

interface LocationAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onSelect?: (suggestion: LocationSuggestion) => void
  placeholder?: string
  className?: string
}

export default function LocationAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = "Enter location (e.g. London, Manchester, Birmingham, Portsmouth)",
  className = ""
}: LocationAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()

  // Search locations using Supabase
  const searchLocations = async (query: string): Promise<LocationSuggestion[]> => {
    if (!query.trim()) {
      // Return popular locations when no query
      const { data, error } = await supabase
        .from('locations')
        .select('id, name, slug, location_type, latitude, longitude, property_count_sale, property_count_rent, parent_name:locations!locations_parent_id_fkey(name)')
        .in('location_type', ['city', 'region'])
        .order('property_count_sale', { ascending: false })
        .limit(6)

      if (error) {
        console.error('Error fetching popular locations:', error)
        return []
      }

      return (data || []).map(location => ({
        id: location.id,
        name: location.name,
        type: location.location_type as any,
        fullName: location.parent_name ? `${location.name}, ${location.parent_name.name}` : location.name,
        parentName: location.parent_name?.name,
        coordinates: location.latitude && location.longitude ? [location.latitude, location.longitude] : undefined,
        slug: location.slug,
        propertyCountSale: location.property_count_sale || 0,
        propertyCountRent: location.property_count_rent || 0
      }))
    }

    // Use the autocomplete function from database
    const { data, error } = await supabase.rpc('autocomplete_locations', {
      search_query: query,
      max_results: 10
    })

    if (error) {
      console.error('Error searching locations:', error)
      return []
    }

    return (data || []).map((location: any) => ({
      id: location.id,
      name: location.name,
      type: location.location_type,
      fullName: location.parent_name ? `${location.name}, ${location.parent_name}` : location.name,
      parentName: location.parent_name,
      coordinates: location.latitude && location.longitude ? [location.latitude, location.longitude] : undefined,
      slug: location.full_slug || location.slug,
      propertyCountSale: location.property_count_sale || 0,
      propertyCountRent: location.property_count_rent || 0
    }))
  }

  // Get recent searches from localStorage
  const getRecentSearches = (): LocationSuggestion[] => {
    try {
      const recent = localStorage.getItem('recentLocationSearches')
      if (recent) {
        return JSON.parse(recent).slice(0, 3)
      }
    } catch (error) {
      console.error('Error loading recent searches:', error)
    }
    return []
  }

  // Save to recent searches
  const saveToRecentSearches = (suggestion: LocationSuggestion) => {
    try {
      const recent = getRecentSearches()
      const updated = [suggestion, ...recent.filter(r => r.id !== suggestion.id)].slice(0, 5)
      localStorage.setItem('recentLocationSearches', JSON.stringify(updated))
    } catch (error) {
      console.error('Error saving recent search:', error)
    }
  }

  // Debounced search effect
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(async () => {
      if (!isOpen) return

      setIsLoading(true)
      try {
        if (!value.trim()) {
          // Show recent searches + popular locations when no query
          const recent = getRecentSearches()
          const popular = await searchLocations('')
          const combined = [
            ...recent.map(r => ({ ...r, type: 'recent' as const })),
            ...popular.slice(0, 6 - recent.length)
          ]
          setSuggestions(combined)
        } else {
          // Search locations
          const results = await searchLocations(value)
          setSuggestions(results)
        }
      } catch (error) {
        console.error('Error searching locations:', error)
        setSuggestions([])
      } finally {
        setIsLoading(false)
        setHighlightedIndex(-1)
      }
    }, 200) // 200ms debounce

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [value, isOpen])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown') {
        setIsOpen(true)
        return
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0) {
          handleSelect(suggestions[highlightedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        setHighlightedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  const handleSelect = (suggestion: LocationSuggestion) => {
    onChange(suggestion.name)
    saveToRecentSearches(suggestion)
    onSelect?.(suggestion)
    setIsOpen(false)
    setHighlightedIndex(-1)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'recent':
        return <Clock className="w-4 h-4 text-text-muted" />
      case 'postcode_district':
        return <Search className="w-4 h-4 text-primary" />
      case 'region':
        return <MapPin className="w-4 h-4 text-purple-500" />
      case 'county':
        return <MapPin className="w-4 h-4 text-blue-500" />
      case 'city':
      case 'town':
        return <MapPin className="w-4 h-4 text-accent" />
      default:
        return <MapPin className="w-4 h-4 text-green-500" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'recent':
        return 'Recent'
      case 'postcode_district':
        return 'Postcode'
      case 'neighbourhood':
        return 'Area'
      case 'city':
        return 'City'
      case 'town':
        return 'Town'
      case 'county':
        return 'County'
      case 'region':
        return 'Region'
      default:
        return 'Location'
    }
  }

  // Handle clicks outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setHighlightedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-4 border-0 bg-transparent text-text-primary placeholder:text-text-muted focus:outline-none text-base sm:text-lg"
          autoComplete="off"
        />
      </div>

      {/* Suggestions dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-surface border border-border rounded-xl shadow-2xl z-50 mt-1 max-h-80 overflow-y-auto">
          <div className="py-2">
            {!value.trim() && (
              <div className="px-4 py-2 text-xs font-medium text-text-muted border-b border-border">
                {getRecentSearches().length > 0 ? 'Recent Searches & Popular Locations' : 'Popular Locations'}
              </div>
            )}

            {isLoading ? (
              <div className="px-4 py-8 text-center text-text-muted">
                <div className="animate-spin w-6 h-6 border-2 border-accent border-t-transparent rounded-full mx-auto mb-2"></div>
                <div className="text-sm">Searching locations...</div>
              </div>
            ) : suggestions.length > 0 ? (
              suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSelect(suggestion)}
                  className={`w-full px-4 py-3 text-left hover:bg-secondary transition-colors flex items-center gap-3 ${
                    highlightedIndex === index ? 'bg-secondary' : ''
                  }`}
                >
                  {getTypeIcon(suggestion.type)}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-text-primary truncate">
                        {suggestion.name}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-accent/10 text-accent rounded">
                        {getTypeLabel(suggestion.type)}
                      </span>
                      {(suggestion.propertyCountSale && suggestion.propertyCountSale > 0) && (
                        <span className="text-xs text-text-muted">
                          ({suggestion.propertyCountSale})
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-text-muted truncate">
                      {suggestion.fullName}
                    </div>
                  </div>
                </button>
              ))
            ) : value.trim() && !isLoading ? (
              <div className="px-4 py-8 text-center text-text-muted">
                <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <div className="font-medium mb-1">No locations found</div>
                <div className="text-sm">Try searching for a UK city, town, or postcode</div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}