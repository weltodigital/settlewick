'use client'

import { useState, useEffect } from 'react'
import {
  TrendingUp, TrendingDown, Eye, Heart, Phone, Mail,
  Calendar, DollarSign, Users, Clock, BarChart3, PieChart,
  ArrowUp, ArrowDown, Filter, Download, RefreshCw, Target
} from 'lucide-react'

interface PropertyPerformance {
  id: string
  address: string
  price: number
  listingType: 'SALE' | 'RENT'
  views: number
  saves: number
  enquiries: number
  viewings: number
  daysOnMarket: number
  priceChanges: number
  status: 'AVAILABLE' | 'UNDER_OFFER' | 'SOLD' | 'WITHDRAWN'
  conversionRate: number
  trendDirection: 'up' | 'down' | 'stable'
}

interface LeadMetrics {
  total: number
  qualified: number
  converted: number
  pending: number
  conversionRate: number
  averageResponseTime: number
  sources: {
    name: string
    count: number
    percentage: number
  }[]
}

interface MarketMetrics {
  averagePrice: number
  averageDaysOnMarket: number
  totalListings: number
  soldThisMonth: number
  marketTrend: 'up' | 'down' | 'stable'
  priceChange: number
  demandIndex: number
  competitorAnalysis: {
    rank: number
    totalAgents: number
    marketShare: number
  }
}

interface TimeseriesData {
  date: string
  views: number
  enquiries: number
  viewings: number
  sales: number
}

