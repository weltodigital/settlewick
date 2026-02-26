'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Heart, Bell, Search, Map, User, TrendingUp, Filter, Grid, List } from 'lucide-react'
import Link from 'next/link'
import { PropertyWithDetails } from '@/types/property'
import PropertyCard from '@/components/property/PropertyCard'
import { useSavedProperties } from '@/hooks/useSavedProperties'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const { savedProperties, toggleSave, isSaved, isLoading } = useSavedProperties()
  const [searches, setSearches] = useState([])
  const [alerts, setAlerts] = useState([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    if (status === 'authenticated') {
      fetchUserData()
    }
  }, [status])

  const fetchUserData = async () => {
    try {
      // Fetch saved searches
      const searchResponse = await fetch('/api/saved-searches')
      if (searchResponse.ok) {
        const searchData = await searchResponse.json()
        setSearches(searchData)
      }

      // Fetch alerts
      const alertResponse = await fetch('/api/alerts')
      if (alertResponse.ok) {
        const alertData = await alertResponse.json()
        setAlerts(alertData)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold text-text-primary mb-4">Access Denied</h1>
          <p className="text-text-secondary mb-6">Please sign in to access your dashboard.</p>
          <Link href="/auth/signin" className="btn-accent">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-8xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Welcome back, {session?.user?.name}
          </h1>
          <p className="text-text-secondary">
            Manage your saved properties, searches, and alerts
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">Saved Properties</p>
                <p className="text-2xl font-bold text-text-primary">{savedProperties.length}</p>
              </div>
              <div className="p-3 bg-accent/10 rounded-lg">
                <Heart className="w-6 h-6 text-accent" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">Saved Searches</p>
                <p className="text-2xl font-bold text-text-primary">{searches.length}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <Search className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">Active Alerts</p>
                <p className="text-2xl font-bold text-text-primary">{alerts.length}</p>
              </div>
              <div className="p-3 bg-warning/10 rounded-lg">
                <Bell className="w-6 h-6 text-warning" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">Market Updates</p>
                <p className="text-2xl font-bold text-text-primary">3</p>
              </div>
              <div className="p-3 bg-success/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/for-sale/portsmouth"
              className="flex items-center space-x-3 p-4 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
            >
              <Search className="w-5 h-5 text-primary" />
              <span className="text-text-primary">Search Properties</span>
            </Link>

            <Link
              href="/for-sale/portsmouth?view=map"
              className="flex items-center space-x-3 p-4 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
            >
              <Map className="w-5 h-5 text-primary" />
              <span className="text-text-primary">Map View</span>
            </Link>

            <Link
              href="/profile"
              className="flex items-center space-x-3 p-4 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
            >
              <User className="w-5 h-5 text-primary" />
              <span className="text-text-primary">Update Profile</span>
            </Link>
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="space-y-8">
          {/* Saved Properties Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-text-primary">Saved Properties</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-secondary text-text-secondary hover:bg-secondary/80'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-secondary text-text-secondary hover:bg-secondary/80'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {savedProperties.length === 0 ? (
              <div className="card p-8 text-center">
                <Heart className="w-12 h-12 text-text-muted mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-text-primary mb-2">No saved properties yet</h3>
                <p className="text-text-secondary mb-4">
                  Start saving properties you're interested in to keep track of them here.
                </p>
                <Link href="/for-sale/portsmouth" className="btn-accent">
                  Browse Properties
                </Link>
              </div>
            ) : (
              <div className={viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
              }>
                {savedProperties.map((savedProp) => (
                  <PropertyCard
                    key={savedProp.property.id}
                    property={savedProp.property}
                    viewMode={viewMode}
                    onToggleSave={toggleSave}
                    isSaved={true}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Saved Searches Section */}
          <div>
            <h2 className="text-2xl font-semibold text-text-primary mb-6">Saved Searches</h2>
            {searches.length === 0 ? (
              <div className="card p-8 text-center">
                <Search className="w-12 h-12 text-text-muted mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-text-primary mb-2">No saved searches</h3>
                <p className="text-text-secondary mb-4">
                  Save your property searches to quickly access them later and get alerts for new matches.
                </p>
                <Link href="/for-sale/portsmouth" className="btn-accent">
                  Create Search
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {searches.map((search: any) => (
                  <div key={search.id} className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-text-primary">{search.name}</h3>
                      <div className="flex items-center space-x-2">
                        {search.alertEnabled && (
                          <div className="w-2 h-2 bg-success rounded-full" title="Alerts enabled" />
                        )}
                        <button className="text-text-muted hover:text-text-secondary">
                          <Bell className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-text-secondary text-sm mb-4">
                      Created {new Date(search.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-muted">
                        {search.alertEnabled ? 'Alerts enabled' : 'View only'}
                      </span>
                      <Link href={search.searchUrl} className="btn-outline text-sm">
                        View Results
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Alerts Section */}
          <div>
            <h2 className="text-2xl font-semibold text-text-primary mb-6">Property Alerts</h2>
            {alerts.length === 0 ? (
              <div className="card p-8 text-center">
                <Bell className="w-12 h-12 text-text-muted mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-text-primary mb-2">No active alerts</h3>
                <p className="text-text-secondary mb-4">
                  Set up alerts to get notified when new properties match your criteria.
                </p>
                <Link href="/alerts/create" className="btn-accent">
                  Create Alert
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {alerts.map((alert: any) => (
                  <div key={alert.id} className="card p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-text-primary mb-1">{alert.name}</h3>
                        <p className="text-text-secondary text-sm">
                          {alert.frequency.toLowerCase()} alerts • Created {new Date(alert.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          alert.isActive
                            ? 'text-success bg-success/10'
                            : 'text-text-muted bg-secondary'
                        }`}>
                          {alert.isActive ? 'Active' : 'Paused'}
                        </span>
                        <button className="text-text-muted hover:text-text-secondary">
                          ⋮
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}