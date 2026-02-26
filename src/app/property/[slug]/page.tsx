'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import {
  MapPin, Calendar, TrendingDown, Shield, Share2,
  Heart, Eye, Phone, Mail, ArrowLeft, Bed, Bath,
  Maximize, Home, Star
} from 'lucide-react'

import PropertyImageGallery from '@/components/property/PropertyImageGallery'
import PropertyFeatures from '@/components/property/PropertyFeatures'
import PropertyMap from '@/components/map/PropertyMap'
import PropertySchema from '@/components/seo/PropertySchema'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'

import { formatPrice, formatAddress, formatDaysOnMarket, formatPriceReduction } from '@/lib/format'
import { generatePropertyMetadata } from '@/lib/seo'
import type { PropertyWithDetails } from '@/types/property'
import { useSavedProperties } from '@/hooks/useSavedProperties'

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

  return generatePropertyMetadata(property)
}

export default function PropertyDetailPage() {
  const params = useParams()
  const [property, setProperty] = useState<PropertyWithDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const { toggleSave, isSaved } = useSavedProperties()

  const slug = typeof params.slug === 'string' ? params.slug : ''

  useEffect(() => {
    // Simulate API call
    const fetchProperty = async () => {
      setLoading(true)
      try {
        // In real app: const response = await fetch(`/api/properties/${slug}`)
        const mockProperty = getMockProperty(slug)
        setProperty(mockProperty)
      } catch (error) {
        console.error('Error fetching property:', error)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchProperty()
    }
  }, [slug])

  if (loading) {
    return (
      <div className="max-w-8xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-96 bg-secondary rounded-xl" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-32 bg-secondary rounded-xl" />
              <div className="h-64 bg-secondary rounded-xl" />
            </div>
            <div className="h-96 bg-secondary rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="max-w-8xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <Home className="w-16 h-16 mx-auto mb-4 text-text-muted opacity-50" />
          <h1 className="text-2xl font-bold text-text-primary mb-2">Property Not Found</h1>
          <p className="text-text-secondary mb-6">
            The property you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/for-sale/portsmouth" className="btn-primary">
            Browse Properties
          </Link>
        </div>
      </div>
    )
  }

  const hasReduction = property.originalPrice && property.originalPrice > property.price

  const breadcrumbItems = [
    { name: 'Home', url: 'https://settlewick.com/' },
    {
      name: property.listingType === 'SALE' ? 'For Sale' : 'To Rent',
      url: `https://settlewick.com/${property.listingType === 'SALE' ? 'for-sale' : 'to-rent'}`
    },
    {
      name: property.addressTown,
      url: `https://settlewick.com/${property.listingType === 'SALE' ? 'for-sale' : 'to-rent'}/${property.addressTown.toLowerCase()}`
    },
    {
      name: property.addressLine1,
      url: `https://settlewick.com/property/${property.slug}`
    }
  ]

  return (
    <>
      <PropertySchema property={property} />
      <BreadcrumbSchema items={breadcrumbItems} />
      <div className="max-w-8xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Link href="/" className="hover:text-accent">Home</Link>
          <span>/</span>
          <Link href={`/${property.listingType === 'SALE' ? 'for-sale' : 'to-rent'}`} className="hover:text-accent">
            {property.listingType === 'SALE' ? 'For Sale' : 'To Rent'}
          </Link>
          <span>/</span>
          <Link href={`/${property.listingType === 'SALE' ? 'for-sale' : 'to-rent'}/${property.addressTown.toLowerCase()}`} className="hover:text-accent">
            {property.addressTown}
          </Link>
          <span>/</span>
          <span className="text-text-primary">{property.addressLine1}</span>
        </div>
      </nav>

      {/* Back Button */}
      <div className="mb-6">
        <Link
          href={`/${property.listingType === 'SALE' ? 'for-sale' : 'to-rent'}/${property.addressTown.toLowerCase()}`}
          className="inline-flex items-center gap-2 text-accent hover:text-accent-light transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to search results
        </Link>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Property Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image Gallery */}
          <PropertyImageGallery
            images={property.images}
            propertyAddress={formatAddress(
              property.addressLine1,
              property.addressLine2,
              property.addressTown,
              property.addressPostcode
            )}
          />

          {/* Property Header */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-bold text-text-primary">
                    {formatPrice(property.price, property.listingType)}
                  </div>
                  {hasReduction && (
                    <div className="bg-accent text-white px-3 py-1 rounded-lg text-sm font-medium">
                      Price Reduced
                    </div>
                  )}
                  {property.chainFree && (
                    <div className="bg-success text-white px-3 py-1 rounded-lg text-sm font-medium">
                      Chain Free
                    </div>
                  )}
                </div>

                {hasReduction && (
                  <div className="text-text-muted">
                    {formatPriceReduction(property.originalPrice!, property.price)}
                  </div>
                )}

                <div className="flex items-center gap-6 text-text-secondary">
                  {property.bedrooms && (
                    <div className="flex items-center gap-1">
                      <Bed className="w-4 h-4" />
                      <span>{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center gap-1">
                      <Bath className="w-4 h-4" />
                      <span>{property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {property.floorAreaSqft && (
                    <div className="flex items-center gap-1">
                      <Maximize className="w-4 h-4" />
                      <span>{property.floorAreaSqft.toLocaleString()} sq ft</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Home className="w-4 h-4" />
                    <span>{property.propertyType.replace('_', ' ').toLowerCase().replace(/^\w/, c => c.toUpperCase())}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => property && toggleSave(property.id)}
                  className={`p-3 rounded-full border transition-colors ${
                    property && isSaved(property.id)
                      ? 'bg-accent text-white border-accent'
                      : 'bg-surface text-text-muted border-border hover:text-accent hover:border-accent'
                  }`}
                >
                  <Heart className="w-5 h-5" fill={property && isSaved(property.id) ? 'currentColor' : 'none'} />
                </button>
                <button className="p-3 rounded-full border border-border bg-surface text-text-muted hover:text-accent hover:border-accent transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-center gap-2 text-text-secondary">
              <MapPin className="w-4 h-4" />
              <span>{formatAddress(property.addressLine1, property.addressLine2, property.addressTown, property.addressPostcode)}</span>
            </div>

            {/* Timeline info */}
            <div className="flex items-center gap-6 text-sm text-text-muted">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDaysOnMarket(property.listedDate)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>Viewed 24 times this week</span>
              </div>
            </div>
          </div>

          {/* Description */}
          {property.description && (
            <div className="card p-6">
              <h2 className="text-2xl font-bold text-text-primary mb-4">About this property</h2>
              <div className="prose prose-sm max-w-none text-text-secondary">
                {property.description.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Property Features */}
          <PropertyFeatures property={property} />


          {/* Location Map */}
          <div className="card p-6">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Location</h2>
            <div className="h-96">
              <PropertyMap
                properties={[property]}
                center={[property.latitude, property.longitude]}
                zoom={15}
                height="100%"
              />
            </div>
            <div className="mt-4 text-sm text-text-muted">
              <MapPin className="w-4 h-4 inline mr-1" />
              Approximate location for privacy
            </div>
          </div>
        </div>

        {/* Right Sidebar - Agent & Actions */}
        <div className="space-y-6">
          {/* Agent Card */}
          <div className="card p-6 sticky top-8">
            <div className="text-center mb-6">
              <div className="text-lg font-bold text-text-primary mb-2">
                Interested in this property?
              </div>
              <div className="text-text-secondary text-sm">
                Contact the agent for more information
              </div>
            </div>

            {/* Agent Info */}
            <div className="flex items-center gap-4 mb-6 p-4 bg-secondary rounded-lg">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <span className="text-accent font-bold text-lg">
                  {property.agent.name.charAt(0)}
                </span>
              </div>
              <div>
                <div className="font-semibold text-text-primary">{property.agent.name}</div>
                <div className="text-sm text-text-secondary">{property.agent.branchName}</div>
                <div className="flex items-center gap-1 text-xs text-text-muted">
                  <Star className="w-3 h-3 fill-current text-accent" />
                  <span>4.8 • 156 reviews</span>
                </div>
              </div>
            </div>

            {/* Contact Buttons */}
            <div className="space-y-3 mb-6">
              <button className="w-full btn-accent flex items-center justify-center gap-2">
                <Phone className="w-4 h-4" />
                Call {property.agent.phone}
              </button>
              <button className="w-full btn-secondary flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                Email Agent
              </button>
            </div>

            {/* Enquiry Form */}
            <div className="space-y-4">
              <div className="text-sm font-medium text-text-primary">Quick Enquiry</div>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Your name"
                  className="input-field text-sm"
                />
                <input
                  type="email"
                  placeholder="Your email"
                  className="input-field text-sm"
                />
                <input
                  type="tel"
                  placeholder="Your phone (optional)"
                  className="input-field text-sm"
                />
                <textarea
                  placeholder="I'm interested in this property. Please contact me to arrange a viewing."
                  rows={4}
                  className="input-field text-sm"
                />
                <div className="flex items-start gap-2">
                  <input type="checkbox" id="viewing" className="mt-1" />
                  <label htmlFor="viewing" className="text-sm text-text-secondary">
                    I would like to arrange a viewing
                  </label>
                </div>
              </div>
              <button className="w-full btn-primary">
                Send Enquiry
              </button>
            </div>

            <div className="mt-4 text-xs text-text-muted text-center">
              By submitting this form you agree to our privacy policy
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}