export default function AgentAnalyticsDashboard() {
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '3m' | '6m' | '1y'>('30d')
  const [selectedView, setSelectedView] = useState<'overview' | 'properties' | 'leads' | 'market'>('overview')
  const [propertyPerformance, setPropertyPerformance] = useState<PropertyPerformance[]>([])
  const [leadMetrics, setLeadMetrics] = useState<LeadMetrics | null>(null)
  const [marketMetrics, setMarketMetrics] = useState<MarketMetrics | null>(null)
  const [timeseriesData, setTimeseriesData] = useState<TimeseriesData[]>([])

  // Generate mock analytics data
  const generateAnalyticsData = () => {
    // Property performance data
    const properties: PropertyPerformance[] = [
      {
        id: '1',
        address: '142 Albert Road, Southsea',
        price: 325000,
        listingType: 'SALE',
        views: 1234,
        saves: 89,
        enquiries: 23,
        viewings: 12,
        daysOnMarket: 28,
        priceChanges: 1,
        status: 'AVAILABLE',
        conversionRate: 7.2,
        trendDirection: 'up'
      },
      {
        id: '2',
        address: '67 Elm Grove, Southsea',
        price: 1800,
        listingType: 'RENT',
        views: 892,
        saves: 45,
        enquiries: 18,
        viewings: 8,
        daysOnMarket: 14,
        priceChanges: 0,
        status: 'UNDER_OFFER',
        conversionRate: 8.9,
        trendDirection: 'up'
      },
      {
        id: '3',
        address: '23 Victoria Road, Portsmouth',
        price: 285000,
        listingType: 'SALE',
        views: 567,
        saves: 32,
        enquiries: 8,
        viewings: 4,
        daysOnMarket: 45,
        priceChanges: 2,
        status: 'AVAILABLE',
        conversionRate: 1.4,
        trendDirection: 'down'
      },
      {
        id: '4',
        address: '156 Highland Road, Southsea',
        price: 2200,
        listingType: 'RENT',
        views: 1456,
        saves: 78,
        enquiries: 31,
        viewings: 16,
        daysOnMarket: 7,
        priceChanges: 0,
        status: 'SOLD',
        conversionRate: 12.1,
        trendDirection: 'up'
      }
    ]

    // Lead metrics
    const leads: LeadMetrics = {
      total: 127,
      qualified: 89,
      converted: 23,
      pending: 34,
      conversionRate: 18.1,
      averageResponseTime: 12, // minutes
      sources: [
        { name: 'Rightmove', count: 45, percentage: 35.4 },
        { name: 'Zoopla', count: 32, percentage: 25.2 },
        { name: 'Direct Website', count: 28, percentage: 22.0 },
        { name: 'Social Media', count: 15, percentage: 11.8 },
        { name: 'Referrals', count: 7, percentage: 5.5 }
      ]
    }

    // Market metrics
    const market: MarketMetrics = {
      averagePrice: 312000,
      averageDaysOnMarket: 34,
      totalListings: 156,
      soldThisMonth: 23,
      marketTrend: 'up',
      priceChange: 4.2,
      demandIndex: 78,
      competitorAnalysis: {
        rank: 3,
        totalAgents: 24,
        marketShare: 12.8
      }
    }

    // Time series data
    const timeseries: TimeseriesData[] = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      timeseries.push({
        date: date.toISOString().split('T')[0],
        views: Math.floor(Math.random() * 200) + 50,
        enquiries: Math.floor(Math.random() * 15) + 2,
        viewings: Math.floor(Math.random() * 8) + 1,
        sales: Math.random() < 0.1 ? 1 : 0
      })
    }

    return { properties, leads, market, timeseries }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      const data = generateAnalyticsData()
      setPropertyPerformance(data.properties)
      setLeadMetrics(data.leads)
      setMarketMetrics(data.market)
      setTimeseriesData(data.timeseries)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeRange])

  const formatPrice = (price: number, type: 'SALE' | 'RENT') => {
    if (type === 'RENT') {
      return `£${price.toLocaleString()} pcm`
    }
    return `£${price.toLocaleString()}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'text-primary'
      case 'UNDER_OFFER': return 'text-warning'
      case 'SOLD': return 'text-success'
      case 'WITHDRAWN': return 'text-error'
      default: return 'text-text-muted'
    }
  }

  const getTrendIcon = (direction: string, value?: number) => {
    if (direction === 'up') {
      return <TrendingUp className="w-4 h-4 text-success" />
    } else if (direction === 'down') {
      return <TrendingDown className="w-4 h-4 text-error" />
    }
    return <div className="w-4 h-4" />
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-secondary rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-secondary rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-secondary rounded-xl" />
            <div className="h-96 bg-secondary rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  const totalViews = propertyPerformance.reduce((sum, p) => sum + p.views, 0)
  const totalEnquiries = propertyPerformance.reduce((sum, p) => sum + p.enquiries, 0)
  const totalViewings = propertyPerformance.reduce((sum, p) => sum + p.viewings, 0)
  const averageConversion = propertyPerformance.reduce((sum, p) => sum + p.conversionRate, 0) / propertyPerformance.length

  return (
    <div className="bg-surface min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-border">
        <div className="max-w-8xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Analytics Dashboard</h1>
              <p className="text-text-secondary">Track your property performance and market insights</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex gap-1 bg-secondary rounded-lg p-1">
                {(['7d', '30d', '3m', '6m', '1y'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimeRange(period)}
                    className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                      timeRange === period
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
          <div className="flex gap-1 mt-6">
            {([
              { key: 'overview', label: 'Overview' },
              { key: 'properties', label: 'Properties' },
              { key: 'leads', label: 'Leads' },
              { key: 'market', label: 'Market' }
            ] as const).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedView(tab.key)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  selectedView === tab.key
                    ? 'bg-accent text-white'
                    : 'text-text-secondary hover:text-text-primary hover:bg-secondary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-8xl mx-auto px-6 py-8">
        {selectedView === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Eye className="w-5 h-5 text-primary" />
                  </div>
                  {getTrendIcon('up')}
                </div>
                <div className="text-2xl font-bold text-text-primary mb-1">
                  {totalViews.toLocaleString()}
                </div>
                <div className="text-sm text-text-secondary">Total Views</div>
                <div className="text-xs text-success mt-1">+12.5% vs last period</div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Mail className="w-5 h-5 text-accent" />
                  </div>
                  {getTrendIcon('up')}
                </div>
                <div className="text-2xl font-bold text-text-primary mb-1">
                  {totalEnquiries}
                </div>
                <div className="text-sm text-text-secondary">Enquiries</div>
                <div className="text-xs text-success mt-1">+8.3% vs last period</div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-warning/10 rounded-lg">
                    <Calendar className="w-5 h-5 text-warning" />
                  </div>
                  {getTrendIcon('up')}
                </div>
                <div className="text-2xl font-bold text-text-primary mb-1">
                  {totalViewings}
                </div>
                <div className="text-sm text-text-secondary">Viewings</div>
                <div className="text-xs text-success mt-1">+15.2% vs last period</div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-success/10 rounded-lg">
                    <Target className="w-5 h-5 text-success" />
                  </div>
                  {getTrendIcon('up')}
                </div>
                <div className="text-2xl font-bold text-text-primary mb-1">
                  {averageConversion.toFixed(1)}%
                </div>
                <div className="text-sm text-text-secondary">Conversion Rate</div>
                <div className="text-xs text-success mt-1">+2.1% vs last period</div>
              </div>
            </div>

            {/* Performance Chart */}
            <div className="bg-white rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-text-primary">Performance Over Time</h2>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span className="text-text-secondary">Views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-accent rounded-full"></div>
                    <span className="text-text-secondary">Enquiries</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-success rounded-full"></div>
                    <span className="text-text-secondary">Viewings</span>
                  </div>
                </div>
              </div>

              <div className="relative h-64 bg-background rounded-lg p-4">
                {/* Simple bar chart visualization */}
                <div className="flex items-end justify-between h-full">
                  {timeseriesData.slice(-14).map((data, index) => {
                    const maxValue = Math.max(...timeseriesData.map(d => Math.max(d.views, d.enquiries * 10, d.viewings * 15)))
                    const viewHeight = (data.views / maxValue) * 100
                    const enquiryHeight = ((data.enquiries * 10) / maxValue) * 100
                    const viewingHeight = ((data.viewings * 15) / maxValue) * 100

                    return (
                      <div key={index} className="flex flex-col items-center group relative">
                        <div className="flex items-end gap-0.5 mb-2">
                          <div
                            className="w-2 bg-primary rounded-t"
                            style={{ height: `${Math.max(viewHeight, 5)}%` }}
                          />
                          <div
                            className="w-2 bg-accent rounded-t"
                            style={{ height: `${Math.max(enquiryHeight, 3)}%` }}
                          />
                          <div
                            className="w-2 bg-success rounded-t"
                            style={{ height: `${Math.max(viewingHeight, 3)}%` }}
                          />
                        </div>

                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                          <div>Views: {data.views}</div>
                          <div>Enquiries: {data.enquiries}</div>
                          <div>Viewings: {data.viewings}</div>
                          <div>{new Date(data.date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Top Performing Properties */}
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-text-primary">Top Performing Properties</h2>
                  <button className="text-sm text-accent hover:text-accent-light">View All</button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary">
                    <tr>
                      <th className="text-left p-4 font-medium text-text-secondary">Property</th>
                      <th className="text-left p-4 font-medium text-text-secondary">Price</th>
                      <th className="text-left p-4 font-medium text-text-secondary">Views</th>
                      <th className="text-left p-4 font-medium text-text-secondary">Enquiries</th>
                      <th className="text-left p-4 font-medium text-text-secondary">Conversion</th>
                      <th className="text-left p-4 font-medium text-text-secondary">Status</th>
                      <th className="text-left p-4 font-medium text-text-secondary">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {propertyPerformance
                      .sort((a, b) => b.conversionRate - a.conversionRate)
                      .slice(0, 4)
                      .map((property, index) => (
                        <tr key={property.id} className="border-t border-border hover:bg-secondary/50">
                          <td className="p-4">
                            <div className="font-medium text-text-primary">{property.address}</div>
                            <div className="text-sm text-text-muted">{property.daysOnMarket} days on market</div>
                          </td>
                          <td className="p-4 font-medium text-text-primary">
                            {formatPrice(property.price, property.listingType)}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4 text-text-muted" />
                              <span className="font-medium">{property.views.toLocaleString()}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1">
                              <Mail className="w-4 h-4 text-text-muted" />
                              <span className="font-medium">{property.enquiries}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="font-medium text-success">{property.conversionRate}%</span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(property.status)}`}>
                              {property.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="p-4">
                            {getTrendIcon(property.trendDirection)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {selectedView === 'properties' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-text-primary">All Properties Performance</h2>
                  <div className="flex items-center gap-2">
                    <button className="btn-secondary flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      Filter
                    </button>
                    <button className="btn-secondary flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary">
                    <tr>
                      <th className="text-left p-4 font-medium text-text-secondary">Property</th>
                      <th className="text-left p-4 font-medium text-text-secondary">Price</th>
                      <th className="text-left p-4 font-medium text-text-secondary">Views</th>
                      <th className="text-left p-4 font-medium text-text-secondary">Saves</th>
                      <th className="text-left p-4 font-medium text-text-secondary">Enquiries</th>
                      <th className="text-left p-4 font-medium text-text-secondary">Viewings</th>
                      <th className="text-left p-4 font-medium text-text-secondary">Days Listed</th>
                      <th className="text-left p-4 font-medium text-text-secondary">Conversion</th>
                      <th className="text-left p-4 font-medium text-text-secondary">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {propertyPerformance.map((property) => (
                      <tr key={property.id} className="border-t border-border hover:bg-secondary/50">
                        <td className="p-4">
                          <div className="font-medium text-text-primary">{property.address}</div>
                          <div className="text-sm text-text-muted capitalize">
                            {property.listingType.toLowerCase()} • {property.priceChanges} price changes
                          </div>
                        </td>
                        <td className="p-4 font-medium text-text-primary">
                          {formatPrice(property.price, property.listingType)}
                        </td>
                        <td className="p-4 font-medium">{property.views.toLocaleString()}</td>
                        <td className="p-4 font-medium">{property.saves}</td>
                        <td className="p-4 font-medium">{property.enquiries}</td>
                        <td className="p-4 font-medium">{property.viewings}</td>
                        <td className="p-4 font-medium">{property.daysOnMarket}</td>
                        <td className="p-4">
                          <span className={`font-medium ${
                            property.conversionRate > 5 ? 'text-success' :
                            property.conversionRate > 2 ? 'text-warning' : 'text-error'
                          }`}>
                            {property.conversionRate}%
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(property.status)}`}>
                            {property.status.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {selectedView === 'leads' && leadMetrics && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="font-medium text-text-secondary">Total Leads</span>
                </div>
                <div className="text-2xl font-bold text-text-primary">{leadMetrics.total}</div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-success" />
                  <span className="font-medium text-text-secondary">Qualified</span>
                </div>
                <div className="text-2xl font-bold text-text-primary">{leadMetrics.qualified}</div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-5 h-5 text-accent" />
                  <span className="font-medium text-text-secondary">Converted</span>
                </div>
                <div className="text-2xl font-bold text-text-primary">{leadMetrics.converted}</div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-warning" />
                  <span className="font-medium text-text-secondary">Avg Response</span>
                </div>
                <div className="text-2xl font-bold text-text-primary">{leadMetrics.averageResponseTime}m</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Lead Sources</h3>
                <div className="space-y-3">
                  {leadMetrics.sources.map((source, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center text-xs font-medium">
                          {source.name.charAt(0)}
                        </div>
                        <span className="font-medium text-text-primary">{source.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-secondary rounded-full h-2">
                          <div
                            className="bg-accent h-2 rounded-full"
                            style={{ width: `${source.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-text-secondary w-12 text-right">
                          {source.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Conversion Funnel</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                    <span className="font-medium text-text-primary">Total Leads</span>
                    <span className="font-bold text-primary">{leadMetrics.total}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-accent/5 rounded-lg">
                    <span className="font-medium text-text-primary">Qualified</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-accent">{leadMetrics.qualified}</span>
                      <span className="text-sm text-text-muted">
                        ({((leadMetrics.qualified / leadMetrics.total) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-success/5 rounded-lg">
                    <span className="font-medium text-text-primary">Converted</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-success">{leadMetrics.converted}</span>
                      <span className="text-sm text-text-muted">
                        ({leadMetrics.conversionRate}%)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedView === 'market' && marketMetrics && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <DollarSign className="w-5 h-5 text-primary" />
                  </div>
                  {getTrendIcon(marketMetrics.marketTrend)}
                </div>
                <div className="text-2xl font-bold text-text-primary mb-1">
                  £{marketMetrics.averagePrice.toLocaleString()}
                </div>
                <div className="text-sm text-text-secondary">Average Price</div>
                <div className={`text-xs mt-1 ${marketMetrics.priceChange >= 0 ? 'text-success' : 'text-error'}`}>
                  {marketMetrics.priceChange >= 0 ? '+' : ''}{marketMetrics.priceChange}% this month
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Clock className="w-5 h-5 text-accent" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-text-primary mb-1">
                  {marketMetrics.averageDaysOnMarket}
                </div>
                <div className="text-sm text-text-secondary">Avg Days on Market</div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-success/10 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-success" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-text-primary mb-1">
                  {marketMetrics.demandIndex}
                </div>
                <div className="text-sm text-text-secondary">Demand Index</div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-warning/10 rounded-lg">
                    <PieChart className="w-5 h-5 text-warning" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-text-primary mb-1">
                  #{marketMetrics.competitorAnalysis.rank}
                </div>
                <div className="text-sm text-text-secondary">Market Ranking</div>
                <div className="text-xs text-text-muted mt-1">
                  {marketMetrics.competitorAnalysis.marketShare}% market share
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-6">Market Insights</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-medium text-text-primary mb-4">Your Performance vs Market</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-text-secondary">Average Sale Time</span>
                        <span className="text-sm font-medium text-success">25% faster</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className="bg-success h-2 rounded-full" style={{ width: '75%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-text-secondary">Enquiry Response Time</span>
                        <span className="text-sm font-medium text-success">40% faster</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className="bg-success h-2 rounded-full" style={{ width: '85%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-text-secondary">Conversion Rate</span>
                        <span className="text-sm font-medium text-warning">5% below average</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className="bg-warning h-2 rounded-full" style={{ width: '65%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-text-primary mb-4">Market Recommendations</h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                      <div className="font-medium text-accent mb-1">Price Optimization</div>
                      <div className="text-sm text-text-secondary">
                        Consider adjusting pricing on 2 properties that have been on market for 45+ days
                      </div>
                    </div>

                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="font-medium text-primary mb-1">Photography Update</div>
                      <div className="text-sm text-text-secondary">
                        Properties with professional photos get 67% more views in your area
                      </div>
                    </div>

                    <div className="p-4 bg-success/5 rounded-lg border border-success/20">
                      <div className="font-medium text-success mb-1">Market Timing</div>
                      <div className="text-sm text-text-secondary">
                        Spring selling season starts in 3 weeks - optimal time for new listings
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}