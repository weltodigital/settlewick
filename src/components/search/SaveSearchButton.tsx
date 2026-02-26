'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Bookmark, Check, X } from 'lucide-react'
import type { PropertyFilters } from '@/types/filters'

interface SaveSearchButtonProps {
  filters: PropertyFilters
  total: number
  onSaved?: () => void
}

export default function SaveSearchButton({ filters, total, onSaved }: SaveSearchButtonProps) {
  const { data: session } = useSession()
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [alertEnabled, setAlertEnabled] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  if (!session) return null

  const generateSearchName = () => {
    let parts = []

    if (filters.listingType) {
      parts.push(filters.listingType === 'SALE' ? 'For Sale' : 'To Rent')
    }

    if (filters.location) {
      parts.push(`in ${filters.location}`)
    }

    if ((filters.bedrooms as any)?.min && (filters.bedrooms as any)?.max) {
      if ((filters.bedrooms as any).min === (filters.bedrooms as any).max) {
        parts.push(`${(filters.bedrooms as any).min} bed`)
      } else {
        parts.push(`${(filters.bedrooms as any).min}-${(filters.bedrooms as any).max} bed`)
      }
    } else if ((filters.bedrooms as any)?.min) {
      parts.push(`${(filters.bedrooms as any).min}+ bed`)
    }

    if (filters.priceMin && filters.priceMax) {
      parts.push(`£${filters.priceMin.toLocaleString()}-£${filters.priceMax.toLocaleString()}`)
    } else if (filters.priceMax) {
      parts.push(`up to £${filters.priceMax.toLocaleString()}`)
    } else if (filters.priceMin) {
      parts.push(`from £${filters.priceMin.toLocaleString()}`)
    }

    return parts.length > 0 ? parts.join(' ') : 'Property Search'
  }

  const handleSave = async () => {
    if (!name.trim()) return

    setIsLoading(true)
    try {
      const searchUrl = new URLSearchParams(Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (typeof value === 'object') {
            acc[key] = JSON.stringify(value)
          } else {
            acc[key] = String(value)
          }
        }
        return acc
      }, {} as Record<string, string>)).toString()

      const response = await fetch('/api/saved-searches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          searchCriteria: JSON.stringify(filters),
          searchUrl: `${window.location.pathname}?${searchUrl}`,
          alertEnabled
        })
      })

      if (response.ok) {
        setMessage('Search saved successfully!')
        setShowForm(false)
        setName('')
        onSaved?.()
        setTimeout(() => setMessage(''), 3000)
      } else {
        const data = await response.json()
        setMessage(data.message || 'Failed to save search')
      }
    } catch (error) {
      setMessage('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  if (showForm) {
    return (
      <div className="card p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-text-primary">Save This Search</h3>
          <button
            onClick={() => setShowForm(false)}
            className="text-text-muted hover:text-text-secondary"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Search Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={generateSearchName()}
            className="input-field w-full"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="alerts"
            checked={alertEnabled}
            onChange={(e) => setAlertEnabled(e.target.checked)}
            className="rounded border-border text-accent focus:ring-accent"
          />
          <label htmlFor="alerts" className="text-sm text-text-secondary">
            Email me when new properties match this search
          </label>
        </div>

        <div className="text-sm text-text-muted">
          This search will save {total.toLocaleString()} properties currently matching your criteria.
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleSave}
            disabled={!name.trim() || isLoading}
            className="btn-accent flex-1"
          >
            {isLoading ? 'Saving...' : 'Save Search'}
          </button>
          <button
            onClick={() => setShowForm(false)}
            className="btn-outline"
          >
            Cancel
          </button>
        </div>

        {message && (
          <div className={`text-sm p-2 rounded ${
            message.includes('success')
              ? 'bg-success/10 text-success'
              : 'bg-error/10 text-error'
          }`}>
            {message}
          </div>
        )}
      </div>
    )
  }

  return (
    <button
      onClick={() => {
        setName(generateSearchName())
        setShowForm(true)
      }}
      className="btn-outline flex items-center space-x-2"
    >
      <Bookmark className="w-4 h-4" />
      <span>Save Search</span>
    </button>
  )
}