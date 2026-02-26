// Type definitions with backward compatibility for Prisma -> Supabase migration
export type ListingType = 'sale' | 'rent' | 'SALE' | 'RENT'
export type PropertyType = 'detached' | 'semi_detached' | 'terraced' | 'flat' | 'bungalow' | 'maisonette' | 'cottage' | 'town_house' | 'park_home' | 'land' | 'other' | 'DETACHED' | 'SEMI_DETACHED' | 'TERRACED' | 'FLAT' | 'BUNGALOW' | 'MAISONETTE' | 'COTTAGE' | 'TOWN_HOUSE' | 'PARK_HOME' | 'LAND' | 'OTHER'
export type Tenure = 'freehold' | 'leasehold' | 'share_of_freehold' | 'commonhold' | 'FREEHOLD' | 'LEASEHOLD' | 'SHARE_OF_FREEHOLD' | 'COMMONHOLD'
export type Furnished = 'furnished' | 'unfurnished' | 'part_furnished' | 'FURNISHED' | 'UNFURNISHED' | 'PART_FURNISHED'
export type HeatingType = 'gas_central' | 'electric' | 'oil' | 'heat_pump' | 'biomass' | 'district' | 'other' | 'GAS_CENTRAL' | 'ELECTRIC' | 'OIL' | 'HEAT_PUMP' | 'BIOMASS' | 'DISTRICT' | 'OTHER'
export type ParkingType = 'driveway' | 'garage' | 'allocated' | 'on_street' | 'none' | 'DRIVEWAY' | 'GARAGE' | 'ALLOCATED' | 'ON_STREET' | 'NONE'
export type GardenType = 'private' | 'communal' | 'none' | 'PRIVATE' | 'COMMUNAL' | 'NONE'
export type Orientation = 'north' | 'south' | 'east' | 'west' | 'NORTH' | 'SOUTH' | 'EAST' | 'WEST'

export interface PropertyFilters {
  // Basic
  listingType?: ListingType
  location?: string
  priceMin?: number
  priceMax?: number
  bedrooms?: number[]
  bathrooms?: {
    min?: number
    max?: number
  } | number[]
  propertyType?: PropertyType[]
  propertyTypes?: string[] // For advanced filters

  // Size & Specs
  floorAreaMin?: number // sqft
  floorAreaMax?: number // sqft
  floorArea?: {
    min?: number
    max?: number
  }
  receptionRoomsMin?: number
  plotSizeMin?: number // sqft
  floorLevel?: string[]

  // Property Features (boolean flags)
  newBuild?: boolean
  periodProperty?: boolean
  modern?: boolean
  cottage?: boolean
  fixerUpper?: boolean
  utilityRoom?: boolean
  basement?: boolean
  conservatory?: boolean
  homeOffice?: boolean
  enSuite?: boolean
  bathtub?: boolean
  patio?: boolean
  kitchenIsland?: boolean
  loftConversion?: boolean
  annexe?: boolean
  openPlanKitchen?: boolean
  separateDiningRoom?: boolean
  downstairsWc?: boolean
  doubleGlazing?: boolean
  logBurner?: boolean
  solarPanels?: boolean
  underfloorHeating?: boolean
  wetRoom?: boolean
  walkInWardrobe?: boolean
  bifoldDoors?: boolean
  bayWindows?: boolean
  originalFeatures?: boolean
  cellar?: boolean
  garage?: boolean
  outbuildings?: boolean
  swimmingPool?: boolean
  balcony?: boolean
  roofTerrace?: boolean

  // Tenure & Costs
  tenure?: Tenure[]
  serviceChargeMax?: number // pence annually
  groundRentMax?: number // pence annually
  leaseLengthMin?: number // years

  // Energy & Utilities
  epcRatingMin?: string // A, B, C, D, E, F, G
  epcRating?: string[] // A, B, C, D, E, F, G
  heatingType?: HeatingType[]
  mainsGas?: boolean
  mainsSewer?: boolean
  energyCostMax?: number // pence annually

  // Outdoor & Parking
  garden?: boolean
  parking?: boolean
  gardenType?: GardenType[]
  gardenOrientation?: Orientation[]
  parkingType?: ParkingType[]
  evCharging?: boolean

  // Status
  chainFree?: boolean
  priceReduced?: boolean
  newListings?: boolean // last 7 days
  excludeUnderOffer?: boolean
  daysOnMarketMin?: number
  daysOnMarketMax?: number

  // Rental Extras (only for lettings)
  furnished?: Furnished[]
  petsAllowed?: boolean
  billsIncluded?: boolean
  depositMax?: number // pence
  availableFromDate?: string
  minTenancyMax?: number // months

  // Geospatial
  latitude?: number
  longitude?: number
  radius?: number // miles
  boundingBox?: {
    swLat: number
    swLng: number
    neLat: number
    neLng: number
  }
  polygon?: Array<[number, number]>

  // Sorting & Pagination
  sortBy?: 'newest' | 'price_low' | 'price_high' | 'most_reduced' | 'nearest'
  page?: number
  limit?: number

  // Search & Metadata
  keywords?: string
  addedToMarket?: string // number of days

  // Hidden properties (for logged-in users)
  excludeHidden?: boolean
  userId?: string
}

export interface FilterOption {
  value: string | number | boolean
  label: string
  count?: number
}

export interface FilterGroup {
  key: keyof PropertyFilters
  label: string
  type: 'select' | 'multiselect' | 'range' | 'boolean' | 'checkbox'
  options?: FilterOption[]
  min?: number
  max?: number
  step?: number
}

export interface ActiveFilter {
  key: keyof PropertyFilters
  value: any
  label: string
  displayValue: string
}

export const PROPERTY_FEATURE_GROUPS = {
  'Property Features': [
    'periodProperty', 'modern', 'cottage', 'newBuild'
  ],
  'Indoor Features': [
    'utilityRoom', 'basement', 'conservatory', 'homeOffice',
    'enSuite', 'bathtub', 'downstairsWc', 'separateDiningRoom',
    'openPlanKitchen', 'kitchenIsland', 'loftConversion',
    'walkInWardrobe', 'wetRoom'
  ],
  'Outdoor Features': [
    'patio', 'balcony', 'roofTerrace', 'outbuildings', 'swimmingPool'
  ],
  'Character & Period': [
    'originalFeatures', 'bayWindows', 'bifoldDoors', 'cellar'
  ],
  'Modern Amenities': [
    'doubleGlazing', 'underfloorHeating', 'solarPanels',
    'logBurner', 'evCharging'
  ]
} as const