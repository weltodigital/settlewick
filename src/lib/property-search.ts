import { createClient as createServerClient } from './supabase/server'
import type { PropertyFilters } from '@/types/filters'
import type { Database } from '@/types/database'

type Property = Database['public']['Tables']['properties']['Row']
type PropertyWithDetails = Property & {
  agent: Database['public']['Tables']['agents']['Row']
  images: Database['public']['Tables']['property_images']['Row'][]
  priceHistory: Database['public']['Tables']['property_price_history']['Row'][]
}

export async function searchProperties(
  filters: PropertyFilters
): Promise<{
  properties: PropertyWithDetails[]
  total: number
  page: number
  totalPages: number
  filters: PropertyFilters
}> {
  const supabase = createServerClient()

  const {
    listingType = 'sale',
    location,
    priceMin,
    priceMax,
    bedrooms,
    bathrooms,
    propertyType,
    latitude,
    longitude,
    radius,
    boundingBox,
    polygon,
    sortBy = 'newest',
    page = 1,
    limit = 20,
    excludeHidden = false,
    userId,
    // Boolean features
    chainFree,
    newBuild,
    periodProperty,
    modern,
    cottage,
    utilityRoom,
    basement,
    conservatory,
    homeOffice,
    enSuite,
    bathtub,
    patio,
    garage,
    balcony,
    // Rental specific
    furnished,
    petsAllowed,
    billsIncluded,
    // Other filters
    tenure,
    epcRating,
    gardenType,
    parkingType
  } = filters

  // Handle spatial queries first
  if (latitude && longitude && radius) {
    const { data: spatialResults, error } = await supabase.rpc('search_properties_by_radius', {
      lat: latitude,
      lng: longitude,
      radius_miles: radius,
      filters: { listing_type: listingType }
    })

    if (error) {
      console.error('Spatial query error:', error)
      // Fallback to regular query
    } else if (spatialResults) {
      // Get full property details for spatial results
      const propertyIds = spatialResults.slice((page - 1) * limit, page * limit).map(p => p.id)

      if (propertyIds.length === 0) {
        return {
          properties: [],
          total: 0,
          page,
          totalPages: 0,
          filters
        }
      }

      const { data: properties, error: propertiesError } = await supabase
        .from('properties')
        .select(`
          *,
          agent:agents(*),
          images:property_images(*),
          priceHistory:property_price_history(*)
        `)
        .in('id', propertyIds)

      if (propertiesError) {
        console.error('Error fetching spatial properties:', propertiesError)
      } else {
        return {
          properties: properties as PropertyWithDetails[],
          total: spatialResults.length,
          page,
          totalPages: Math.ceil(spatialResults.length / limit),
          filters
        }
      }
    }
  }

  if (boundingBox) {
    const { data: spatialResults, error } = await supabase.rpc('search_properties_by_bounds', {
      min_lat: boundingBox.swLat,
      min_lng: boundingBox.swLng,
      max_lat: boundingBox.neLat,
      max_lng: boundingBox.neLng,
      filters: { listing_type: listingType }
    })

    if (error) {
      console.error('Bounding box query error:', error)
    } else if (spatialResults) {
      const propertyIds = spatialResults.slice((page - 1) * limit, page * limit).map(p => p.id)

      if (propertyIds.length === 0) {
        return {
          properties: [],
          total: 0,
          page,
          totalPages: 0,
          filters
        }
      }

      const { data: properties, error: propertiesError } = await supabase
        .from('properties')
        .select(`
          *,
          agent:agents(*),
          images:property_images(*),
          priceHistory:property_price_history(*)
        `)
        .in('id', propertyIds)

      if (propertiesError) {
        console.error('Error fetching bounded properties:', propertiesError)
      } else {
        return {
          properties: properties as PropertyWithDetails[],
          total: spatialResults.length,
          page,
          totalPages: Math.ceil(spatialResults.length / limit),
          filters
        }
      }
    }
  }

  // Build regular query
  let query = supabase
    .from('properties')
    .select(`
      *,
      agent:agents(*),
      images:property_images(*),
      priceHistory:property_price_history(*)
    `, { count: 'exact' })
    .eq('listing_type', listingType)
    .eq('status', 'available')

  // Price range
  if (priceMin) {
    query = query.gte('price', priceMin * 100) // convert to pence
  }
  if (priceMax) {
    query = query.lte('price', priceMax * 100)
  }

  // Bedrooms
  if (bedrooms && bedrooms.length > 0) {
    query = query.in('bedrooms', bedrooms)
  }

  // Bathrooms
  if (bathrooms) {
    if (Array.isArray(bathrooms)) {
      query = query.in('bathrooms', bathrooms)
    } else if (typeof bathrooms === 'object' && bathrooms.min) {
      query = query.gte('bathrooms', bathrooms.min)
    }
  }

  // Property types
  if (propertyType && propertyType.length > 0) {
    query = query.in('property_type', propertyType)
  }

  // Boolean features
  if (chainFree === true) query = query.eq('chain_free', true)
  if (newBuild === true) query = query.eq('new_build', true)
  if (periodProperty === true) query = query.eq('period_property', true)
  if (modern === true) query = query.eq('modern', true)
  if (cottage === true) query = query.eq('cottage', true)
  if (utilityRoom === true) query = query.eq('utility_room', true)
  if (basement === true) query = query.eq('basement', true)
  if (conservatory === true) query = query.eq('conservatory', true)
  if (homeOffice === true) query = query.eq('home_office', true)
  if (enSuite === true) query = query.eq('en_suite', true)
  if (bathtub === true) query = query.eq('bathtub', true)
  if (patio === true) query = query.eq('patio', true)
  if (garage === true) query = query.eq('garage', true)
  if (balcony === true) query = query.eq('balcony', true)

  // Tenure
  if (tenure && tenure.length > 0) {
    query = query.in('tenure', tenure)
  }

  // EPC rating
  if (epcRating && epcRating.length > 0) {
    query = query.in('epc_rating', epcRating)
  }

  // Garden type
  if (gardenType && gardenType.length > 0) {
    query = query.in('garden_type', gardenType)
  }

  // Parking type
  if (parkingType && parkingType.length > 0) {
    query = query.in('parking_type', parkingType)
  }

  // Rental specific filters
  if (furnished && furnished.length > 0) {
    query = query.in('furnished', furnished)
  }
  if (petsAllowed === true) query = query.eq('pets_allowed', true)
  if (billsIncluded === true) query = query.eq('bills_included', true)

  // Location search (text-based)
  if (location) {
    query = query.or(
      `address_town.ilike.%${location}%,address_postcode.ilike.%${location}%,address_line_1.ilike.%${location}%`
    )
  }

  // Exclude hidden properties for logged-in users
  if (excludeHidden && userId) {
    const { data: hiddenPropertyIds } = await supabase
      .from('hidden_properties')
      .select('property_id')
      .eq('user_id', userId)

    if (hiddenPropertyIds && hiddenPropertyIds.length > 0) {
      query = query.not('id', 'in', `(${hiddenPropertyIds.map(h => `'${h.property_id}'`).join(',')})`)
    }
  }

  // Sorting
  switch (sortBy) {
    case 'newest':
      query = query.order('listed_date', { ascending: false })
      break
    case 'price_low':
      query = query.order('price', { ascending: true })
      break
    case 'price_high':
      query = query.order('price', { ascending: false })
      break
    case 'most_reduced':
      query = query.order('price_changed_date', { ascending: false, nullsLast: true })
        .order('listed_date', { ascending: false })
      break
    default:
      query = query.order('listed_date', { ascending: false })
  }

  // Pagination
  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to)

  const { data: properties, error, count } = await query

  if (error) {
    console.error('Property search error:', error)
    return {
      properties: [],
      total: 0,
      page,
      totalPages: 0,
      filters
    }
  }

  const total = count || 0
  const totalPages = Math.ceil(total / limit)

  return {
    properties: properties as PropertyWithDetails[] || [],
    total,
    page,
    totalPages,
    filters
  }
}

