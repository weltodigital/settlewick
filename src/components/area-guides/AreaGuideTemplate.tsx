'use client'

import { useState, useEffect } from 'react'
import { MapPin, Home, TrendingUp, School, Train, Users, ChevronRight, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import Script from 'next/script'

interface Location {
  id: string
  name: string
  slug: string
  location_type: string
  description?: string
  latitude?: number
  longitude?: number
  population?: number
  property_count_sale?: number
  property_count_rent?: number
  average_price?: number
  average_rent?: number
  parent?: {
    name: string
    slug: string
  }
  children?: Array<{
    name: string
    slug: string
    location_type: string
  }>
}

interface SoldPrice {
  address: string
  price: number
  date_sold: string
  property_type: string
}

interface Property {
  id: string
  slug: string
  price: number
  bedrooms: number
  bathrooms: number
  property_type: string
  address_line_1: string
  listing_type: string
  primary_image_url?: string
}

interface AreaGuideTemplateProps {
  location: Location
}

export default function AreaGuideTemplate({ location }: AreaGuideTemplateProps) {
  const [soldPrices, setSoldPrices] = useState<SoldPrice[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [averagesByType, setAveragesByType] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)

      // Fetch recent sold prices
      const { data: soldData } = await supabase
        .from('sold_prices')
        .select('address, price, date_sold, property_type')
        .ilike('address', `%${location.name}%`)
        .order('date_sold', { ascending: false })
        .limit(10)

      if (soldData) {
        setSoldPrices(soldData)

        // Calculate averages by property type
        const typeAverages: Record<string, { total: number, count: number }> = {}
        soldData.forEach(sale => {
          if (!typeAverages[sale.property_type]) {
            typeAverages[sale.property_type] = { total: 0, count: 0 }
          }
          typeAverages[sale.property_type].total += sale.price
          typeAverages[sale.property_type].count += 1
        })

        const averages: Record<string, number> = {}
        Object.keys(typeAverages).forEach(type => {
          averages[type] = Math.round(typeAverages[type].total / typeAverages[type].count)
        })
        setAveragesByType(averages)
      }

      // Fetch current properties
      const { data: propertiesData } = await supabase
        .from('properties')
        .select(`
          id, slug, price, bedrooms, bathrooms, property_type,
          address_line_1, listing_type,
          primary_image:property_images!inner(image_url)
        `)
        .ilike('address_town', location.name)
        .eq('status', 'available')
        .limit(6)

      if (propertiesData) {
        setProperties(propertiesData.map(p => ({
          ...p,
          primary_image_url: p.primary_image?.[0]?.image_url
        })))
      }

      setIsLoading(false)
    }

    fetchData()
  }, [location])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount / 100) // Convert from pence
  }

  const formatPropertyType = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  // Generate JSON-LD for Place schema
  const placeSchema = {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": location.name,
    "description": location.description || `${location.name} is a ${location.location_type} ${location.parent ? `in ${location.parent.name}` : 'in the UK'} with diverse property options and excellent amenities.`,
    ...(location.latitude && location.longitude && {
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": location.latitude,
        "longitude": location.longitude
      }
    }),
    ...(location.parent && {
      "containedInPlace": {
        "@type": "Place",
        "name": location.parent.name
      }
    })
  }

  return (
    <>
      <Script
        id="place-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(placeSchema, null, 2)
        }}
      />

      <div className="space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            Living in {location.name}
            {location.parent && (
              <span className="text-text-secondary">, {location.parent.name}</span>
            )}
          </h1>

          {/* Breadcrumb */}
          <nav className="flex items-center justify-center space-x-2 text-sm text-text-muted mb-6">
            <Link href="/" className="hover:text-text-primary">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/area-guides" className="hover:text-text-primary">Area Guides</Link>
            {location.parent && (
              <>
                <ChevronRight className="w-4 h-4" />
                <Link href={`/area-guide/${location.parent.slug}`} className="hover:text-text-primary">
                  {location.parent.name}
                </Link>
              </>
            )}
            <ChevronRight className="w-4 h-4" />
            <span className="text-text-primary">{location.name}</span>
          </nav>

          {/* Hero Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {location.average_price ? formatCurrency(location.average_price) : 'N/A'}
              </div>
              <div className="text-sm text-text-secondary">Average Price</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {location.average_rent ? formatCurrency(location.average_rent) : 'N/A'}
              </div>
              <div className="text-sm text-text-secondary">Average Rent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {location.property_count_sale || 0}
              </div>
              <div className="text-sm text-text-secondary">For Sale</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {location.property_count_rent || 0}
              </div>
              <div className="text-sm text-text-secondary">To Rent</div>
            </div>
          </div>
        </div>

        {/* Overview Section */}
        <div className="card p-8">
          <h2 className="text-2xl font-semibold text-text-primary mb-6 flex items-center gap-3">
            <MapPin className="w-6 h-6 text-accent" />
            Overview
          </h2>
          <div className="prose prose-slate max-w-none">
            <p className="text-text-secondary leading-relaxed">
              {location.description || (
                <>
                  {location.name} is a {location.location_type} {location.parent ? `in ${location.parent.name}` : 'in the UK'}
                  {location.average_price && ` with an average property price of ${formatCurrency(location.average_price)}`}
                  {location.population && ` and a population of ${location.population.toLocaleString()}`}.
                  {location.location_type === 'city' || location.location_type === 'town'
                    ? ' The area offers diverse housing options and excellent quality of life for residents.'
                    : ' This location provides various property types and good access to local amenities.'
                  }
                </>
              )}
            </p>
          </div>
        </div>

        {/* Property Prices Section */}
        <div className="card p-8">
          <h2 className="text-2xl font-semibold text-text-primary mb-6 flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-accent" />
            Property Prices
          </h2>

          {/* Average Prices by Type */}
          {Object.keys(averagesByType).length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-medium text-text-primary mb-4">Average Prices by Property Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(averagesByType).map(([type, price]) => (
                  <div key={type} className="bg-surface p-4 rounded-lg border border-border">
                    <div className="font-medium text-text-primary">{formatPropertyType(type)}</div>
                    <div className="text-2xl font-bold text-accent">{formatCurrency(price)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Sold Prices */}
          {soldPrices.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-text-primary">Recent Sold Prices</h3>
                <Link
                  href={`/sold-prices/${location.slug}`}
                  className="text-accent hover:text-accent-dark font-medium text-sm flex items-center gap-1"
                >
                  View all <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 text-sm font-medium text-text-secondary">Address</th>
                      <th className="text-left py-3 text-sm font-medium text-text-secondary">Price</th>
                      <th className="text-left py-3 text-sm font-medium text-text-secondary">Type</th>
                      <th className="text-left py-3 text-sm font-medium text-text-secondary">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {soldPrices.slice(0, 5).map((sale, index) => (
                      <tr key={index} className="border-b border-border/50">
                        <td className="py-3 text-sm text-text-primary">{sale.address}</td>
                        <td className="py-3 text-sm font-medium text-text-primary">{formatCurrency(sale.price)}</td>
                        <td className="py-3 text-sm text-text-secondary">{formatPropertyType(sale.property_type)}</td>
                        <td className="py-3 text-sm text-text-secondary">{new Date(sale.date_sold).toLocaleDateString('en-GB')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Schools Section */}
        <div className="card p-8">
          <h2 className="text-2xl font-semibold text-text-primary mb-6 flex items-center gap-3">
            <School className="w-6 h-6 text-accent" />
            Schools
          </h2>
          <div className="text-text-secondary">
            <p className="mb-4">School information for {location.name} is being updated. Please check local authority websites for the most current school catchment areas and Ofsted ratings.</p>
            <div className="bg-surface p-4 rounded-lg border border-border">
              <div className="text-sm font-medium text-text-primary mb-2">Useful Resources:</div>
              <ul className="text-sm space-y-1">
                <li>• <a href="https://www.gov.uk/school-performance-tables" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Government School Performance Tables</a></li>
                <li>• <a href="https://www.ofsted.gov.uk/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Ofsted Reports</a></li>
                <li>• <a href="https://www.gov.uk/apply-for-primary-school-place" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Apply for School Places</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Transport Section */}
        <div className="card p-8">
          <h2 className="text-2xl font-semibold text-text-primary mb-6 flex items-center gap-3">
            <Train className="w-6 h-6 text-accent" />
            Transport
          </h2>
          <div className="text-text-secondary">
            <p className="mb-4">Transport information for {location.name} is being compiled. Check local transport authority websites for current timetables and routes.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-surface p-4 rounded-lg border border-border">
                <div className="font-medium text-text-primary mb-2">Rail Services</div>
                <p className="text-sm">Check National Rail Enquiries for nearest stations and services</p>
              </div>
              <div className="bg-surface p-4 rounded-lg border border-border">
                <div className="font-medium text-text-primary mb-2">Bus Services</div>
                <p className="text-sm">Local bus routes connect to nearby towns and city centres</p>
              </div>
            </div>
          </div>
        </div>

        {/* Properties Section */}
        <div className="card p-8">
          <h2 className="text-2xl font-semibold text-text-primary mb-6 flex items-center gap-3">
            <Home className="w-6 h-6 text-accent" />
            Properties
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-medium text-text-primary mb-3">
                Properties for Sale in {location.name}
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-2xl font-bold text-primary">{location.property_count_sale || 0}</span>
                <Link
                  href={`/for-sale/${location.slug}`}
                  className="btn-accent text-sm px-4 py-2"
                >
                  View Properties
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-text-primary mb-3">
                Properties to Rent in {location.name}
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-2xl font-bold text-primary">{location.property_count_rent || 0}</span>
                <Link
                  href={`/to-rent/${location.slug}`}
                  className="btn-accent text-sm px-4 py-2"
                >
                  View Rentals
                </Link>
              </div>
            </div>
          </div>

          {/* Featured Properties */}
          {properties.length > 0 && (
            <div>
              <h3 className="font-medium text-text-primary mb-4">Featured Properties</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {properties.slice(0, 6).map((property) => (
                  <Link
                    key={property.id}
                    href={`/property/${property.slug}`}
                    className="block bg-surface rounded-lg border border-border hover:shadow-lg transition-shadow overflow-hidden"
                  >
                    <div className="aspect-w-16 aspect-h-10 bg-gray-200">
                      {property.primary_image_url ? (
                        <img
                          src={property.primary_image_url}
                          alt={property.address_line_1}
                          className="w-full h-32 object-cover"
                        />
                      ) : (
                        <div className="w-full h-32 bg-surface border border-border flex items-center justify-center">
                          <Home className="w-8 h-8 text-text-muted" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="font-semibold text-text-primary mb-1">
                        {formatCurrency(property.price)}
                      </div>
                      <div className="text-sm text-text-secondary mb-2">
                        {property.bedrooms} bed {formatPropertyType(property.property_type)}
                      </div>
                      <div className="text-sm text-text-muted">
                        {property.address_line_1}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {((location.property_count_sale || 0) + (location.property_count_rent || 0)) === 0 && (
            <div className="text-center py-8">
              <Home className="w-12 h-12 text-text-muted mx-auto mb-4" />
              <h3 className="font-medium text-text-primary mb-2">No properties currently listed in {location.name}</h3>
              <p className="text-text-secondary mb-4">Be the first agent to list — it's free.</p>
              <Link
                href="/agent"
                className="btn-accent inline-flex items-center"
              >
                List Properties
              </Link>
            </div>
          )}
        </div>

        {/* Nearby Areas */}
        {location.children && location.children.length > 0 && (
          <div className="card p-8">
            <h2 className="text-2xl font-semibold text-text-primary mb-6 flex items-center gap-3">
              <Users className="w-6 h-6 text-accent" />
              Nearby Areas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {location.children.map((child) => (
                <Link
                  key={child.slug}
                  href={`/area-guide/${location.slug}/${child.slug}`}
                  className="block p-4 bg-surface border border-border rounded-lg hover:shadow-md transition-shadow"
                >
                  <h3 className="font-medium text-text-primary mb-1">{child.name}</h3>
                  <p className="text-sm text-text-secondary capitalize">{child.location_type}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}