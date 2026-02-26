'use client'

import Link from 'next/link'
import { MapPin, TrendingUp, Star, Users, Train, Camera, ArrowRight } from 'lucide-react'

interface AreaOverview {
  name: string
  slug: string
  shortDescription: string
  image: string
  averagePrice: number
  priceChange: number
  rating: number
  walkScore: number
  highlights: string[]
}

export default function AreaGuidesOverview() {
  const areas: AreaOverview[] = [
    {
      name: 'Southsea',
      slug: 'southsea',
      shortDescription: 'Vibrant coastal area with excellent nightlife, restaurants, and cultural attractions.',
      image: '/images/areas/southsea.jpg',
      averagePrice: 285000,
      priceChange: 3.2,
      rating: 4,
      walkScore: 85,
      highlights: ['Seafront location', 'Vibrant nightlife', 'Arts & culture', 'Good transport']
    },
    {
      name: 'Old Portsmouth',
      slug: 'old-portsmouth',
      shortDescription: 'Historic maritime quarter with cobbled streets, period properties, and harbor views.',
      image: '/images/areas/old-portsmouth.jpg',
      averagePrice: 320000,
      priceChange: 2.8,
      rating: 5,
      walkScore: 75,
      highlights: ['Historic character', 'Harbor views', 'Period properties', 'Low crime']
    },
    {
      name: 'Fratton',
      slug: 'fratton',
      shortDescription: 'Up-and-coming diverse area with excellent transport links and affordable housing.',
      image: '/images/areas/fratton.jpg',
      averagePrice: 245000,
      priceChange: 4.1,
      rating: 3,
      walkScore: 80,
      highlights: ['Great value', 'Transport links', 'Diverse community', 'Growing food scene']
    },
    {
      name: 'Cosham',
      slug: 'cosham',
      shortDescription: 'Family-friendly suburb with good schools, green spaces, and local amenities.',
      image: '/images/areas/cosham.jpg',
      averagePrice: 295000,
      priceChange: 2.5,
      rating: 4,
      walkScore: 70,
      highlights: ['Family friendly', 'Good schools', 'Green spaces', 'Local shopping']
    },
    {
      name: 'Gunwharf Quays',
      slug: 'gunwharf-quays',
      shortDescription: 'Modern waterfront development with luxury apartments, shopping, and dining.',
      image: '/images/areas/gunwharf.jpg',
      averagePrice: 380000,
      priceChange: 1.8,
      rating: 4,
      walkScore: 90,
      highlights: ['Luxury living', 'Waterfront views', 'Premium shopping', 'Modern amenities']
    },
    {
      name: 'Milton',
      slug: 'milton',
      shortDescription: 'Quiet residential area popular with families, close to excellent schools.',
      image: '/images/areas/milton.jpg',
      averagePrice: 275000,
      priceChange: 2.9,
      rating: 4,
      walkScore: 65,
      highlights: ['Quiet residential', 'Excellent schools', 'Family focused', 'Good value']
    }
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-warning fill-current' : 'text-text-muted'}`}
      />
    ))
  }

  return (
    <div className="max-w-8xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="p-3 bg-accent/10 rounded-lg">
            <MapPin className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-4xl font-bold text-text-primary">Portsmouth Area Guides</h1>
        </div>
        <p className="text-xl text-text-secondary max-w-3xl mx-auto">
          Discover the best neighborhoods in Portsmouth with detailed insights on lifestyle,
          transport, schools, and property market trends.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <div className="card p-6 text-center">
          <div className="text-2xl font-bold text-accent mb-2">6</div>
          <div className="text-text-secondary text-sm">Areas Covered</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-2xl font-bold text-accent mb-2">
            {formatPrice(Math.round(areas.reduce((sum, area) => sum + area.averagePrice, 0) / areas.length))}
          </div>
          <div className="text-text-secondary text-sm">Average Price</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-2xl font-bold text-accent mb-2">
            +{((areas.reduce((sum, area) => sum + area.priceChange, 0) / areas.length)).toFixed(1)}%
          </div>
          <div className="text-text-secondary text-sm">Average Growth</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-2xl font-bold text-accent mb-2">
            {Math.round(areas.reduce((sum, area) => sum + area.walkScore, 0) / areas.length)}
          </div>
          <div className="text-text-secondary text-sm">Average Walk Score</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-8">
        <div className="card p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search areas by name, features, or characteristics..."
                className="input-field w-full"
              />
            </div>
            <div className="flex gap-4">
              <select className="input-field">
                <option value="">Price Range</option>
                <option value="under-250k">Under £250k</option>
                <option value="250k-300k">£250k - £300k</option>
                <option value="300k-350k">£300k - £350k</option>
                <option value="over-350k">Over £350k</option>
              </select>
              <select className="input-field">
                <option value="">Best For</option>
                <option value="families">Families</option>
                <option value="professionals">Young Professionals</option>
                <option value="retirees">Retirees</option>
                <option value="investors">Investors</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Area Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {areas.map((area) => (
          <Link key={area.slug} href={`/area-guides/${area.slug}`}>
            <div className="card overflow-hidden hover:shadow-lg transition-shadow group">
              {/* Image */}
              <div className="relative h-48 bg-gray-300 flex items-center justify-center overflow-hidden">
                <Camera className="w-8 h-8 text-text-muted" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-text-primary group-hover:text-accent transition-colors">
                      {area.name}
                    </h3>
                    <div className="flex items-center mt-1">
                      {getRatingStars(area.rating)}
                      <span className="ml-2 text-sm text-text-muted">
                        ({area.rating}/5)
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-text-muted group-hover:text-accent group-hover:translate-x-1 transition-all" />
                </div>

                {/* Description */}
                <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                  {area.shortDescription}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-lg font-bold text-accent">
                      {formatPrice(area.averagePrice)}
                    </div>
                    <div className="text-xs text-text-muted">Average Price</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-success" />
                      <span className="text-lg font-bold text-success">
                        +{area.priceChange}%
                      </span>
                    </div>
                    <div className="text-xs text-text-muted">12 Month Change</div>
                  </div>
                </div>

                {/* Walk Score */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-text-secondary">Walk Score</span>
                  <div className="flex items-center gap-2">
                    <div className="w-12 bg-secondary rounded-full h-2">
                      <div
                        className="bg-accent h-2 rounded-full"
                        style={{ width: `${area.walkScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-text-primary">
                      {area.walkScore}
                    </span>
                  </div>
                </div>

                {/* Highlights */}
                <div className="flex flex-wrap gap-1">
                  {area.highlights.slice(0, 3).map((highlight, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full"
                    >
                      {highlight}
                    </span>
                  ))}
                  {area.highlights.length > 3 && (
                    <span className="px-2 py-1 bg-secondary text-text-muted text-xs rounded-full">
                      +{area.highlights.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="card p-8 text-center bg-gradient-to-r from-primary/10 to-accent/10">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Can't Find What You're Looking For?
        </h2>
        <p className="text-text-secondary mb-6">
          Get in touch with our local experts for personalized area recommendations
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/contact" className="btn-accent">
            Contact Local Expert
          </Link>
          <Link href="/valuation" className="btn-outline">
            Get Property Valuation
          </Link>
        </div>
      </div>

      {/* Area Comparison Tool */}
      <div className="mt-12 card p-6">
        <h3 className="text-xl font-semibold text-text-primary mb-4">Compare Areas</h3>
        <p className="text-text-secondary mb-6">
          Compare different Portsmouth areas side by side to make the best decision
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <select className="input-field">
            <option value="">Select first area</option>
            {areas.map(area => (
              <option key={area.slug} value={area.slug}>{area.name}</option>
            ))}
          </select>
          <select className="input-field">
            <option value="">Select second area</option>
            {areas.map(area => (
              <option key={area.slug} value={area.slug}>{area.name}</option>
            ))}
          </select>
          <button className="btn-accent">
            Compare Areas
          </button>
        </div>
      </div>
    </div>
  )
}