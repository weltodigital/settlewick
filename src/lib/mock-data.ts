// Mock data for development when database is not available
import type { PropertyWithDetails } from '@/types/property'

export const MOCK_AGENTS = [
  {
    id: '1',
    name: 'Chinneck Shaw',
    slug: 'chinneck-shaw',
    branchName: 'Portsmouth',
    email: 'portsmouth@chinneckshaw.co.uk',
    phone: '023 9229 5046',
    websiteUrl: 'https://chinneckshaw.co.uk',
    logoUrl: null,
    addressLine1: '123 High Street',
    addressTown: 'Portsmouth',
    addressPostcode: 'PO1 2AA',
    latitude: 50.8058,
    longitude: -1.0872,
    description: 'Independent estate agents specialising in Portsmouth properties since 1995.',
    subscriptionTier: 'FREE' as const,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Whiteley & Co',
    slug: 'whiteley-co',
    branchName: 'Southsea',
    email: 'southsea@whiteleyco.co.uk',
    phone: '023 9273 3456',
    websiteUrl: 'https://whiteleyco.co.uk',
    logoUrl: null,
    addressLine1: '45 Albert Road',
    addressTown: 'Southsea',
    addressPostcode: 'PO4 0JW',
    latitude: 50.7896,
    longitude: -1.0854,
    description: 'Premier estate agents serving Portsmouth and surrounding areas for over 25 years.',
    subscriptionTier: 'BASIC' as const,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export const MOCK_PROPERTIES: PropertyWithDetails[] = [
  {
    id: '1',
    slug: '3-bed-terraced-albert-road-southsea',
    listingType: 'SALE',
    status: 'AVAILABLE',
    price: 32500000, // £325k
    priceQualifier: 'OFFERS_OVER',
    propertyType: 'TERRACED',
    newBuild: false,
    addressLine1: '142 Albert Road',
    addressLine2: null,
    addressTown: 'Southsea',
    addressCounty: 'Hampshire',
    addressPostcode: 'PO4 0JT',
    latitude: 50.7896,
    longitude: -1.0854,
    bedrooms: 3,
    bathrooms: 2,
    receptionRooms: 2,
    floorAreaSqft: 1250,
    floorAreaSqm: 116.1,
    plotSizeSqft: null,
    floorLevel: null,
    tenure: 'FREEHOLD',
    leaseLengthRemaining: null,
    serviceChargeAnnual: null,
    groundRentAnnual: null,
    epcRating: 'C',
    epcPotentialRating: 'B',
    heatingType: 'GAS_CENTRAL',
    mainsGas: true,
    mainsSewer: true,
    estimatedAnnualEnergyCost: 120000,
    gardenType: 'PRIVATE',
    gardenOrientation: 'SOUTH',
    parkingType: 'ON_STREET',
    evCharging: false,
    periodProperty: true,
    modern: false,
    cottage: false,
    fixerUpper: false,
    utilityRoom: false,
    basement: false,
    conservatory: true,
    homeOffice: false,
    enSuite: true,
    bathtub: true,
    patio: true,
    kitchenIsland: false,
    loftConversion: false,
    annexe: false,
    openPlanKitchen: true,
    separateDiningRoom: true,
    downstairsWc: true,
    doubleGlazing: true,
    logBurner: false,
    solarPanels: false,
    underfloorHeating: false,
    wetRoom: false,
    walkInWardrobe: false,
    bifoldDoors: true,
    bayWindows: true,
    originalFeatures: true,
    cellar: false,
    garage: false,
    outbuildings: false,
    swimmingPool: false,
    balcony: false,
    roofTerrace: false,
    furnished: null,
    petsAllowed: null,
    billsIncluded: null,
    depositAmount: null,
    availableFrom: null,
    minTenancyMonths: null,
    chainFree: true,
    listedDate: new Date('2024-01-15'),
    priceChangedDate: null,
    originalPrice: null,
    description: 'A beautifully presented 3 bedroom Victorian terraced house located in the heart of Southsea. This charming property features period character throughout with modern conveniences, including an open-plan kitchen-dining area, conservatory, and private south-facing garden.',
    summary: '3 bedroom Victorian terraced house in Southsea',
    agentId: '2',
    createdBy: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
    agent: MOCK_AGENTS[1],
    images: [
      {
        id: '1',
        propertyId: '1',
        imageUrl: 'https://placehold.co/800x600/e2e8f0/64748b?text=Victorian+Terraced+House',
        caption: 'Front exterior',
        displayOrder: 0,
        isFloorplan: false,
        isPrimary: true,
        roomTag: 'EXTERIOR',
        createdAt: new Date()
      },
      {
        id: '2',
        propertyId: '1',
        imageUrl: 'https://placehold.co/800x600/f8f9fa/6c757d?text=Living+Room',
        caption: 'Spacious living room',
        displayOrder: 1,
        isFloorplan: false,
        isPrimary: false,
        roomTag: 'LIVING_ROOM',
        createdAt: new Date()
      }
    ],
    priceHistory: [
      {
        id: '1',
        propertyId: '1',
        eventType: 'LISTED',
        price: 32500000,
        date: new Date('2024-01-15'),
        createdAt: new Date()
      }
    ]
  },
  {
    id: '2',
    slug: '2-bed-flat-palmerston-road-southsea',
    listingType: 'SALE',
    status: 'AVAILABLE',
    price: 22500000, // £225k
    priceQualifier: 'FIXED_PRICE',
    propertyType: 'FLAT',
    newBuild: false,
    addressLine1: '78 Palmerston Road',
    addressLine2: 'Flat 2',
    addressTown: 'Southsea',
    addressCounty: 'Hampshire',
    addressPostcode: 'PO4 0RN',
    latitude: 50.7920,
    longitude: -1.0840,
    bedrooms: 2,
    bathrooms: 1,
    receptionRooms: 1,
    floorAreaSqft: 750,
    floorAreaSqm: 69.7,
    plotSizeSqft: null,
    floorLevel: 'FIRST',
    tenure: 'LEASEHOLD',
    leaseLengthRemaining: 95,
    serviceChargeAnnual: 150000, // £1500
    groundRentAnnual: 25000, // £250
    epcRating: 'D',
    epcPotentialRating: 'C',
    heatingType: 'ELECTRIC',
    mainsGas: false,
    mainsSewer: true,
    estimatedAnnualEnergyCost: 160000,
    gardenType: 'COMMUNAL',
    gardenOrientation: null,
    parkingType: 'ON_STREET',
    evCharging: false,
    periodProperty: false,
    modern: true,
    cottage: false,
    fixerUpper: false,
    utilityRoom: false,
    basement: false,
    conservatory: false,
    homeOffice: false,
    enSuite: false,
    bathtub: true,
    patio: false,
    kitchenIsland: false,
    loftConversion: false,
    annexe: false,
    openPlanKitchen: true,
    separateDiningRoom: false,
    downstairsWc: false,
    doubleGlazing: true,
    logBurner: false,
    solarPanels: false,
    underfloorHeating: false,
    wetRoom: false,
    walkInWardrobe: false,
    bifoldDoors: false,
    bayWindows: false,
    originalFeatures: false,
    cellar: false,
    garage: false,
    outbuildings: false,
    swimmingPool: false,
    balcony: true,
    roofTerrace: false,
    furnished: null,
    petsAllowed: null,
    billsIncluded: null,
    depositAmount: null,
    availableFrom: null,
    minTenancyMonths: null,
    chainFree: false,
    listedDate: new Date('2024-02-01'),
    priceChangedDate: new Date('2024-02-20'),
    originalPrice: 24500000, // Was £245k
    description: 'Modern 2 bedroom apartment situated on the first floor of a period conversion. The property boasts a bright open-plan living area, fitted kitchen, and private balcony. Ideally located within walking distance of Southsea seafront and local amenities.',
    summary: '2 bedroom modern flat in Southsea',
    agentId: '1',
    createdBy: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
    agent: MOCK_AGENTS[0],
    images: [
      {
        id: '3',
        propertyId: '2',
        imageUrl: 'https://placehold.co/800x600/e2e8f0/64748b?text=Modern+Flat',
        caption: 'Apartment exterior',
        displayOrder: 0,
        isFloorplan: false,
        isPrimary: true,
        roomTag: 'EXTERIOR',
        createdAt: new Date()
      }
    ],
    priceHistory: [
      {
        id: '2',
        propertyId: '2',
        eventType: 'LISTED',
        price: 24500000,
        date: new Date('2024-02-01'),
        createdAt: new Date()
      },
      {
        id: '3',
        propertyId: '2',
        eventType: 'PRICE_REDUCED',
        price: 22500000,
        date: new Date('2024-02-20'),
        createdAt: new Date()
      }
    ]
  },
  // Add rental property
  {
    id: '3',
    slug: '1-bed-flat-elm-grove-southsea-rent',
    listingType: 'RENT',
    status: 'AVAILABLE',
    price: 95000, // £950 pcm
    priceQualifier: null,
    propertyType: 'FLAT',
    newBuild: false,
    addressLine1: '56 Elm Grove',
    addressLine2: 'Flat A',
    addressTown: 'Southsea',
    addressCounty: 'Hampshire',
    addressPostcode: 'PO5 1JF',
    latitude: 50.7980,
    longitude: -1.0820,
    bedrooms: 1,
    bathrooms: 1,
    receptionRooms: 1,
    floorAreaSqft: 550,
    floorAreaSqm: 51.1,
    plotSizeSqft: null,
    floorLevel: 'GROUND',
    tenure: 'LEASEHOLD',
    leaseLengthRemaining: null,
    serviceChargeAnnual: null,
    groundRentAnnual: null,
    epcRating: 'C',
    epcPotentialRating: 'B',
    heatingType: 'GAS_CENTRAL',
    mainsGas: true,
    mainsSewer: true,
    estimatedAnnualEnergyCost: 90000,
    gardenType: 'NONE',
    gardenOrientation: null,
    parkingType: 'ON_STREET',
    evCharging: false,
    periodProperty: false,
    modern: true,
    cottage: false,
    fixerUpper: false,
    utilityRoom: false,
    basement: false,
    conservatory: false,
    homeOffice: false,
    enSuite: false,
    bathtub: false,
    patio: false,
    kitchenIsland: false,
    loftConversion: false,
    annexe: false,
    openPlanKitchen: true,
    separateDiningRoom: false,
    downstairsWc: false,
    doubleGlazing: true,
    logBurner: false,
    solarPanels: false,
    underfloorHeating: false,
    wetRoom: true,
    walkInWardrobe: false,
    bifoldDoors: false,
    bayWindows: false,
    originalFeatures: false,
    cellar: false,
    garage: false,
    outbuildings: false,
    swimmingPool: false,
    balcony: false,
    roofTerrace: false,
    furnished: 'FURNISHED',
    petsAllowed: false,
    billsIncluded: false,
    depositAmount: 142500, // £1,425 (1.5 months)
    availableFrom: new Date('2024-03-01'),
    minTenancyMonths: 12,
    chainFree: null,
    listedDate: new Date('2024-02-10'),
    priceChangedDate: null,
    originalPrice: null,
    description: 'Stylish 1 bedroom ground floor apartment available to rent. The property features an open-plan living area, modern fitted kitchen, wet room, and comes fully furnished. Located close to Southsea Common and seafront.',
    summary: '1 bedroom furnished flat to rent in Southsea',
    agentId: '2',
    createdBy: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
    agent: MOCK_AGENTS[1],
    images: [
      {
        id: '4',
        propertyId: '3',
        imageUrl: 'https://placehold.co/800x600/e2e8f0/64748b?text=Rental+Flat',
        caption: 'Rental flat exterior',
        displayOrder: 0,
        isFloorplan: false,
        isPrimary: true,
        roomTag: 'EXTERIOR',
        createdAt: new Date()
      }
    ],
    priceHistory: [
      {
        id: '4',
        propertyId: '3',
        eventType: 'LISTED',
        price: 95000,
        date: new Date('2024-02-10'),
        createdAt: new Date()
      }
    ]
  }
]

export function getMockProperties(filters: any = {}) {
  let filteredProperties = [...MOCK_PROPERTIES]

  // Filter by listing type
  if (filters.listingType) {
    filteredProperties = filteredProperties.filter(p => p.listingType === filters.listingType)
  }

  // Filter by location (simple text search)
  if (filters.location) {
    const location = filters.location.toLowerCase()
    filteredProperties = filteredProperties.filter(p =>
      p.addressTown.toLowerCase().includes(location) ||
      p.addressLine1.toLowerCase().includes(location) ||
      p.addressPostcode.toLowerCase().includes(location)
    )
  }

  // Filter by price
  if (filters.priceMin) {
    const minPrice = filters.priceMin * 100 // Convert to pence
    filteredProperties = filteredProperties.filter(p => p.price >= minPrice)
  }

  if (filters.priceMax) {
    const maxPrice = filters.priceMax * 100 // Convert to pence
    filteredProperties = filteredProperties.filter(p => p.price <= maxPrice)
  }

  // Filter by bedrooms
  if (filters.bedrooms && filters.bedrooms.length > 0) {
    filteredProperties = filteredProperties.filter(p =>
      p.bedrooms && filters.bedrooms.includes(p.bedrooms)
    )
  }

  // Filter by property type
  if (filters.propertyType && filters.propertyType.length > 0) {
    filteredProperties = filteredProperties.filter(p =>
      filters.propertyType.includes(p.propertyType)
    )
  }

  // Sort
  switch (filters.sortBy) {
    case 'price_low':
      filteredProperties.sort((a, b) => a.price - b.price)
      break
    case 'price_high':
      filteredProperties.sort((a, b) => b.price - a.price)
      break
    case 'most_reduced':
      filteredProperties.sort((a, b) => {
        const aReduced = a.originalPrice ? 1 : 0
        const bReduced = b.originalPrice ? 1 : 0
        return bReduced - aReduced
      })
      break
    default: // newest
      filteredProperties.sort((a, b) => b.listedDate.getTime() - a.listedDate.getTime())
  }

  // Pagination
  const page = filters.page || 1
  const limit = filters.limit || 20
  const start = (page - 1) * limit
  const paginatedProperties = filteredProperties.slice(start, start + limit)

  return {
    properties: paginatedProperties,
    total: filteredProperties.length,
    page,
    totalPages: Math.ceil(filteredProperties.length / limit),
    filters
  }
}