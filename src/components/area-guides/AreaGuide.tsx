'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  MapPin, Star, TrendingUp, Car, Train, Coffee, ShoppingBag,
  GraduationCap, Shield, Users, Home, Calendar, Info,
  School, Hospital, Trees, Utensils, Camera, Clock
} from 'lucide-react'

interface AreaData {
  name: string
  slug: string
  description: string
  image: string
  averagePrice: {
    sale: number
    rent: number
  }
  priceChange: {
    percentage: number
    period: string
    trend: 'up' | 'down' | 'stable'
  }
  demographics: {
    averageAge: number
    familyFriendly: number // 1-5 rating
    youngProfessionals: number
    retirees: number
  }
  lifestyle: {
    nightlife: number
    restaurants: number
    shopping: number
    greenSpaces: number
    culture: number
  }
  transport: {
    walkScore: number
    trainStations: Array<{ name: string; distance: number; lines: string[] }>
    busRoutes: number
    parkingDifficulty: number // 1-5, 5 being most difficult
  }
  schools: {
    primary: Array<{ name: string; rating: string; distance: number }>
    secondary: Array<{ name: string; rating: string; distance: number }>
    overall: number // 1-5 rating
  }
  safety: {
    crimeRate: 'low' | 'medium' | 'high'
    nightSafety: number // 1-5 rating
    overall: number // 1-5 rating
  }
  amenities: {
    gyms: number
    supermarkets: number
    pubs: number
    cafes: number
    parks: number
    healthcare: number
  }
  highlights: string[]
  drawbacks: string[]
  bestFor: string[]
  recentDevelopments: string[]
  futureProjects: string[]
}

interface AreaGuideProps {
  areaSlug: string
}

