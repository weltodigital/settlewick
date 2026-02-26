'use client'

import { useState, useEffect } from 'react'
import {
  Users, Home, TrendingUp, DollarSign, AlertTriangle,
  CheckCircle, BarChart3, PieChart, Settings, Database,
  Shield, Mail, Bell, Eye, Edit, Trash2, Plus,
  Search, Filter, Download, Upload, RefreshCw,
  Calendar, Clock, Star, MapPin, Activity,
  FileText, Image, Video, MessageSquare, Phone
} from 'lucide-react'

interface PlatformStats {
  users: {
    total: number
    activeThisMonth: number
    newThisWeek: number
    growth: number
  }
  properties: {
    total: number
    listed: number
    sold: number
    underOffer: number
    averageDaysOnMarket: number
  }
  agents: {
    total: number
    active: number
    premium: number
    revenue: number
  }
  performance: {
    pageViews: number
    uniqueVisitors: number
    conversionRate: number
    bounceRate: number
  }
}

interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical'
  uptime: number
  responseTime: number
  errorRate: number
  alerts: {
    id: string
    type: 'info' | 'warning' | 'error'
    message: string
    timestamp: Date
  }[]
}

interface RecentActivity {
  id: string
  type: 'user_signup' | 'property_added' | 'agent_signup' | 'property_sold' | 'enquiry_sent'
  description: string
  timestamp: Date
  metadata?: any
}

