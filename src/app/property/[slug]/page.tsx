import type { Metadata } from 'next'
import { generatePropertyMetadata } from '@/lib/seo'
import type { PropertyWithDetails } from '@/types/property'
import PropertyDetailClient from './PropertyDetailClient'

// Mock property data - in real app this would come from API
const getMockProperty = (slug: string): PropertyWithDetails | null => {
  // This would normally be an API call
  const mockProperty: PropertyWithDetails = {
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
    description: `A beautifully presented 3 bedroom Victorian terraced house located in the heart of Southsea. This charming property features period character throughout with modern conveniences.

The ground floor comprises an entrance hall, spacious living room with bay window and original features, open-plan kitchen-dining area with modern fitted units and appliances, and a downstairs WC. The kitchen benefits from bi-fold doors opening onto the south-facing garden.

Upstairs, you'll find three well-proportioned bedrooms, with the master bedroom featuring an en-suite shower room. The family bathroom includes a bathtub and is finished to a high standard.

Outside, the property boasts a private south-facing garden with patio area, perfect for entertaining. The property also benefits from a conservatory providing additional reception space.

Located on Albert Road, the property is within easy walking distance of Southsea seafront, local shops, restaurants, and transport links. The property would make an ideal family home or investment opportunity.

Key features include period features, modern kitchen, conservatory, south-facing garden, chain free, and close to amenities.`,
    summary: '3 bedroom Victorian terraced house in Southsea',
    agentId: '2',
    createdBy: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
    agent: {
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
      addressPostcode: 'PO4 0RN',
      latitude: 50.7896,
      longitude: -1.0854,
      description: 'Premier estate agents serving Portsmouth and surrounding areas for over 25 years.',
      subscriptionTier: 'BASIC' as const,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    images: [
      {
        id: '1',
        propertyId: '1',
        imageUrl: 'https://placehold.co/1200x800/e2e8f0/64748b?text=Victorian+House+Exterior',
        caption: 'Front exterior showing period features',
        displayOrder: 0,
        isFloorplan: false,
        isPrimary: true,
        roomTag: 'EXTERIOR',
        createdAt: new Date()
      },
      {
        id: '2',
        propertyId: '1',
        imageUrl: 'https://placehold.co/1200x800/f8f9fa/6c757d?text=Living+Room',
        caption: 'Spacious living room with bay window',
        displayOrder: 1,
        isFloorplan: false,
        isPrimary: false,
        roomTag: 'LIVING_ROOM',
        createdAt: new Date()
      },
      {
        id: '3',
        propertyId: '1',
        imageUrl: 'https://placehold.co/1200x800/f8f9fa/6c757d?text=Kitchen',
        caption: 'Modern fitted kitchen with bi-fold doors',
        displayOrder: 2,
        isFloorplan: false,
        isPrimary: false,
        roomTag: 'KITCHEN',
        createdAt: new Date()
      },
      {
        id: '4',
        propertyId: '1',
        imageUrl: 'https://placehold.co/1200x800/f8f9fa/6c757d?text=Master+Bedroom',
        caption: 'Master bedroom with en-suite',
        displayOrder: 3,
        isFloorplan: false,
        isPrimary: false,
        roomTag: 'BEDROOM_1',
        createdAt: new Date()
      },
      {
        id: '5',
        propertyId: '1',
        imageUrl: 'https://placehold.co/1200x800/f8f9fa/6c757d?text=Garden',
        caption: 'South-facing garden with patio',
        displayOrder: 4,
        isFloorplan: false,
        isPrimary: false,
        roomTag: 'GARDEN',
        createdAt: new Date()
      },
      {
        id: '6',
        propertyId: '1',
        imageUrl: 'https://placehold.co/1200x800/f8f9fa/6c757d?text=Floor+Plan',
        caption: 'Property floor plan',
        displayOrder: 5,
        isFloorplan: true,
        isPrimary: false,
        roomTag: null,
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
  }

  return mockProperty
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const property = getMockProperty(params.slug)

  if (!property) {
    return {
      title: 'Property Not Found | Settlewick',
      description: 'The requested property could not be found.',
      robots: { index: false, follow: false }
    }
  }

  return generatePropertyMetadata(property as any)
}

export default function PropertyDetailPage({ params }: { params: { slug: string } }) {
  return <PropertyDetailClient slug={params.slug} />
}