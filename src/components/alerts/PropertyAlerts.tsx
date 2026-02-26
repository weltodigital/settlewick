'use client'

import { useState, useEffect } from 'react'
import {
  Bell, Plus, Edit, Trash2, MapPin, DollarSign, Home,
  Bed, Bath, Calendar, TrendingUp, Mail, Smartphone,
  Settings, AlertCircle, CheckCircle, Clock, X,
  Filter, Search, ChevronDown, ChevronUp
} from 'lucide-react'

interface PropertyAlert {
  id: string
  name: string
  isActive: boolean
  criteria: {
    listingType: 'SALE' | 'RENT' | 'BOTH'
    priceMin?: number
    priceMax?: number
    bedrooms?: number[]
    bathrooms?: number[]
    propertyTypes?: string[]
    locations?: string[]
    keywords?: string[]
    chainFree?: boolean
    newBuild?: boolean
    garden?: boolean
    parking?: boolean
    epcRating?: string[]
  }
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
    frequency: 'INSTANT' | 'DAILY' | 'WEEKLY'
  }
  lastTriggered?: Date
  totalMatches: number
  recentMatches: {
    propertyId: string
    address: string
    price: number
    matchedAt: Date
    viewed: boolean
  }[]
  createdAt: Date
}

interface PropertyAlertsProps {
  userId?: string
}

