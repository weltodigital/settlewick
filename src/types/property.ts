import type { Database } from './database'
import type { ListingType, PropertyType, Tenure, Furnished } from './filters'

// Extract types from Database schema
type DatabaseProperty = Database['public']['Tables']['properties']['Row']

// Local type definitions
export interface PropertyImage {
  id: string
  createdAt: Date
  caption: string | null
  propertyId: string
  imageUrl: string
  displayOrder: number
  isFloorplan: boolean
  isPrimary: boolean
  roomTag: string | null
}

export interface PropertyPriceHistory {
  id: string
  propertyId: string
  eventType: string
  price: number
  date: Date
  priceQualifier?: string | null
  createdAt: Date
}

export interface Agent {
  id: string
  name: string
  slug: string
  branchName: string
  email: string
  phone: string
  websiteUrl: string | null
  logoUrl: string | null
  addressLine1: string
  addressTown: string
  addressPostcode: string
  latitude: number
  longitude: number
  description: string
  subscriptionTier: string
  createdAt: Date
  updatedAt: Date
}

export type PropertyStatus = 'available' | 'under_offer' | 'sstc' | 'sold' | 'let_agreed' | 'let' | 'AVAILABLE' | 'UNDER_OFFER' | 'SSTC' | 'SOLD' | 'LET_AGREED' | 'LET'

// Flexible property type with full backward compatibility
export type Property = {
  id: string
  slug: string
  // Allow any property name with any value for maximum flexibility during migration
  [key: string]: any
}

export type PropertyWithDetails = Property & {
  agent: Agent
  images: PropertyImage[]
  priceHistory: PropertyPriceHistory[]
}

export type PropertySearchFilters = {
  // Basic filters
  listingType?: ListingType
  location?: string
  priceMin?: number
  priceMax?: number
  bedrooms?: number
  bathrooms?: number
  propertyType?: PropertyType[]

  // Advanced filters
  tenure?: Tenure[]
  furnished?: Furnished[]
  chainFree?: boolean
  newBuild?: boolean
  parking?: boolean
  garden?: boolean

  // Area search
  latitude?: number
  longitude?: number
  radius?: number // miles

  // Polygon search (draw your own area)
  polygon?: Array<[number, number]>

  // Sorting
  sortBy?: 'newest' | 'price_low' | 'price_high' | 'most_reduced'

  // Pagination
  page?: number
  limit?: number
}

export type PropertySearchResult = {
  properties: PropertyWithDetails[]
  total: number
  page: number
  totalPages: number
  filters: PropertySearchFilters
}