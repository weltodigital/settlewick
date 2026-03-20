import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase/client'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.settlewick.co.uk'

  // Static pages
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/for-sale`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/to-rent`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sold-prices`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/stamp-duty-calculator`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/mortgage-calculator`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/agent`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ]

  try {
    // Get all locations for search pages
    const { data: locations } = await supabase
      .from('locations')
      .select('slug, location_type, updated_at')
      .order('location_type')

    if (locations) {
      // Add for-sale location pages
      locations.forEach(location => {
        routes.push({
          url: `${baseUrl}/for-sale/${location.slug}`,
          lastModified: location.updated_at ? new Date(location.updated_at) : new Date(),
          changeFrequency: 'daily',
          priority: location.location_type === 'city' ? 0.8 : 0.6,
        })

        routes.push({
          url: `${baseUrl}/to-rent/${location.slug}`,
          lastModified: location.updated_at ? new Date(location.updated_at) : new Date(),
          changeFrequency: 'daily',
          priority: location.location_type === 'city' ? 0.8 : 0.6,
        })

        routes.push({
          url: `${baseUrl}/sold-prices/${location.slug}`,
          lastModified: location.updated_at ? new Date(location.updated_at) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        })

        routes.push({
          url: `${baseUrl}/area-guide/${location.slug}`,
          lastModified: location.updated_at ? new Date(location.updated_at) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        })
      })
    }

    // Get all properties for detail pages
    const { data: properties } = await supabase
      .from('properties')
      .select('slug, updated_at')
      .eq('status', 'available')
      .limit(1000) // Limit for performance

    if (properties) {
      properties.forEach(property => {
        routes.push({
          url: `${baseUrl}/property/${property.slug}`,
          lastModified: property.updated_at ? new Date(property.updated_at) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        })
      })
    }

  } catch (error) {
    console.error('Error generating sitemap:', error)
  }

  return routes
}