export async function getFilterCounts(baseFilters: PropertyFilters) {
  const supabase = createServerClient()

  // Get counts for various filter options to show in the UI
  const { listingType = 'sale', location } = baseFilters

  let baseQuery = supabase
    .from('properties')
    .select('bedrooms, property_type')
    .eq('listing_type', listingType)
    .eq('status', 'available')

  if (location) {
    baseQuery = baseQuery.or(
      `address_town.ilike.%${location}%,address_postcode.ilike.%${location}%,address_line_1.ilike.%${location}%`
    )
  }

  const { data: properties, error } = await baseQuery

  if (error || !properties) {
    console.error('Error fetching filter counts:', error)
    return {
      bedrooms: [],
      propertyTypes: []
    }
  }

  // Count bedrooms
  const bedroomCounts: Record<number, number> = {}
  const propertyTypeCounts: Record<string, number> = {}

  properties.forEach(property => {
    // Count bedrooms
    if (property.bedrooms !== null) {
      bedroomCounts[property.bedrooms] = (bedroomCounts[property.bedrooms] || 0) + 1
    }

    // Count property types
    if (property.property_type) {
      propertyTypeCounts[property.property_type] = (propertyTypeCounts[property.property_type] || 0) + 1
    }
  })

  return {
    bedrooms: Object.entries(bedroomCounts)
      .map(([bedrooms, count]) => ({
        value: parseInt(bedrooms),
        count
      }))
      .sort((a, b) => a.value - b.value),
    propertyTypes: Object.entries(propertyTypeCounts)
      .map(([type, count]) => ({
        value: type,
        count
      }))
  }
}