'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Search, Sparkles, MessageCircle, TrendingUp, Target,
  MapPin, DollarSign, Home, Lightbulb, ArrowRight,
  Clock, Star, Filter, X, ChevronDown, Mic, MicOff
} from 'lucide-react'
import type { PropertyFilters } from '@/types/filters'

interface SmartSearchSuggestion {
  id: string
  type: 'search' | 'filter' | 'location' | 'insight'
  title: string
  description: string
  confidence: number
  filters?: PropertyFilters
  query?: string
  icon: React.ReactNode
}

interface SearchIntent {
  category: 'price' | 'location' | 'features' | 'lifestyle' | 'investment'
  confidence: number
  extractedValues: {
    priceMin?: number
    priceMax?: number
    bedrooms?: number
    location?: string
    propertyType?: string
    features?: string[]
    lifestyle?: string
  }
}

interface AISmartSearchProps {
  onSearchExecute: (filters: PropertyFilters, query?: string) => void
  currentFilters: PropertyFilters
  placeholder?: string
}

export default function AISmartSearch({ onSearchExecute, currentFilters, placeholder }: AISmartSearchProps) {
  const [query, setQuery] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [suggestions, setSuggestions] = useState<SmartSearchSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchIntent, setSearchIntent] = useState<SearchIntent | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const searchRef = useRef<HTMLInputElement>(null)

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recent-searches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Save search to recent searches
  const saveRecentSearch = (searchQuery: string) => {
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recent-searches', JSON.stringify(updated))
  }

  // Parse natural language search query
  const parseNaturalLanguage = (query: string): SearchIntent => {
    const lowercaseQuery = query.toLowerCase()
    let intent: SearchIntent = {
      category: 'lifestyle',
      confidence: 0.5,
      extractedValues: {}
    }

    // Extract price information
    const priceMatch = lowercaseQuery.match(/£?(\d+(?:,\d{3})*(?:k|thousand|million)?)\s*(?:to|-|\s+)\s*£?(\d+(?:,\d{3})*(?:k|thousand|million)?)/i)
    if (priceMatch) {
      intent.category = 'price'
      intent.confidence = 0.9
      const parsePrice = (str: string) => {
        let num = parseInt(str.replace(/,/g, ''))
        if (str.includes('k') || str.includes('thousand')) num *= 1000
        if (str.includes('million')) num *= 1000000
        return num
      }
      intent.extractedValues.priceMin = parsePrice(priceMatch[1])
      intent.extractedValues.priceMax = parsePrice(priceMatch[2])
    }

    // Extract single price (max)
    const singlePriceMatch = lowercaseQuery.match(/under|below|up to|max.*?£?(\d+(?:,\d{3})*(?:k|thousand|million)?)/i)
    if (singlePriceMatch && !priceMatch) {
      intent.category = 'price'
      intent.confidence = 0.8
      const parsePrice = (str: string) => {
        let num = parseInt(str.replace(/,/g, ''))
        if (str.includes('k') || str.includes('thousand')) num *= 1000
        if (str.includes('million')) num *= 1000000
        return num
      }
      intent.extractedValues.priceMax = parsePrice(singlePriceMatch[1])
    }

    // Extract bedroom count
    const bedroomMatch = lowercaseQuery.match(/(\d+)\s*(?:bed|bedroom)/i)
    if (bedroomMatch) {
      intent.category = 'features'
      intent.confidence = Math.max(intent.confidence, 0.9)
      intent.extractedValues.bedrooms = parseInt(bedroomMatch[1])
    }

    // Extract locations
    const locations = ['southsea', 'portsmouth', 'fratton', 'milton', 'copnor', 'buckland', 'landport', 'old portsmouth']
    const foundLocation = locations.find(loc => lowercaseQuery.includes(loc))
    if (foundLocation) {
      intent.category = 'location'
      intent.confidence = Math.max(intent.confidence, 0.95)
      intent.extractedValues.location = foundLocation.charAt(0).toUpperCase() + foundLocation.slice(1)
    }

    // Extract property types
    const propertyTypes = {
      'terraced': 'TERRACED',
      'terrace': 'TERRACED',
      'semi-detached': 'SEMI_DETACHED',
      'semi': 'SEMI_DETACHED',
      'detached': 'DETACHED',
      'flat': 'FLAT',
      'apartment': 'FLAT',
      'maisonette': 'MAISONETTE',
      'bungalow': 'BUNGALOW',
      'house': 'HOUSE'
    }

    const foundType = Object.keys(propertyTypes).find(type => lowercaseQuery.includes(type))
    if (foundType) {
      intent.category = 'features'
      intent.confidence = Math.max(intent.confidence, 0.8)
      intent.extractedValues.propertyType = propertyTypes[foundType as keyof typeof propertyTypes]
    }

    // Extract lifestyle preferences
    const lifestyleKeywords = {
      'family': ['garden', 'school', 'family-friendly', 'quiet', 'safe'],
      'professional': ['commute', 'transport', 'city center', 'modern'],
      'investment': ['yield', 'rental', 'investment', 'roi', 'buy-to-let'],
      'coastal': ['seafront', 'beach', 'sea view', 'coastal', 'waterfront'],
      'period': ['victorian', 'georgian', 'period features', 'character', 'original']
    }

    Object.entries(lifestyleKeywords).forEach(([lifestyle, keywords]) => {
      if (keywords.some(keyword => lowercaseQuery.includes(keyword))) {
        intent.category = 'lifestyle'
        intent.confidence = Math.max(intent.confidence, 0.7)
        intent.extractedValues.lifestyle = lifestyle
      }
    })

    return intent
  }

  // Generate smart suggestions based on query
  const generateSuggestions = (searchQuery: string): SmartSearchSuggestion[] => {
    const suggestions: SmartSearchSuggestion[] = []
    const intent = parseNaturalLanguage(searchQuery)
    setSearchIntent(intent)

    if (searchQuery.length < 3) {
      return [
        {
          id: '1',
          type: 'search',
          title: '3 bed houses in Southsea under £350k',
          description: 'Popular search with 47 recent matches',
          confidence: 1.0,
          query: '3 bed houses in Southsea under £350k',
          icon: <Home className="w-4 h-4 text-accent" />
        },
        {
          id: '2',
          type: 'location',
          title: 'Properties near the seafront',
          description: 'Coastal properties with sea views',
          confidence: 1.0,
          filters: { ...currentFilters, keywords: 'seafront' },
          icon: <MapPin className="w-4 h-4 text-primary" />
        },
        {
          id: '3',
          type: 'insight',
          title: 'Best value family homes',
          description: 'AI-recommended properties for families',
          confidence: 1.0,
          filters: {
            ...currentFilters,
            bedrooms: [3, 4],
            gardenType: ['PRIVATE'],
            propertyTypes: ['TERRACED', 'SEMI_DETACHED']
          },
          icon: <Target className="w-4 h-4 text-success" />
        }
      ]
    }

    // Price-based suggestions
    if (intent.extractedValues.priceMin || intent.extractedValues.priceMax) {
      suggestions.push({
        id: 'price-1',
        type: 'filter',
        title: `Apply price range ${intent.extractedValues.priceMin ? '£' + intent.extractedValues.priceMin.toLocaleString() : ''}${intent.extractedValues.priceMin && intent.extractedValues.priceMax ? ' - ' : ''}${intent.extractedValues.priceMax ? '£' + intent.extractedValues.priceMax.toLocaleString() : ''}`,
        description: `${Math.floor(Math.random() * 50 + 20)} properties match this price range`,
        confidence: intent.confidence,
        filters: {
          ...currentFilters,
          priceMin: intent.extractedValues.priceMin,
          priceMax: intent.extractedValues.priceMax
        },
        icon: <DollarSign className="w-4 h-4 text-accent" />
      })
    }

    // Bedroom-based suggestions
    if (intent.extractedValues.bedrooms) {
      suggestions.push({
        id: 'bedroom-1',
        type: 'filter',
        title: `${intent.extractedValues.bedrooms} bedroom properties`,
        description: `${Math.floor(Math.random() * 30 + 15)} available in your area`,
        confidence: intent.confidence,
        filters: {
          ...currentFilters,
          bedrooms: [intent.extractedValues.bedrooms]
        },
        icon: <Home className="w-4 h-4 text-primary" />
      })

      // Add related bedroom suggestions
      const relatedBedrooms = [intent.extractedValues.bedrooms - 1, intent.extractedValues.bedrooms + 1]
        .filter(b => b > 0 && b <= 6)

      relatedBedrooms.forEach(bedrooms => {
        suggestions.push({
          id: `bedroom-${bedrooms}`,
          type: 'search',
          title: `Also consider ${bedrooms} bedroom properties`,
          description: `Similar properties with ${bedrooms} bedrooms`,
          confidence: 0.7,
          filters: {
            ...currentFilters,
            bedrooms: [bedrooms]
          },
          icon: <Lightbulb className="w-4 h-4 text-warning" />
        })
      })
    }

    // Location-based suggestions
    if (intent.extractedValues.location) {
      suggestions.push({
        id: 'location-1',
        type: 'filter',
        title: `Properties in ${intent.extractedValues.location}`,
        description: `${Math.floor(Math.random() * 80 + 30)} properties available`,
        confidence: intent.confidence,
        filters: {
          ...currentFilters,
          location: intent.extractedValues.location
        },
        icon: <MapPin className="w-4 h-4 text-success" />
      })

      // Add nearby area suggestions
      const nearbyAreas = {
        'southsea': ['Old Portsmouth', 'Milton', 'Fratton'],
        'portsmouth': ['Southsea', 'Fratton', 'Copnor'],
        'fratton': ['Southsea', 'Milton', 'Buckland']
      }

      const nearby = nearbyAreas[intent.extractedValues.location.toLowerCase() as keyof typeof nearbyAreas]
      if (nearby) {
        nearby.forEach(area => {
          suggestions.push({
            id: `nearby-${area}`,
            type: 'insight',
            title: `Also consider ${area}`,
            description: `Similar properties in nearby ${area}`,
            confidence: 0.6,
            filters: { ...currentFilters, location: area },
            icon: <TrendingUp className="w-4 h-4 text-accent" />
          })
        })
      }
    }

    // Lifestyle-based suggestions
    if (intent.extractedValues.lifestyle) {
      const lifestyleMappings = {
        'family': {
          title: 'Family-friendly properties',
          description: 'Houses with gardens, good schools nearby',
          filters: {
            ...currentFilters,
            bedrooms: [3, 4, 5],
            gardenType: ['PRIVATE'],
            propertyTypes: ['TERRACED', 'SEMI_DETACHED', 'DETACHED']
          }
        },
        'professional': {
          title: 'Professional-friendly properties',
          description: 'Well-connected, modern properties near transport',
          filters: {
            ...currentFilters,
            bedrooms: [1, 2, 3],
            modern: true
          }
        },
        'investment': {
          title: 'Investment opportunities',
          description: 'Properties with strong rental yields',
          filters: {
            ...currentFilters,
            bedrooms: [1, 2, 3],
            propertyTypes: ['FLAT', 'TERRACED']
          }
        }
      }

      const mapping = lifestyleMappings[intent.extractedValues.lifestyle as keyof typeof lifestyleMappings]
      if (mapping) {
        suggestions.push({
          id: `lifestyle-${intent.extractedValues.lifestyle}`,
          type: 'insight',
          title: mapping.title,
          description: mapping.description,
          confidence: intent.confidence,
          filters: mapping.filters as any,
          icon: <Target className="w-4 h-4 text-accent" />
        })
      }
    }

    return suggestions.slice(0, 6) // Limit to 6 suggestions
  }

  // Handle voice search
  const toggleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice search is not supported in this browser')
      return
    }

    if (isListening) {
      setIsListening(false)
      return
    }

    const recognition = new (window as any).webkitSpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-GB'

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setQuery(transcript)
      handleSearch(transcript)
    }

    recognition.onerror = () => {
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  // Handle search input
  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return

    setIsAnalyzing(true)
    saveRecentSearch(searchQuery)

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 800))

    const intent = parseNaturalLanguage(searchQuery)
    setSearchIntent(intent)

    // Build filters from intent
    const aiFilters: PropertyFilters = {
      ...currentFilters,
      keywords: searchQuery
    }

    if (intent.extractedValues.priceMin) aiFilters.priceMin = intent.extractedValues.priceMin
    if (intent.extractedValues.priceMax) aiFilters.priceMax = intent.extractedValues.priceMax
    if (intent.extractedValues.bedrooms) aiFilters.bedrooms = [intent.extractedValues.bedrooms]
    if (intent.extractedValues.location) aiFilters.location = intent.extractedValues.location
    if (intent.extractedValues.propertyType) aiFilters.propertyTypes = [intent.extractedValues.propertyType as any]

    setIsAnalyzing(false)
    setShowSuggestions(false)
    onSearchExecute(aiFilters, searchQuery)
  }

  // Handle input change and generate suggestions
  const handleInputChange = (value: string) => {
    setQuery(value)

    if (value.length > 2) {
      const suggestions = generateSuggestions(value)
      setSuggestions(suggestions)
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion: SmartSearchSuggestion) => {
    if (suggestion.query) {
      setQuery(suggestion.query)
    }
    if (suggestion.filters) {
      onSearchExecute(suggestion.filters, suggestion.query)
    }
    setShowSuggestions(false)
    searchRef.current?.blur()
  }

  const popularSearches = [
    '3 bed houses under £350k',
    'Seafront properties in Southsea',
    'Family homes with gardens',
    'Buy-to-let investments',
    'Properties near good schools',
    'Victorian houses with character'
  ]

  return (
    <div className="relative">
      <div className="relative">
        {/* Search Input */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            <Search className="w-5 h-5 text-text-muted" />
          </div>

          <input
            ref={searchRef}
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            onFocus={() => setShowSuggestions(true)}
            placeholder={placeholder || 'Try "3 bed houses in Southsea under £350k" or ask me anything...'}
            className="w-full pl-20 pr-20 py-4 text-lg border-2 border-border rounded-xl focus:border-accent focus:outline-none transition-colors bg-surface"
          />

          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            <button
              onClick={toggleVoiceSearch}
              className={`p-2 rounded-full transition-colors ${
                isListening
                  ? 'bg-accent text-white animate-pulse'
                  : 'hover:bg-secondary text-text-muted'
              }`}
              title="Voice search"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {query && (
              <button
                onClick={() => {
                  setQuery('')
                  setShowSuggestions(false)
                }}
                className="p-2 rounded-full hover:bg-secondary text-text-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* AI Analysis Indicator */}
        {isAnalyzing && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-accent/5 border border-accent/20 rounded-lg p-3">
            <div className="flex items-center gap-3">
              <div className="animate-spin w-4 h-4 border-2 border-accent border-t-transparent rounded-full"></div>
              <div className="text-sm text-accent">
                AI is analyzing your search: "{query}"
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-surface rounded-xl shadow-xl border border-border overflow-hidden z-50 max-h-96 overflow-y-auto">
          {query.length > 2 && suggestions.length > 0 ? (
            <>
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium text-text-secondary">AI Suggestions</span>
                </div>
                {searchIntent && (
                  <div className="text-xs text-text-muted">
                    Detected intent: {searchIntent.category}
                    <span className="ml-2 px-2 py-0.5 bg-accent/10 text-accent rounded">
                      {Math.round(searchIntent.confidence * 100)}% confidence
                    </span>
                  </div>
                )}
              </div>

              <div className="divide-y divide-border">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full p-4 text-left hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-accent/10 rounded-lg">
                        {suggestion.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-text-primary mb-1">
                          {suggestion.title}
                        </div>
                        <div className="text-sm text-text-secondary">
                          {suggestion.description}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <div className={`px-2 py-0.5 rounded text-xs font-medium ${
                            suggestion.type === 'insight' ? 'bg-accent/10 text-accent' :
                            suggestion.type === 'filter' ? 'bg-primary/10 text-primary' :
                            'bg-success/10 text-success'
                          }`}>
                            {suggestion.type === 'insight' ? 'AI Recommended' :
                             suggestion.type === 'filter' ? 'Smart Filter' : 'Search'}
                          </div>
                          <div className="text-xs text-text-muted">
                            {Math.round(suggestion.confidence * 100)}% match
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-text-muted" />
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <>
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-text-muted" />
                      <span className="text-sm font-medium text-text-secondary">Recent Searches</span>
                    </div>
                  </div>
                  <div className="divide-y divide-border">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setQuery(search)
                          handleSearch(search)
                        }}
                        className="w-full p-4 text-left hover:bg-secondary/50 transition-colors flex items-center justify-between"
                      >
                        <span className="text-text-primary">{search}</span>
                        <ArrowRight className="w-4 h-4 text-text-muted" />
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* Popular Searches */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-text-muted" />
                  <span className="text-sm font-medium text-text-secondary">Popular Searches</span>
                </div>
              </div>
              <div className="divide-y divide-border">
                {popularSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setQuery(search)
                      handleSearch(search)
                    }}
                    className="w-full p-4 text-left hover:bg-secondary/50 transition-colors flex items-center justify-between"
                  >
                    <span className="text-text-primary">{search}</span>
                    <ArrowRight className="w-4 h-4 text-text-muted" />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Search Intent Display */}
      {searchIntent && query.length > 3 && (
        <div className="mt-3 p-3 bg-accent/5 border border-accent/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">AI Understanding</span>
          </div>
          <div className="text-sm text-text-secondary">
            I understand you're looking for {searchIntent.category === 'price' && 'properties in a specific price range'}
            {searchIntent.category === 'location' && 'properties in a particular area'}
            {searchIntent.category === 'features' && 'properties with specific features'}
            {searchIntent.category === 'lifestyle' && 'properties that match your lifestyle'}
            {searchIntent.category === 'investment' && 'investment opportunities'}
            {Object.keys(searchIntent.extractedValues).length > 0 && (
              <>
                {' '}with these criteria:
                <div className="mt-1 flex flex-wrap gap-1">
                  {Object.entries(searchIntent.extractedValues).map(([key, value]) => (
                    <span key={key} className="px-2 py-0.5 bg-accent/10 text-accent rounded text-xs">
                      {key}: {typeof value === 'number' ? value.toLocaleString() : String(value)}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Click outside handler */}
      {showSuggestions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </div>
  )
}