export default function AreaGuide({ areaSlug }: AreaGuideProps) {
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data for Portsmouth areas
  const areasData: Record<string, AreaData> = {
    'southsea': {
      name: 'Southsea',
      slug: 'southsea',
      description: 'A vibrant coastal area known for its beach, pier, and thriving arts scene. Popular with young professionals and families seeking seaside living.',
      image: '/images/areas/southsea.jpg',
      averagePrice: {
        sale: 285000,
        rent: 1250
      },
      priceChange: {
        percentage: 3.2,
        period: '12 months',
        trend: 'up'
      },
      demographics: {
        averageAge: 34,
        familyFriendly: 4,
        youngProfessionals: 5,
        retirees: 3
      },
      lifestyle: {
        nightlife: 5,
        restaurants: 5,
        shopping: 4,
        greenSpaces: 4,
        culture: 5
      },
      transport: {
        walkScore: 85,
        trainStations: [
          { name: 'Portsmouth & Southsea', distance: 0.8, lines: ['London Waterloo', 'Brighton'] }
        ],
        busRoutes: 12,
        parkingDifficulty: 4
      },
      schools: {
        primary: [
          { name: 'Southsea Infant School', rating: 'Outstanding', distance: 0.3 },
          { name: 'St Judes Primary School', rating: 'Good', distance: 0.5 }
        ],
        secondary: [
          { name: 'Portsmouth High School', rating: 'Outstanding', distance: 0.7 },
          { name: 'Mayfield School', rating: 'Good', distance: 1.2 }
        ],
        overall: 4
      },
      safety: {
        crimeRate: 'medium',
        nightSafety: 3,
        overall: 4
      },
      amenities: {
        gyms: 8,
        supermarkets: 5,
        pubs: 25,
        cafes: 18,
        parks: 6,
        healthcare: 3
      },
      highlights: [
        'Beautiful seafront and beach',
        'Vibrant nightlife and restaurant scene',
        'Historic Portsmouth attractions nearby',
        'Strong arts and culture community',
        'Good transport links to London'
      ],
      drawbacks: [
        'Limited parking spaces',
        'Can be noisy during summer months',
        'Higher cost of living',
        'Traffic congestion in peak season'
      ],
      bestFor: [
        'Young professionals',
        'First-time buyers',
        'Those seeking vibrant nightlife',
        'Beach and water sports enthusiasts',
        'Art and culture lovers'
      ],
      recentDevelopments: [
        'New seafront apartments at Clarence Pier',
        'Renovation of South Parade Pier',
        'Improved cycling infrastructure along seafront'
      ],
      futureProjects: [
        'Southsea Coastal Scheme flood defenses',
        'Regeneration of Clarence Pier area',
        'New cultural quarter development'
      ]
    },
    'old-portsmouth': {
      name: 'Old Portsmouth',
      slug: 'old-portsmouth',
      description: 'Historic maritime quarter with cobbled streets, medieval walls, and stunning harbor views. Perfect for history enthusiasts and those seeking character properties.',
      image: '/images/areas/old-portsmouth.jpg',
      averagePrice: {
        sale: 320000,
        rent: 1400
      },
      priceChange: {
        percentage: 2.8,
        period: '12 months',
        trend: 'up'
      },
      demographics: {
        averageAge: 42,
        familyFriendly: 3,
        youngProfessionals: 3,
        retirees: 4
      },
      lifestyle: {
        nightlife: 3,
        restaurants: 4,
        shopping: 2,
        greenSpaces: 3,
        culture: 5
      },
      transport: {
        walkScore: 75,
        trainStations: [
          { name: 'Portsmouth Harbour', distance: 0.2, lines: ['London Waterloo', 'Cardiff'] }
        ],
        busRoutes: 6,
        parkingDifficulty: 5
      },
      schools: {
        primary: [
          { name: 'Cathedral RC Primary', rating: 'Good', distance: 0.4 }
        ],
        secondary: [
          { name: 'Portsmouth Grammar School', rating: 'Outstanding', distance: 0.6 }
        ],
        overall: 4
      },
      safety: {
        crimeRate: 'low',
        nightSafety: 4,
        overall: 5
      },
      amenities: {
        gyms: 2,
        supermarkets: 2,
        pubs: 8,
        cafes: 12,
        parks: 2,
        healthcare: 1
      },
      highlights: [
        'Historic maritime heritage',
        'Beautiful harbor views',
        'Unique period properties',
        'Walking distance to Historic Dockyard',
        'Quiet, residential atmosphere'
      ],
      drawbacks: [
        'Very limited parking',
        'Few modern amenities',
        'Limited shopping options',
        'Can feel isolated from main city'
      ],
      bestFor: [
        'History enthusiasts',
        'Those seeking unique properties',
        'Professionals working at Naval Base',
        'Investors in period properties',
        'Those preferring quieter lifestyle'
      ],
      recentDevelopments: [
        'Restoration of historic buildings on High Street',
        'New marina berths at Camber Dock',
        'Improved pedestrian access to waterfront'
      ],
      futureProjects: [
        'Heritage quarter enhancement project',
        'New visitor center at Point',
        'Flood defense improvements'
      ]
    },
    'fratton': {
      name: 'Fratton',
      slug: 'fratton',
      description: 'A diverse, up-and-coming area with excellent transport links and affordable housing. Home to Portsmouth FC and popular with families and first-time buyers.',
      image: '/images/areas/fratton.jpg',
      averagePrice: {
        sale: 245000,
        rent: 950
      },
      priceChange: {
        percentage: 4.1,
        period: '12 months',
        trend: 'up'
      },
      demographics: {
        averageAge: 36,
        familyFriendly: 5,
        youngProfessionals: 4,
        retirees: 3
      },
      lifestyle: {
        nightlife: 2,
        restaurants: 3,
        shopping: 4,
        greenSpaces: 3,
        culture: 2
      },
      transport: {
        walkScore: 80,
        trainStations: [
          { name: 'Fratton', distance: 0.3, lines: ['London Waterloo', 'Brighton', 'Southampton'] }
        ],
        busRoutes: 15,
        parkingDifficulty: 2
      },
      schools: {
        primary: [
          { name: 'Fratton CE Primary', rating: 'Good', distance: 0.2 },
          { name: 'Cottage Grove Primary', rating: 'Outstanding', distance: 0.4 },
          { name: 'St Pauls RC Primary', rating: 'Good', distance: 0.3 }
        ],
        secondary: [
          { name: 'Springfield Secondary', rating: 'Good', distance: 0.8 },
          { name: 'Charter Academy', rating: 'Good', distance: 1.1 }
        ],
        overall: 4
      },
      safety: {
        crimeRate: 'medium',
        nightSafety: 3,
        overall: 3
      },
      amenities: {
        gyms: 4,
        supermarkets: 8,
        pubs: 12,
        cafes: 6,
        parks: 4,
        healthcare: 2
      },
      highlights: [
        'Excellent transport connectivity',
        'Affordable housing options',
        'Diverse, multicultural community',
        'Growing food and café scene',
        'Close to Fratton Park stadium'
      ],
      drawbacks: [
        'Some areas still regenerating',
        'Limited nightlife options',
        'Can be noisy near railway',
        'Mixed architectural styles'
      ],
      bestFor: [
        'First-time buyers',
        'Families with children',
        'Commuters to London',
        'Those seeking value for money',
        'Portsmouth FC supporters'
      ],
      recentDevelopments: [
        'New housing development on former industrial sites',
        'Improved Fratton railway station facilities',
        'New community center and library'
      ],
      futureProjects: [
        'Fratton Park stadium redevelopment',
        'High Street regeneration scheme',
        'New cycle routes connecting to city center'
      ]
    }
  }

  const areaData = areasData[areaSlug]

  if (!areaData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Area not found</h2>
        <p className="text-text-secondary">
          Sorry, we don't have information for this area yet.
        </p>
      </div>
    )
  }

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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'lifestyle', label: 'Lifestyle', icon: Coffee },
    { id: 'transport', label: 'Transport', icon: Train },
    { id: 'schools', label: 'Schools', icon: GraduationCap },
    { id: 'market', label: 'Property Market', icon: TrendingUp }
  ]

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="relative h-64 rounded-xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40 z-10" />
        <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
          <Camera className="w-12 h-12 text-text-muted" />
        </div>
        <div className="absolute inset-0 z-20 flex items-end p-8">
          <div className="text-white">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5" />
              <span className="text-white/80">Portsmouth</span>
            </div>
            <h1 className="text-4xl font-bold mb-2">{areaData.name}</h1>
            <p className="text-white/90 text-lg max-w-2xl">
              {areaData.description}
            </p>
          </div>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card p-6 text-center">
          <div className="text-2xl font-bold text-accent mb-2">
            {formatPrice(areaData.averagePrice.sale)}
          </div>
          <div className="text-text-secondary text-sm">Average Sale Price</div>
          <div className={`flex items-center justify-center gap-1 mt-2 text-sm ${
            areaData.priceChange.trend === 'up' ? 'text-success' :
            areaData.priceChange.trend === 'down' ? 'text-error' : 'text-text-muted'
          }`}>
            <TrendingUp className="w-4 h-4" />
            <span>{areaData.priceChange.percentage > 0 ? '+' : ''}{areaData.priceChange.percentage}%</span>
          </div>
        </div>

        <div className="card p-6 text-center">
          <div className="text-2xl font-bold text-accent mb-2">
            {formatPrice(areaData.averagePrice.rent)}
          </div>
          <div className="text-text-secondary text-sm">Average Rent (pcm)</div>
        </div>

        <div className="card p-6 text-center">
          <div className="text-2xl font-bold text-accent mb-2">
            {areaData.transport.walkScore}/100
          </div>
          <div className="text-text-secondary text-sm">Walk Score</div>
        </div>

        <div className="card p-6 text-center">
          <div className="flex justify-center mb-2">
            {getRatingStars(areaData.safety.overall)}
          </div>
          <div className="text-text-secondary text-sm">Safety Rating</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-border mb-8">
        <div className="flex space-x-8 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-accent text-accent'
                    : 'border-transparent text-text-secondary hover:text-text-primary'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Demographics */}
            <div className="card p-6">
              <h3 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Demographics
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Average Age</span>
                  <span className="font-medium text-text-primary">{areaData.demographics.averageAge} years</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Family Friendly</span>
                  <div className="flex">
                    {getRatingStars(areaData.demographics.familyFriendly)}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Young Professionals</span>
                  <div className="flex">
                    {getRatingStars(areaData.demographics.youngProfessionals)}
                  </div>
                </div>
              </div>
            </div>

            {/* Best For */}
            <div className="card p-6">
              <h3 className="text-xl font-semibold text-text-primary mb-4">Best For</h3>
              <div className="space-y-2">
                {areaData.bestFor.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-success rounded-full" />
                    <span className="text-text-secondary">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div className="card p-6">
              <h3 className="text-xl font-semibold text-text-primary mb-4">Highlights</h3>
              <div className="space-y-2">
                {areaData.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                    <span className="text-text-secondary">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Considerations */}
            <div className="card p-6">
              <h3 className="text-xl font-semibold text-text-primary mb-4">Things to Consider</h3>
              <div className="space-y-2">
                {areaData.drawbacks.map((drawback, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-warning rounded-full mt-2 flex-shrink-0" />
                    <span className="text-text-secondary">{drawback}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lifestyle' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Lifestyle Ratings */}
            <div className="card p-6">
              <h3 className="text-xl font-semibold text-text-primary mb-6">Lifestyle Ratings</h3>
              <div className="space-y-4">
                {[
                  { label: 'Nightlife', value: areaData.lifestyle.nightlife, icon: '🍻' },
                  { label: 'Restaurants', value: areaData.lifestyle.restaurants, icon: '🍽️' },
                  { label: 'Shopping', value: areaData.lifestyle.shopping, icon: '🛍️' },
                  { label: 'Green Spaces', value: areaData.lifestyle.greenSpaces, icon: '🌳' },
                  { label: 'Culture', value: areaData.lifestyle.culture, icon: '🎭' }
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-text-secondary">{item.label}</span>
                    </div>
                    <div className="flex">
                      {getRatingStars(item.value)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities Count */}
            <div className="card p-6">
              <h3 className="text-xl font-semibold text-text-primary mb-6">Local Amenities</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Gyms', count: areaData.amenities.gyms, icon: '💪' },
                  { label: 'Supermarkets', count: areaData.amenities.supermarkets, icon: '🛒' },
                  { label: 'Pubs', count: areaData.amenities.pubs, icon: '🍺' },
                  { label: 'Cafés', count: areaData.amenities.cafes, icon: '☕' },
                  { label: 'Parks', count: areaData.amenities.parks, icon: '🌳' },
                  { label: 'Healthcare', count: areaData.amenities.healthcare, icon: '🏥' }
                ].map(item => (
                  <div key={item.label} className="text-center p-3 bg-secondary rounded-lg">
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <div className="text-xl font-bold text-accent">{item.count}</div>
                    <div className="text-sm text-text-secondary">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transport' && (
          <div className="space-y-8">
            {/* Transport Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card p-6 text-center">
                <div className="text-3xl font-bold text-accent mb-2">
                  {areaData.transport.walkScore}
                </div>
                <div className="text-text-secondary">Walk Score</div>
                <div className="text-xs text-text-muted mt-1">
                  {areaData.transport.walkScore >= 90 ? 'Walker\'s Paradise' :
                   areaData.transport.walkScore >= 70 ? 'Very Walkable' :
                   areaData.transport.walkScore >= 50 ? 'Somewhat Walkable' : 'Car-Dependent'}
                </div>
              </div>

              <div className="card p-6 text-center">
                <div className="text-3xl font-bold text-accent mb-2">
                  {areaData.transport.busRoutes}
                </div>
                <div className="text-text-secondary">Bus Routes</div>
              </div>

              <div className="card p-6 text-center">
                <div className="flex justify-center mb-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Car
                      key={i}
                      className={`w-4 h-4 ${i < areaData.transport.parkingDifficulty ? 'text-error' : 'text-text-muted'}`}
                    />
                  ))}
                </div>
                <div className="text-text-secondary text-sm">Parking Difficulty</div>
              </div>
            </div>

            {/* Train Stations */}
            <div className="card p-6">
              <h3 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Train className="w-5 h-5" />
                Railway Connections
              </h3>
              <div className="space-y-4">
                {areaData.transport.trainStations.map((station, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                    <div>
                      <div className="font-medium text-text-primary">{station.name}</div>
                      <div className="text-sm text-text-secondary">
                        {station.distance} miles away
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-text-muted">Lines to:</div>
                      <div className="text-sm font-medium text-text-primary">
                        {station.lines.join(', ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schools' && (
          <div className="space-y-8">
            {/* Schools Overview */}
            <div className="card p-6">
              <h3 className="text-xl font-semibold text-text-primary mb-6 flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Education Overview
              </h3>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  {getRatingStars(areaData.schools.overall)}
                </div>
                <div className="text-text-secondary">Overall School Quality</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Primary Schools */}
              <div className="card p-6">
                <h4 className="text-lg font-semibold text-text-primary mb-4">Primary Schools</h4>
                <div className="space-y-4">
                  {areaData.schools.primary.map((school, index) => (
                    <div key={index} className="p-4 bg-secondary rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium text-text-primary">{school.name}</div>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          school.rating === 'Outstanding' ? 'bg-success/10 text-success' :
                          school.rating === 'Good' ? 'bg-info/10 text-info' :
                          'bg-warning/10 text-warning'
                        }`}>
                          {school.rating}
                        </div>
                      </div>
                      <div className="text-sm text-text-secondary">
                        {school.distance} miles away
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Secondary Schools */}
              <div className="card p-6">
                <h4 className="text-lg font-semibold text-text-primary mb-4">Secondary Schools</h4>
                <div className="space-y-4">
                  {areaData.schools.secondary.map((school, index) => (
                    <div key={index} className="p-4 bg-secondary rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium text-text-primary">{school.name}</div>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          school.rating === 'Outstanding' ? 'bg-success/10 text-success' :
                          school.rating === 'Good' ? 'bg-info/10 text-info' :
                          'bg-warning/10 text-warning'
                        }`}>
                          {school.rating}
                        </div>
                      </div>
                      <div className="text-sm text-text-secondary">
                        {school.distance} miles away
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'market' && (
          <div className="space-y-8">
            {/* Market Trends */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="card p-6">
                <h3 className="text-xl font-semibold text-text-primary mb-6">Price Trends</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">Average Sale Price</span>
                    <span className="font-bold text-accent">{formatPrice(areaData.averagePrice.sale)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">Average Rent (pcm)</span>
                    <span className="font-bold text-accent">{formatPrice(areaData.averagePrice.rent)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">12-month change</span>
                    <span className={`font-bold ${
                      areaData.priceChange.trend === 'up' ? 'text-success' :
                      areaData.priceChange.trend === 'down' ? 'text-error' : 'text-text-muted'
                    }`}>
                      {areaData.priceChange.percentage > 0 ? '+' : ''}{areaData.priceChange.percentage}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h3 className="text-xl font-semibold text-text-primary mb-6">Future Outlook</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-text-primary mb-2">Recent Developments</h4>
                    <div className="space-y-1">
                      {areaData.recentDevelopments.map((dev, index) => (
                        <div key={index} className="text-sm text-text-secondary flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-success rounded-full mt-2 flex-shrink-0" />
                          {dev}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-text-primary mb-2">Future Projects</h4>
                    <div className="space-y-1">
                      {areaData.futureProjects.map((project, index) => (
                        <div key={index} className="text-sm text-text-secondary flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-info rounded-full mt-2 flex-shrink-0" />
                          {project}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Property Search CTA */}
            <div className="card p-8 text-center bg-gradient-to-r from-accent/10 to-primary/10">
              <h3 className="text-xl font-semibold text-text-primary mb-4">
                Interested in {areaData.name}?
              </h3>
              <p className="text-text-secondary mb-6">
                Explore available properties in this area
              </p>
              <div className="flex justify-center gap-4">
                <Link href={`/for-sale/${areaData.slug}`} className="btn-accent">
                  <Home className="w-4 h-4 mr-2" />
                  Properties for Sale
                </Link>
                <Link href={`/to-rent/${areaData.slug}`} className="btn-outline">
                  <Home className="w-4 h-4 mr-2" />
                  Properties to Rent
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}