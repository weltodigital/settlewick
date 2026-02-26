'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Home, Users, TrendingUp, Calendar, Plus, Eye, Heart,
  Phone, Mail, MapPin, Edit, MoreVertical, FileText
} from 'lucide-react'

export default function AgentDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState({
    activeListings: 12,
    totalViews: 2847,
    enquiries: 24,
    viewingsBooked: 8
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [properties, setProperties] = useState([])

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role !== 'AGENT') {
      router.push('/agent')
    }
  }, [status, session, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold text-text-primary mb-4">Access Denied</h1>
          <p className="text-text-secondary mb-6">Please sign in with an agent account to access this dashboard.</p>
          <Link href="/auth/signin" className="btn-accent">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  if (session?.user?.role !== 'AGENT') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold text-text-primary mb-4">Agent Access Required</h1>
          <p className="text-text-secondary mb-6">This dashboard is only available to registered estate agents.</p>
          <Link href="/agent" className="btn-accent">
            Learn More About Agent Features
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-8xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Agent Dashboard
            </h1>
            <p className="text-text-secondary">
              Welcome back, {session.user?.name}
            </p>
          </div>
          <Link href="/agent/properties/new" className="btn-accent flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Property</span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">Active Listings</p>
                <p className="text-3xl font-bold text-text-primary">{stats.activeListings}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <Home className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">Total Views</p>
                <p className="text-3xl font-bold text-text-primary">{stats.totalViews.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-accent/10 rounded-lg">
                <Eye className="w-6 h-6 text-accent" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">New Enquiries</p>
                <p className="text-3xl font-bold text-text-primary">{stats.enquiries}</p>
              </div>
              <div className="p-3 bg-success/10 rounded-lg">
                <Users className="w-6 h-6 text-success" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">Viewings Booked</p>
                <p className="text-3xl font-bold text-text-primary">{stats.viewingsBooked}</p>
              </div>
              <div className="p-3 bg-warning/10 rounded-lg">
                <Calendar className="w-6 h-6 text-warning" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link
              href="/agent/properties/new"
              className="flex items-center space-x-3 p-4 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5 text-primary" />
              <span className="text-text-primary">Add New Property</span>
            </Link>

            <Link
              href="/agent/enquiries"
              className="flex items-center space-x-3 p-4 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
            >
              <Mail className="w-5 h-5 text-primary" />
              <span className="text-text-primary">View Enquiries</span>
            </Link>

            <Link
              href="/agent/viewings"
              className="flex items-center space-x-3 p-4 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
            >
              <Calendar className="w-5 h-5 text-primary" />
              <span className="text-text-primary">Manage Viewings</span>
            </Link>

            <Link
              href="/agent/analytics"
              className="flex items-center space-x-3 p-4 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
            >
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="text-text-primary">View Analytics</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Recent Properties */}
          <div className="xl:col-span-2">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-text-primary">Your Properties</h2>
                <Link href="/agent/properties" className="text-accent hover:text-accent-dark">
                  View All
                </Link>
              </div>

              {properties.length === 0 ? (
                <div className="text-center py-8">
                  <Home className="w-12 h-12 text-text-muted mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-text-primary mb-2">No properties listed yet</h3>
                  <p className="text-text-secondary mb-4">
                    Start by adding your first property listing.
                  </p>
                  <Link href="/agent/properties/new" className="btn-accent">
                    Add Property
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {properties.slice(0, 5).map((property: any) => (
                    <div key={property.id} className="flex items-center space-x-4 p-4 bg-surface rounded-lg">
                      <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center">
                        <Home className="w-6 h-6 text-text-muted" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-text-primary">{property.title}</h3>
                        <p className="text-text-secondary text-sm">{property.address}</p>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-text-muted">
                          <span>{property.views} views</span>
                          <span>{property.enquiries} enquiries</span>
                          <span>Listed {property.daysAgo} days ago</span>
                        </div>
                      </div>
                      <button className="text-text-muted hover:text-text-secondary">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-6">
            {/* Recent Enquiries */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">Recent Enquiries</h3>
                <Link href="/agent/enquiries" className="text-accent hover:text-accent-dark text-sm">
                  View All
                </Link>
              </div>

              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-3 p-3 bg-surface rounded-lg">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-text-primary font-medium text-sm">John Smith</p>
                      <p className="text-text-secondary text-xs">Interested in viewing</p>
                    </div>
                    <span className="text-xs text-text-muted">2h ago</span>
                  </div>
                ))}
              </div>
            </div>

            {/* This Week */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">This Week</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Property Views</span>
                  <span className="text-text-primary font-medium">+487</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">New Enquiries</span>
                  <span className="text-text-primary font-medium">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Viewings Completed</span>
                  <span className="text-text-primary font-medium">6</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Offers Made</span>
                  <span className="text-text-primary font-medium">3</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}