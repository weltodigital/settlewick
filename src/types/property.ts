import type {
  Property as PrismaProperty,
  PropertyImage,
  PropertyPriceHistory,
  Agent,
  ListingType,
  PropertyStatus,
  PropertyType,
  Tenure,
  Furnished
} from '@prisma/client'

export type Property = PrismaProperty

export type PropertyWithDetails = PrismaProperty & {
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