export default function AdminPanel() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'properties' | 'agents' | 'system' | 'content'>('dashboard')
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '3m' | '6m' | '1y'>('30d')

  // Generate mock admin data
  const generateAdminData = () => {
    const stats: PlatformStats = {
      users: {
        total: 12847,
        activeThisMonth: 3421,
        newThisWeek: 167,
        growth: 12.4
      },
      properties: {
        total: 1563,
        listed: 1142,
        sold: 234,
        underOffer: 187,
        averageDaysOnMarket: 34
      },
      agents: {
        total: 89,
        active: 67,
        premium: 23,
        revenue: 147500
      },
      performance: {
        pageViews: 284731,
        uniqueVisitors: 23156,
        conversionRate: 3.2,
        bounceRate: 32.1
      }
    }

    const health: SystemHealth = {
      status: 'healthy',
      uptime: 99.97,
      responseTime: 145,
      errorRate: 0.02,
      alerts: [
        {
          id: '1',
          type: 'info',
          message: 'Database backup completed successfully',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
          id: '2',
          type: 'warning',
          message: 'High API usage detected - monitoring',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
        }
      ]
    }

    const activity: RecentActivity[] = [
      {
        id: '1',
        type: 'property_added',
        description: 'New property listed: 45 Kings Road, Portsmouth',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        metadata: { agentId: 'agent_123', price: 285000 }
      },
      {
        id: '2',
        type: 'user_signup',
        description: 'New user registered: sarah.jones@email.com',
        timestamp: new Date(Date.now() - 45 * 60 * 1000)
      },
      {
        id: '3',
        type: 'property_sold',
        description: 'Property sold: 78 Albert Road, Southsea',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        metadata: { soldPrice: 340000, listedPrice: 350000 }
      },
      {
        id: '4',
        type: 'agent_signup',
        description: 'New agent registered: Hampton & Sons, Fareham',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000)
      },
      {
        id: '5',
        type: 'enquiry_sent',
        description: '24 new enquiries received today',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)
      }
    ]

    return { stats, health, activity }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      const data = generateAdminData()
      setStats(data.stats)
      setSystemHealth(data.health)
      setRecentActivity(data.activity)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [dateRange])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getStatusColor = (status: SystemHealth['status']) => {
    switch (status) {
      case 'healthy': return 'text-success'
      case 'warning': return 'text-warning'
      case 'critical': return 'text-error'
      default: return 'text-text-muted'
    }
  }

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'user_signup': return <Users className="w-4 h-4 text-primary" />
      case 'property_added': return <Home className="w-4 h-4 text-accent" />
      case 'agent_signup': return <Users className="w-4 h-4 text-success" />
      case 'property_sold': return <DollarSign className="w-4 h-4 text-success" />
      case 'enquiry_sent': return <Mail className="w-4 h-4 text-warning" />
      default: return <Activity className="w-4 h-4 text-text-muted" />
    }
  }

  const formatTimeAgo = (date: Date) => {
    const diffMs = Date.now() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMins / 60)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${Math.floor(diffHours / 24)}d ago`
  }

  if (loading || !stats || !systemHealth) {
    return (
      <div className="bg-background min-h-screen">
        <div className="max-w-8xl mx-auto px-6 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-secondary rounded w-1/3" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-32 bg-secondary rounded-xl" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-secondary rounded-xl" />
              <div className="h-96 bg-secondary rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-border">
        <div className="max-w-8xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Admin Panel</h1>
              <p className="text-text-secondary">Settlewick platform management</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex gap-1 bg-secondary rounded-lg p-1">
                {(['7d', '30d', '3m', '6m', '1y'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setDateRange(period)}
                    className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                      dateRange === period
                        ? 'bg-surface text-accent shadow-sm'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {period.toUpperCase()}
                  </button>
                ))}
              </div>

              <button className="btn-secondary flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>

              <button className="btn-primary flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-1 mt-6 overflow-x-auto">
            {([
              { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { key: 'users', label: 'Users', icon: Users },
              { key: 'properties', label: 'Properties', icon: Home },
              { key: 'agents', label: 'Agents', icon: Shield },
              { key: 'system', label: 'System', icon: Settings },
              { key: 'content', label: 'Content', icon: FileText }
            ] as const).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === key
                    ? 'bg-accent text-white'
                    : 'text-text-secondary hover:text-text-primary hover:bg-secondary'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-8xl mx-auto px-6 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* System Health Banner */}
            <div className={`p-4 rounded-lg border ${
              systemHealth.status === 'healthy' ? 'bg-success/5 border-success/20' :
              systemHealth.status === 'warning' ? 'bg-warning/5 border-warning/20' :
              'bg-error/5 border-error/20'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  systemHealth.status === 'healthy' ? 'bg-success/10' :
                  systemHealth.status === 'warning' ? 'bg-warning/10' :
                  'bg-error/10'
                }`}>
                  {systemHealth.status === 'healthy' ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : (
                    <AlertTriangle className={`w-5 h-5 ${getStatusColor(systemHealth.status)}`} />
                  )}
                </div>
                <div>
                  <div className={`font-semibold ${getStatusColor(systemHealth.status)}`}>
                    System Status: {systemHealth.status.charAt(0).toUpperCase() + systemHealth.status.slice(1)}
                  </div>
                  <div className="text-text-secondary text-sm">
                    Uptime: {systemHealth.uptime}% • Response time: {systemHealth.responseTime}ms • Error rate: {systemHealth.errorRate}%
                  </div>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <TrendingUp className="w-4 h-4 text-success" />
                </div>
                <div className="text-2xl font-bold text-text-primary mb-1">
                  {stats.users.total.toLocaleString()}
                </div>
                <div className="text-sm text-text-secondary">Total Users</div>
                <div className="text-xs text-success mt-1">+{stats.users.growth}% this month</div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Home className="w-5 h-5 text-accent" />
                  </div>
                  <TrendingUp className="w-4 h-4 text-success" />
                </div>
                <div className="text-2xl font-bold text-text-primary mb-1">
                  {stats.properties.total.toLocaleString()}
                </div>
                <div className="text-sm text-text-secondary">Total Properties</div>
                <div className="text-xs text-primary mt-1">{stats.properties.listed} currently listed</div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-success/10 rounded-lg">
                    <Shield className="w-5 h-5 text-success" />
                  </div>
                  <TrendingUp className="w-4 h-4 text-success" />
                </div>
                <div className="text-2xl font-bold text-text-primary mb-1">
                  {stats.agents.total}
                </div>
                <div className="text-sm text-text-secondary">Partner Agents</div>
                <div className="text-xs text-accent mt-1">{stats.agents.active} active</div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-warning/10 rounded-lg">
                    <DollarSign className="w-5 h-5 text-warning" />
                  </div>
                  <TrendingUp className="w-4 h-4 text-success" />
                </div>
                <div className="text-2xl font-bold text-text-primary mb-1">
                  {formatCurrency(stats.agents.revenue)}
                </div>
                <div className="text-sm text-text-secondary">Monthly Revenue</div>
                <div className="text-xs text-success mt-1">+18.2% vs last month</div>
              </div>
            </div>

            {/* Charts and Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* User Growth Chart */}
              <div className="bg-white rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">User Growth</h3>
                <div className="relative h-64 bg-background rounded-lg p-4">
                  <div className="flex items-end justify-between h-full">
                    {Array.from({ length: 30 }).map((_, index) => {
                      const height = 20 + Math.random() * 60
                      const isToday = index === 29
                      return (
                        <div
                          key={index}
                          className={`w-2 rounded-t transition-all hover:w-3 ${
                            isToday ? 'bg-accent' : 'bg-primary'
                          }`}
                          style={{ height: `${height}%` }}
                          title={`Day ${index + 1}: ${Math.floor(height * 10)} users`}
                        />
                      )
                    })}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 text-sm">
                  <span className="text-text-secondary">Last 30 days</span>
                  <span className="text-success font-medium">+{stats.users.growth}% growth</span>
                </div>
              </div>

              {/* Property Status Distribution */}
              <div className="bg-white rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Property Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-success rounded" />
                      <span className="text-text-secondary">Available</span>
                    </div>
                    <div className="font-medium">{stats.properties.listed}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-warning rounded" />
                      <span className="text-text-secondary">Under Offer</span>
                    </div>
                    <div className="font-medium">{stats.properties.underOffer}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-primary rounded" />
                      <span className="text-text-secondary">Sold</span>
                    </div>
                    <div className="font-medium">{stats.properties.sold}</div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">Avg. time on market</span>
                    <span className="font-medium">{stats.properties.averageDaysOnMarket} days</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold text-text-primary">Recent Activity</h3>
              </div>
              <div className="divide-y divide-border">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="p-6 flex items-center gap-4">
                    <div className="p-2 bg-secondary rounded-lg">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-text-primary">{activity.description}</div>
                      <div className="text-sm text-text-muted">{formatTimeAgo(activity.timestamp)}</div>
                    </div>
                    {activity.metadata && (
                      <div className="text-sm text-text-secondary">
                        {activity.metadata.price && formatCurrency(activity.metadata.price)}
                        {activity.metadata.soldPrice && (
                          <div className="text-xs">
                            Listed: {formatCurrency(activity.metadata.listedPrice)} →
                            Sold: {formatCurrency(activity.metadata.soldPrice)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-text-primary">User Management</h2>
                <div className="flex gap-2">
                  <button className="btn-secondary flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export Users
                  </button>
                  <button className="btn-primary flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add User
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-background rounded-lg p-4 border border-border">
                  <div className="text-2xl font-bold text-primary">{stats.users.total.toLocaleString()}</div>
                  <div className="text-sm text-text-secondary">Total Users</div>
                </div>
                <div className="bg-background rounded-lg p-4 border border-border">
                  <div className="text-2xl font-bold text-accent">{stats.users.activeThisMonth.toLocaleString()}</div>
                  <div className="text-sm text-text-secondary">Active This Month</div>
                </div>
                <div className="bg-background rounded-lg p-4 border border-border">
                  <div className="text-2xl font-bold text-success">{stats.users.newThisWeek}</div>
                  <div className="text-sm text-text-secondary">New This Week</div>
                </div>
                <div className="bg-background rounded-lg p-4 border border-border">
                  <div className="text-2xl font-bold text-warning">{stats.users.growth}%</div>
                  <div className="text-sm text-text-secondary">Growth Rate</div>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Search users by name, email, or ID..."
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                  />
                </div>
                <button className="btn-secondary flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>

              <div className="text-sm text-text-muted text-center py-8">
                User management interface would be implemented here with table, pagination, and user details.
              </div>
            </div>
          </div>
        )}

        {activeTab === 'agents' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-text-primary">Agent Management</h2>
                <div className="flex gap-2">
                  <button className="btn-secondary flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Send Newsletter
                  </button>
                  <button className="btn-primary flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Approve Agent
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-background rounded-lg p-4 border border-border">
                  <div className="text-2xl font-bold text-primary">{stats.agents.total}</div>
                  <div className="text-sm text-text-secondary">Total Agents</div>
                </div>
                <div className="bg-background rounded-lg p-4 border border-border">
                  <div className="text-2xl font-bold text-success">{stats.agents.active}</div>
                  <div className="text-sm text-text-secondary">Active Agents</div>
                </div>
                <div className="bg-background rounded-lg p-4 border border-border">
                  <div className="text-2xl font-bold text-accent">{stats.agents.premium}</div>
                  <div className="text-sm text-text-secondary">Premium Tier</div>
                </div>
                <div className="bg-background rounded-lg p-4 border border-border">
                  <div className="text-2xl font-bold text-warning">{formatCurrency(stats.agents.revenue)}</div>
                  <div className="text-sm text-text-secondary">Monthly Revenue</div>
                </div>
              </div>

              <div className="text-sm text-text-muted text-center py-8">
                Agent management interface would be implemented here with agent profiles, subscription management, and performance metrics.
              </div>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Health */}
              <div className="bg-white rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">System Health</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">Server Status</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-success rounded-full" />
                      <span className="text-success font-medium">Online</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">Database Status</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-success rounded-full" />
                      <span className="text-success font-medium">Connected</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">CDN Status</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-success rounded-full" />
                      <span className="text-success font-medium">Active</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">Email Service</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-warning rounded-full" />
                      <span className="text-warning font-medium">Degraded</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Alerts */}
              <div className="bg-white rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">System Alerts</h3>
                <div className="space-y-3">
                  {systemHealth.alerts.map((alert) => (
                    <div key={alert.id} className="flex items-start gap-3 p-3 bg-background rounded-lg border border-border">
                      {alert.type === 'error' ? (
                        <AlertTriangle className="w-4 h-4 text-error mt-0.5" />
                      ) : alert.type === 'warning' ? (
                        <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="text-sm text-text-primary">{alert.message}</div>
                        <div className="text-xs text-text-muted">{formatTimeAgo(alert.timestamp)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Performance Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {stats.performance.pageViews.toLocaleString()}
                  </div>
                  <div className="font-medium text-text-primary">Page Views</div>
                  <div className="text-sm text-text-muted">This month</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-2">
                    {stats.performance.uniqueVisitors.toLocaleString()}
                  </div>
                  <div className="font-medium text-text-primary">Unique Visitors</div>
                  <div className="text-sm text-text-muted">This month</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-success mb-2">
                    {stats.performance.conversionRate}%
                  </div>
                  <div className="font-medium text-text-primary">Conversion Rate</div>
                  <div className="text-sm text-text-muted">Enquiry rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-warning mb-2">
                    {stats.performance.bounceRate}%
                  </div>
                  <div className="font-medium text-text-primary">Bounce Rate</div>
                  <div className="text-sm text-text-muted">Single page visits</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-text-primary">Content Management</h2>
                <div className="flex gap-2">
                  <button className="btn-secondary flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Bulk Upload
                  </button>
                  <button className="btn-primary flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Create Content
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-background rounded-lg p-4 border border-border text-center">
                  <Image className="w-8 h-8 text-accent mx-auto mb-3" />
                  <div className="text-xl font-bold text-text-primary mb-1">2,847</div>
                  <div className="text-sm text-text-secondary">Property Images</div>
                  <button className="mt-2 text-accent text-sm hover:underline">Manage Images</button>
                </div>
                <div className="bg-background rounded-lg p-4 border border-border text-center">
                  <Video className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-xl font-bold text-text-primary mb-1">156</div>
                  <div className="text-sm text-text-secondary">Virtual Tours</div>
                  <button className="mt-2 text-primary text-sm hover:underline">Manage Tours</button>
                </div>
                <div className="bg-background rounded-lg p-4 border border-border text-center">
                  <FileText className="w-8 h-8 text-success mx-auto mb-3" />
                  <div className="text-xl font-bold text-text-primary mb-1">89</div>
                  <div className="text-sm text-text-secondary">Floor Plans</div>
                  <button className="mt-2 text-success text-sm hover:underline">Manage Plans</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}