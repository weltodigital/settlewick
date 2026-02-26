'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, MapPin, Clock } from 'lucide-react'

interface LocationSuggestion {
  id: string
  name: string
  type: 'area' | 'postcode' | 'district' | 'recent'
  fullName: string
  county?: string
  coordinates?: [number, number]
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
  placeholder = "Enter location (e.g. Southsea, PO4, Old Portsmouth)",
  className = ""
}: LocationAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Mock data - Portsmouth and surrounding areas
  const locationData: LocationSuggestion[] = [
    // Areas
    { id: 'southsea', name: 'Southsea', type: 'area', fullName: 'Southsea, Portsmouth', county: 'Hampshire', coordinates: [50.7833, -1.0833] },
    { id: 'old-portsmouth', name: 'Old Portsmouth', type: 'area', fullName: 'Old Portsmouth, Portsmouth', county: 'Hampshire', coordinates: [50.7897, -1.1067] },
    { id: 'fratton', name: 'Fratton', type: 'area', fullName: 'Fratton, Portsmouth', county: 'Hampshire', coordinates: [50.7950, -1.0650] },
    { id: 'cosham', name: 'Cosham', type: 'area', fullName: 'Cosham, Portsmouth', county: 'Hampshire', coordinates: [50.8450, -1.0650] },
    { id: 'gunwharf-quays', name: 'Gunwharf Quays', type: 'area', fullName: 'Gunwharf Quays, Portsmouth', county: 'Hampshire', coordinates: [50.7950, -1.1050] },
    { id: 'milton', name: 'Milton', type: 'area', fullName: 'Milton, Portsmouth', county: 'Hampshire', coordinates: [50.7750, -1.0550] },
    { id: 'copnor', name: 'Copnor', type: 'area', fullName: 'Copnor, Portsmouth', county: 'Hampshire', coordinates: [50.8150, -1.0650] },
    { id: 'baffins', name: 'Baffins', type: 'area', fullName: 'Baffins, Portsmouth', county: 'Hampshire', coordinates: [50.8050, -1.0450] },
    { id: 'drayton', name: 'Drayton', type: 'area', fullName: 'Drayton, Portsmouth', county: 'Hampshire', coordinates: [50.8350, -1.0550] },
    { id: 'farlington', name: 'Farlington', type: 'area', fullName: 'Farlington, Portsmouth', county: 'Hampshire', coordinates: [50.8450, -1.0350] },

    // Postcodes
    { id: 'po1', name: 'PO1', type: 'postcode', fullName: 'PO1, Portsmouth City Centre', county: 'Hampshire', coordinates: [50.7950, -1.0950] },
    { id: 'po2', name: 'PO2', type: 'postcode', fullName: 'PO2, North Portsmouth', county: 'Hampshire', coordinates: [50.8150, -1.0650] },
    { id: 'po3', name: 'PO3', type: 'postcode', fullName: 'PO3, Drayton & Farlington', county: 'Hampshire', coordinates: [50.8350, -1.0450] },
    { id: 'po4', name: 'PO4', type: 'postcode', fullName: 'PO4, Southsea', county: 'Hampshire', coordinates: [50.7750, -1.0850] },
    { id: 'po5', name: 'PO5', type: 'postcode', fullName: 'PO5, Eastney & Craneswater', county: 'Hampshire', coordinates: [50.7650, -1.0650] },
    { id: 'po6', name: 'PO6', type: 'postcode', fullName: 'PO6, Cosham & Drayton', county: 'Hampshire', coordinates: [50.8450, -1.0650] },

    // Districts
    { id: 'portsmouth', name: 'Portsmouth', type: 'district', fullName: 'Portsmouth, Hampshire', county: 'Hampshire', coordinates: [50.8058, -1.0872] },
    { id: 'havant', name: 'Havant', type: 'district', fullName: 'Havant, Hampshire', county: 'Hampshire', coordinates: [50.8550, -0.9800] },
    { id: 'gosport', name: 'Gosport', type: 'district', fullName: 'Gosport, Hampshire', county: 'Hampshire', coordinates: [50.7950, -1.1250] },
    { id: 'fareham', name: 'Fareham', type: 'district', fullName: 'Fareham, Hampshire', county: 'Hampshire', coordinates: [50.8550, -1.1850] },
  ]

  // Get recent searches from localStorage
  const getRecentSearches = (): LocationSuggestion[] => {
    try {
      const recent = localStorage.getItem('recentLocationSearches')
      if (recent) {
        const recentIds = JSON.parse(recent)
        return recentIds.map((id: string) => {
          const location = locationData.find(l => l.id === id)
          return location ? { ...location, type: 'recent' as const } : null
        }).filter(Boolean).slice(0, 3)
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
      const recentIds = recent.map(r => r.id)
      const updatedIds = [suggestion.id, ...recentIds.filter(id => id !== suggestion.id)].slice(0, 5)
      localStorage.setItem('recentLocationSearches', JSON.stringify(updatedIds))
    } catch (error) {
      console.error('Error saving recent search:', error)
    }
  }

  // Filter suggestions based on input
  const filterSuggestions = (query: string): LocationSuggestion[] => {
    if (!query.trim()) {
      // Show recent searches when no query
      const recent = getRecentSearches()
      return recent.length > 0 ? recent : locationData.slice(0, 6)
    }

    const queryLower = query.toLowerCase()
    return locationData.filter(location =>
      location.name.toLowerCase().includes(queryLower) ||
      location.fullName.toLowerCase().includes(queryLower) ||
      location.county?.toLowerCase().includes(queryLower)
    ).sort((a, b) => {
      // Prioritize exact matches, then starts with, then contains
      const aName = a.name.toLowerCase()
      const bName = b.name.toLowerCase()

      if (aName === queryLower) return -1
      if (bName === queryLower) return 1
      if (aName.startsWith(queryLower)) return -1
      if (bName.startsWith(queryLower)) return 1
      return 0
    }).slice(0, 8)
  }

  useEffect(() => {
    const filtered = filterSuggestions(value)
    setSuggestions(filtered)
    setHighlightedIndex(-1)
  }, [value])

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
      case 'postcode':
        return <Search className="w-4 h-4 text-primary" />
      default:
        return <MapPin className="w-4 h-4 text-accent" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'recent':
        return 'Recent'
      case 'postcode':
        return 'Postcode'
      case 'district':
        return 'District'
      default:
        return 'Area'
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
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-surface border border-border rounded-xl shadow-2xl z-50 mt-1 max-h-80 overflow-y-auto">
          <div className="py-2">
            {!value.trim() && (
              <div className="px-4 py-2 text-xs font-medium text-text-muted border-b border-border">
                {getRecentSearches().length > 0 ? 'Recent Searches' : 'Popular Locations'}
              </div>
            )}

            {suggestions.map((suggestion, index) => (
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
                  </div>
                  <div className="text-sm text-text-muted truncate">
                    {suggestion.fullName}
                  </div>
                </div>
              </button>
            ))}

            {value.trim() && suggestions.length === 0 && (
              <div className="px-4 py-8 text-center text-text-muted">
                <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <div className="font-medium mb-1">No locations found</div>
                <div className="text-sm">Try searching for an area or postcode</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}