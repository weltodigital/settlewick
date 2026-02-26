'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'

// Dynamically import the map to avoid SSR issues
const PropertyMap = dynamic(() => import('./PropertyMap'), {
  ssr: false,
  loading: () => (
    <div className="bg-secondary rounded-xl flex items-center justify-center" style={{ height: '400px' }}>
      <div className="text-text-muted">Loading map...</div>
    </div>
  )
})

export default function HomePageMap() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Sample Portsmouth properties for the homepage map
  const sampleProperties = [
    {
      id: 'sample-1',
      latitude: 50.7896,
      longitude: -1.0854,
      price: 32500000,
      slug: 'sample-property-1',
      images: []
    },
    {
      id: 'sample-2',
      latitude: 50.8058,
      longitude: -1.0872,
      price: 28500000,
      slug: 'sample-property-2',
      images: []
    },
    {
      id: 'sample-3',
      latitude: 50.8019,
      longitude: -1.0663,
      price: 41500000,
      slug: 'sample-property-3',
      images: []
    }
  ]

  if (!isClient) {
    return (
      <div className="bg-secondary rounded-xl flex items-center justify-center" style={{ height: '400px' }}>
        <div className="text-text-muted">Loading map...</div>
      </div>
    )
  }

  return (
    <div className="relative">
      <PropertyMap
        properties={sampleProperties as any}
        center={[50.8058, -1.0872]}
        zoom={13}
        height="400px"
      />

      {/* Overlay CTA */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-xl">
        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-surface/95 backdrop-blur-sm rounded-lg p-4 border border-border">
            <h3 className="font-semibold text-text-primary mb-2">
              Explore Properties on the Map
            </h3>
            <p className="text-sm text-text-secondary mb-3">
              View all properties with our interactive map, draw custom search areas, and filter by location.
            </p>
            <Link
              href="/for-sale/portsmouth"
              className="inline-flex items-center btn-accent text-sm px-4 py-2"
            >
              Start Searching →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}