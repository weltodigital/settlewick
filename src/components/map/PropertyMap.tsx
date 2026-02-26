'use client'

import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import { Icon, LatLngBounds, LatLng } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { PropertyWithDetails } from '@/types/property'
import { formatPrice, formatShortAddress } from '@/lib/format'
import Link from 'next/link'
import Image from 'next/image'

// Fix for default markers in react-leaflet
const createMarkerIcon = (price: number, isSelected = false) => {
  const color = isSelected ? '#B5985A' : '#1B3A2D' // accent or primary color
  const textColor = 'white'

  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="40" height="50" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 0C8.954 0 0 8.954 0 20c0 15 20 30 20 30s20-15 20-30C40 8.954 31.046 0 20 0z"
              fill="${color}" stroke="white" stroke-width="2"/>
        <circle cx="20" cy="20" r="8" fill="white"/>
        <text x="20" y="24" text-anchor="middle" font-family="Arial" font-size="10" font-weight="bold" fill="${color}">
          £${price < 1000000 ? Math.round(price/100000) + 'k' : Math.round(price/1000000) + 'm'}
        </text>
      </svg>
    `)}`,
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -50],
  })
}

interface PropertyMapProps {
  properties: PropertyWithDetails[]
  selectedProperty?: string | null
  onPropertySelect?: (propertyId: string | null) => void
  center?: [number, number]
  zoom?: number
  height?: string
  onBoundsChange?: (bounds: LatLngBounds) => void
  showDrawTools?: boolean
}

// Component to handle map events
function MapEventHandler({
  onBoundsChange,
  onPropertySelect
}: {
  onBoundsChange?: (bounds: LatLngBounds) => void
  onPropertySelect?: (propertyId: string | null) => void
}) {
  const map = useMapEvents({
    moveend: () => {
      if (onBoundsChange) {
        onBoundsChange(map.getBounds())
      }
    },
    click: () => {
      if (onPropertySelect) {
        onPropertySelect(null)
      }
    }
  })

  return null
}

// Component to fit bounds when properties change
function FitBounds({ properties }: { properties: PropertyWithDetails[] }) {
  const map = useMap()

  useEffect(() => {
    if (properties.length === 0) return

    const bounds = new LatLngBounds(
      properties.map(p => new LatLng(p.latitude, p.longitude))
    )

    // Add padding and fit bounds
    map.fitBounds(bounds, { padding: [50, 50] })
  }, [properties, map])

  return null
}

export default function PropertyMap({
  properties,
  selectedProperty,
  onPropertySelect,
  center = [50.8058, -1.0872], // Default to Portsmouth
  zoom = 12,
  height = '500px',
  onBoundsChange,
  showDrawTools = false
}: PropertyMapProps) {
  const [isClient, setIsClient] = useState(false)

  // Ensure we only render on client to avoid SSR issues
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div
        className="bg-secondary rounded-xl flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-text-muted">Loading map...</div>
      </div>
    )
  }

  return (
    <div className="relative rounded-xl overflow-hidden border border-border">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height, width: '100%' }}
        className="z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Event handlers */}
        <MapEventHandler
          onBoundsChange={onBoundsChange}
          onPropertySelect={onPropertySelect}
        />

        {/* Auto-fit bounds when properties change */}
        {properties.length > 0 && (
          <FitBounds properties={properties} />
        )}

        {/* Property markers */}
        {properties.map((property) => {
          const isSelected = selectedProperty === property.id
          const primaryImage = property.images?.find?.(img => img.isPrimary) || property.images?.[0]

          return (
            <Marker
              key={property.id}
              position={[property.latitude, property.longitude]}
              icon={createMarkerIcon(property.price, isSelected)}
              eventHandlers={{
                click: () => {
                  onPropertySelect?.(property.id)
                }
              }}
            >
              <Popup className="property-popup" maxWidth={300}>
                <div className="p-2">
                  <Link
                    href={`/property/${property.slug}`}
                    className="block hover:opacity-80 transition-opacity"
                  >
                    {/* Image */}
                    {primaryImage ? (
                      <div className="relative aspect-[4/3] mb-3 overflow-hidden rounded-lg">
                        <Image
                          src={primaryImage.imageUrl}
                          alt={property.summary || 'Property image'}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[4/3] mb-3 bg-secondary rounded-lg flex items-center justify-center">
                        <span className="text-text-muted text-sm">No image</span>
                      </div>
                    )}

                    {/* Price */}
                    <div className="font-bold text-lg text-text-primary mb-1">
                      {formatPrice(property.price, property.listingType)}
                    </div>

                    {/* Property details */}
                    <div className="text-sm text-text-secondary mb-1">
                      {property.bedrooms && `${property.bedrooms} bed`}
                      {property.bedrooms && property.bathrooms && ', '}
                      {property.bathrooms && `${property.bathrooms} bath`}
                    </div>

                    {/* Address */}
                    <div className="text-sm text-text-secondary mb-2">
                      {formatShortAddress(
                        property.addressLine1,
                        property.addressTown,
                        property.addressPostcode
                      )}
                    </div>

                    {/* Agent */}
                    {property.agent?.name && (
                      <div className="text-xs text-text-muted">
                        {property.agent.name}
                      </div>
                    )}
                  </Link>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      {/* Map Controls Overlay */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        {showDrawTools && (
          <button className="bg-surface shadow-md border border-border rounded-lg p-3 hover:bg-secondary transition-colors">
            <svg className="w-5 h-5 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        )}
      </div>

      {/* Property count overlay */}
      {properties.length > 0 && (
        <div className="absolute bottom-4 left-4 z-20 bg-surface shadow-md border border-border rounded-lg px-3 py-2">
          <div className="text-sm text-text-primary font-medium">
            {properties.length} {properties.length === 1 ? 'property' : 'properties'}
          </div>
        </div>
      )}
    </div>
  )
}