export default function PropertyAlerts({ userId }: PropertyAlertsProps) {
  const [alerts, setAlerts] = useState<PropertyAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingAlert, setEditingAlert] = useState<PropertyAlert | null>(null)
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null)

  // Generate mock alerts data
  const generateMockAlerts = (): PropertyAlert[] => {
    return [
      {
        id: '1',
        name: '3-bed houses in Southsea under £350k',
        isActive: true,
        criteria: {
          listingType: 'SALE',
          priceMax: 350000,
          bedrooms: [3],
          locations: ['Southsea'],
          propertyTypes: ['TERRACED', 'SEMI_DETACHED'],
          chainFree: true
        },
        notifications: {
          email: true,
          sms: false,
          push: true,
          frequency: 'INSTANT'
        },
        lastTriggered: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        totalMatches: 12,
        recentMatches: [
          {
            propertyId: '123',
            address: '45 Highland Road, Southsea',
            price: 335000,
            matchedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            viewed: true
          },
          {
            propertyId: '124',
            address: '78 Albert Road, Southsea',
            price: 340000,
            matchedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            viewed: false
          }
        ],
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        name: 'Portsmouth rentals £1500-2000',
        isActive: true,
        criteria: {
          listingType: 'RENT',
          priceMin: 1500,
          priceMax: 2000,
          locations: ['Portsmouth', 'Southsea'],
          bedrooms: [2, 3],
          parking: true
        },
        notifications: {
          email: true,
          sms: true,
          push: true,
          frequency: 'DAILY'
        },
        lastTriggered: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        totalMatches: 28,
        recentMatches: [
          {
            propertyId: '125',
            address: '12 Kings Road, Portsmouth',
            price: 1850,
            matchedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
            viewed: false
          }
        ],
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)
      },
      {
        id: '3',
        name: 'New builds with garden',
        isActive: false,
        criteria: {
          listingType: 'SALE',
          priceMax: 500000,
          newBuild: true,
          garden: true,
          locations: ['Portsmouth', 'Southsea', 'Fareham']
        },
        notifications: {
          email: true,
          sms: false,
          push: false,
          frequency: 'WEEKLY'
        },
        totalMatches: 5,
        recentMatches: [],
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
      }
    ]
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setAlerts(generateMockAlerts())
      setLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [userId])

  const handleToggleAlert = (alertId: string) => {
    setAlerts(alerts.map(alert =>
      alert.id === alertId
        ? { ...alert, isActive: !alert.isActive }
        : alert
    ))
  }

  const handleDeleteAlert = (alertId: string) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId))
  }

  const formatCriteria = (criteria: PropertyAlert['criteria']) => {
    const parts = []

    if (criteria.priceMin || criteria.priceMax) {
      const min = criteria.priceMin ? `£${criteria.priceMin.toLocaleString()}` : 'No min'
      const max = criteria.priceMax ? `£${criteria.priceMax.toLocaleString()}` : 'No max'
      parts.push(`${min} - ${max}`)
    }

    if (criteria.bedrooms?.length) {
      parts.push(`${criteria.bedrooms.join(', ')} bed${criteria.bedrooms.length > 1 ? 's' : ''}`)
    }

    if (criteria.locations?.length) {
      parts.push(criteria.locations.slice(0, 2).join(', '))
      if (criteria.locations.length > 2) {
        parts[parts.length - 1] += ` +${criteria.locations.length - 2} more`
      }
    }

    return parts.join(' • ')
  }

  const getNotificationIcon = (alert: PropertyAlert) => {
    const activeNotifications = [
      alert.notifications.email && 'Email',
      alert.notifications.sms && 'SMS',
      alert.notifications.push && 'Push'
    ].filter(Boolean)

    return activeNotifications.join(', ') || 'None'
  }

  const formatLastTriggered = (date?: Date) => {
    if (!date) return 'Never'
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays === 0) {
      if (diffHours === 0) return 'Just now'
      return `${diffHours}h ago`
    }
    return `${diffDays}d ago`
  }

  if (loading) {
    return (
      <div className="bg-surface rounded-xl shadow-sm border border-border p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-secondary rounded w-1/3" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 bg-secondary rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Bell className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-primary">Property Alerts</h2>
              <p className="text-text-secondary">Get notified when properties match your criteria</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-accent flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Alert
          </button>
        </div>
      </div>

      {/* Alerts List */}
      <div className="divide-y divide-border">
        {alerts.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">No alerts set up yet</h3>
            <p className="text-text-secondary mb-4">
              Create your first property alert to get notified when new properties match your criteria.
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-accent"
            >
              Create Your First Alert
            </button>
          </div>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-text-primary">{alert.name}</h3>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      alert.isActive
                        ? 'bg-success text-white'
                        : 'bg-secondary text-text-muted'
                    }`}>
                      {alert.isActive ? 'Active' : 'Paused'}
                    </div>
                  </div>
                  <div className="text-sm text-text-secondary mb-2">
                    {formatCriteria(alert.criteria)}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-text-muted">
                    <div className="flex items-center gap-1">
                      <Bell className="w-3 h-3" />
                      <span>{getNotificationIcon(alert)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Last: {formatLastTriggered(alert.lastTriggered)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Search className="w-3 h-3" />
                      <span>{alert.totalMatches} matches</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleAlert(alert.id)}
                    className={`p-2 rounded-full transition-colors ${
                      alert.isActive
                        ? 'text-success hover:bg-success/10'
                        : 'text-text-muted hover:bg-secondary'
                    }`}
                    title={alert.isActive ? 'Pause alert' : 'Activate alert'}
                  >
                    <Bell className={`w-4 h-4 ${!alert.isActive ? 'opacity-50' : ''}`} />
                  </button>
                  <button
                    onClick={() => setEditingAlert(alert)}
                    className="p-2 rounded-full text-text-muted hover:text-accent hover:bg-accent/10 transition-colors"
                    title="Edit alert"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteAlert(alert.id)}
                    className="p-2 rounded-full text-text-muted hover:text-error hover:bg-error/10 transition-colors"
                    title="Delete alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setExpandedAlert(expandedAlert === alert.id ? null : alert.id)}
                    className="p-2 rounded-full text-text-muted hover:text-text-primary hover:bg-secondary transition-colors"
                  >
                    {expandedAlert === alert.id ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedAlert === alert.id && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Detailed Criteria */}
                    <div className="bg-background rounded-lg p-4 border border-border">
                      <h4 className="font-medium text-text-primary mb-3">Search Criteria</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-text-secondary">Listing Type:</span>
                          <span className="font-medium">{alert.criteria.listingType}</span>
                        </div>
                        {alert.criteria.priceMin && (
                          <div className="flex items-center justify-between">
                            <span className="text-text-secondary">Min Price:</span>
                            <span className="font-medium">£{alert.criteria.priceMin.toLocaleString()}</span>
                          </div>
                        )}
                        {alert.criteria.priceMax && (
                          <div className="flex items-center justify-between">
                            <span className="text-text-secondary">Max Price:</span>
                            <span className="font-medium">£{alert.criteria.priceMax.toLocaleString()}</span>
                          </div>
                        )}
                        {alert.criteria.bedrooms && (
                          <div className="flex items-center justify-between">
                            <span className="text-text-secondary">Bedrooms:</span>
                            <span className="font-medium">{alert.criteria.bedrooms.join(', ')}</span>
                          </div>
                        )}
                        {alert.criteria.locations && (
                          <div className="flex items-center justify-between">
                            <span className="text-text-secondary">Locations:</span>
                            <span className="font-medium">{alert.criteria.locations.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Recent Matches */}
                    <div className="bg-background rounded-lg p-4 border border-border">
                      <h4 className="font-medium text-text-primary mb-3">Recent Matches</h4>
                      {alert.recentMatches.length === 0 ? (
                        <div className="text-sm text-text-muted text-center py-4">
                          No recent matches
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {alert.recentMatches.map((match, index) => (
                            <div
                              key={index}
                              className={`p-3 rounded-lg border transition-colors ${
                                match.viewed
                                  ? 'bg-secondary border-border opacity-75'
                                  : 'bg-accent/5 border-accent/20'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <div className="font-medium text-text-primary text-sm">{match.address}</div>
                                {!match.viewed && (
                                  <div className="w-2 h-2 bg-accent rounded-full" />
                                )}
                              </div>
                              <div className="flex items-center justify-between text-xs text-text-muted">
                                <span>£{match.price.toLocaleString()}</span>
                                <span>{formatLastTriggered(match.matchedAt)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Notification Settings */}
                  <div className="mt-4 bg-background rounded-lg p-4 border border-border">
                    <h4 className="font-medium text-text-primary mb-3">Notification Settings</h4>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className={`w-4 h-4 ${alert.notifications.email ? 'text-accent' : 'text-text-muted'}`} />
                        <span className={alert.notifications.email ? 'text-text-primary' : 'text-text-muted'}>
                          Email
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Smartphone className={`w-4 h-4 ${alert.notifications.sms ? 'text-accent' : 'text-text-muted'}`} />
                        <span className={alert.notifications.sms ? 'text-text-primary' : 'text-text-muted'}>
                          SMS
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bell className={`w-4 h-4 ${alert.notifications.push ? 'text-accent' : 'text-text-muted'}`} />
                        <span className={alert.notifications.push ? 'text-text-primary' : 'text-text-muted'}>
                          Push
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-text-primary">{alert.notifications.frequency}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Form Modal */}
      {(showCreateForm || editingAlert) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-text-primary">
                  {editingAlert ? 'Edit Alert' : 'Create Property Alert'}
                </h3>
                <button
                  onClick={() => {
                    setShowCreateForm(false)
                    setEditingAlert(null)
                  }}
                  className="p-2 hover:bg-secondary rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Alert Name */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Alert Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., 3-bed houses in Southsea under £350k"
                  className="input-field"
                  defaultValue={editingAlert?.name}
                />
              </div>

              {/* Basic Criteria */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Listing Type
                  </label>
                  <select className="input-field">
                    <option value="BOTH">For Sale & To Rent</option>
                    <option value="SALE">For Sale Only</option>
                    <option value="RENT">To Rent Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Notification Frequency
                  </label>
                  <select className="input-field">
                    <option value="INSTANT">Instant</option>
                    <option value="DAILY">Daily Summary</option>
                    <option value="WEEKLY">Weekly Summary</option>
                  </select>
                </div>
              </div>

              {/* Price Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Min Price
                  </label>
                  <input
                    type="number"
                    placeholder="No minimum"
                    className="input-field"
                    min="0"
                    step="10000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Max Price
                  </label>
                  <input
                    type="number"
                    placeholder="No maximum"
                    className="input-field"
                    min="0"
                    step="10000"
                  />
                </div>
              </div>

              {/* Property Requirements */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-3">
                  Property Requirements
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Chain Free</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">New Build</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Garden</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Parking</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">En-Suite</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Balcony</span>
                  </label>
                </div>
              </div>

              {/* Notification Channels */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-3">
                  Notification Channels
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <Mail className="w-4 h-4 text-accent" />
                    <div>
                      <div className="text-sm font-medium">Email Notifications</div>
                      <div className="text-xs text-text-muted">Receive alerts via email</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <Smartphone className="w-4 h-4 text-primary" />
                    <div>
                      <div className="text-sm font-medium">SMS Notifications</div>
                      <div className="text-xs text-text-muted">Receive alerts via text message</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <Bell className="w-4 h-4 text-success" />
                    <div>
                      <div className="text-sm font-medium">Push Notifications</div>
                      <div className="text-xs text-text-muted">Browser notifications when online</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowCreateForm(false)
                    setEditingAlert(null)
                  }}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button className="flex-1 btn-accent">
                  {editingAlert ? 'Update Alert' : 'Create Alert'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Tips */}
      {alerts.length > 0 && (
        <div className="p-6 border-t border-border bg-accent/5">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-accent mt-0.5" />
            <div>
              <div className="font-medium text-accent mb-1">Maximize Your Alerts</div>
              <div className="text-sm text-text-secondary">
                Set multiple alerts with different criteria to catch all opportunities.
                Use broader criteria for more matches or narrow them down for specific requirements.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}