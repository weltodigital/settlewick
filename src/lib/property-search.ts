import { prisma } from './db'
import { distanceQuery, boundingBoxQuery, polygonQuery } from './geo'
import type { PropertyFilters } from '@/types/filters'
import type { PropertyWithDetails } from '@/types/property'
import type { Prisma } from '@prisma/client'

export async function searchProperties(
  filters: PropertyFilters
): Promise<{
  properties: PropertyWithDetails[]
  total: number
  page: number
  totalPages: number
  filters: PropertyFilters
}> {
  const {
    listingType = 'SALE',
    location,
    priceMin,
    priceMax,
    bedrooms,
    bathrooms,
    propertyType,
    // ... many more filters
    latitude,
    longitude,
    radius,
    boundingBox,
    polygon,
    sortBy = 'newest',
    page = 1,
    limit = 20,
    excludeHidden = false,
    userId
  } = filters

  // Build where clause
  const whereClause: Prisma.PropertyWhereInput = {
    listingType,
    status: 'AVAILABLE'
  }

  // Price range
  if (priceMin || priceMax) {
    whereClause.price = {}
    if (priceMin) whereClause.price.gte = priceMin * 100 // convert to pence
    if (priceMax) whereClause.price.lte = priceMax * 100
  }

  // Bedrooms
  if (bedrooms && bedrooms.length > 0) {
    whereClause.bedrooms = { in: bedrooms }
  }

  // Bathrooms
  if (bathrooms && (bathrooms as any).length > 0) {
    whereClause.bathrooms = { in: bathrooms as any }
  }

  // Property types
  if (propertyType && propertyType.length > 0) {
    whereClause.propertyType = { in: propertyType }
  }

  // Boolean features
  const booleanFeatures = [
    'chainFree', 'newBuild', 'periodProperty', 'modern', 'cottage',
    'utilityRoom', 'basement', 'conservatory', 'homeOffice',
    'enSuite', 'bathtub', 'patio', 'garage', 'balcony'
  ] as const

  booleanFeatures.forEach((feature) => {
    if (filters[feature] === true) {
      whereClause[feature] = true
    }
  })

  // Location search (text-based)
  if (location) {
    whereClause.OR = [
      {
        addressTown: {
          contains: location,
          mode: 'insensitive'
        }
      },
      {
        addressPostcode: {
          contains: location,
          mode: 'insensitive'
        }
      },
      {
        addressLine1: {
          contains: location,
          mode: 'insensitive'
        }
      }
    ]
  }

  // Exclude hidden properties for logged-in users
  if (excludeHidden && userId) {
    whereClause.hiddenBy = {
      none: {
        userId
      }
    }
  }

  // For spatial queries, we'll need to use raw SQL
  let spatialCondition = ''
  if (latitude && longitude && radius) {
    spatialCondition = distanceQuery(latitude, longitude, radius)
  } else if (boundingBox) {
    spatialCondition = boundingBoxQuery(
      boundingBox.swLat,
      boundingBox.swLng,
      boundingBox.neLat,
      boundingBox.neLng
    )
  } else if (polygon && polygon.length > 0) {
    spatialCondition = polygonQuery(polygon)
  }

  // Build order clause
  let orderBy: Prisma.PropertyOrderByWithRelationInput[] = []

  switch (sortBy) {
    case 'newest':
      orderBy = [{ listedDate: 'desc' }]
      break
    case 'price_low':
      orderBy = [{ price: 'asc' }]
      break
    case 'price_high':
      orderBy = [{ price: 'desc' }]
      break
    case 'most_reduced':
      orderBy = [
        { priceChangedDate: 'desc' },
        { listedDate: 'desc' }
      ]
      break
    default:
      orderBy = [{ listedDate: 'desc' }]
  }

  const skip = (page - 1) * limit

  // Execute queries
  let properties: PropertyWithDetails[]
  let total: number

  if (spatialCondition) {
    // Use raw SQL for spatial queries
    const spatialQuery = `
      SELECT p.*,
        CASE WHEN p.longitude IS NOT NULL AND p.latitude IS NOT NULL
        THEN ST_Distance(
          ST_GeomFromText('POINT(' || p.longitude || ' ' || p.latitude || ')', 4326),
          ST_GeomFromText('POINT(${longitude} ${latitude})', 4326)
        ) * 111319.9 -- Convert to meters approximation
        END as distance
      FROM properties p
      WHERE p.listing_type = '${listingType}'
        AND p.status = 'AVAILABLE'
        ${spatialCondition ? `AND ${spatialCondition}` : ''}
      ORDER BY ${sortBy === 'nearest' ? 'distance ASC' : 'p.listed_date DESC'}
      LIMIT ${limit} OFFSET ${skip}
    `

    const countQuery = `
      SELECT COUNT(*)
      FROM properties p
      WHERE p.listing_type = '${listingType}'
        AND p.status = 'AVAILABLE'
        ${spatialCondition ? `AND ${spatialCondition}` : ''}
    `

    // For now, fallback to regular Prisma query
    // In production, you'd implement the raw spatial queries
    properties = await prisma.property.findMany({
      where: whereClause,
      include: {
        agent: true,
        images: {
          orderBy: { displayOrder: 'asc' }
        },
        priceHistory: {
          orderBy: { date: 'desc' }
        }
      },
      orderBy,
      skip,
      take: limit
    }) as PropertyWithDetails[]

    total = await prisma.property.count({ where: whereClause })
  } else {
    // Regular Prisma queries
    const [propertiesResult, totalResult] = await Promise.all([
      prisma.property.findMany({
        where: whereClause,
        include: {
          agent: true,
          images: {
            orderBy: { displayOrder: 'asc' }
          },
          priceHistory: {
            orderBy: { date: 'desc' }
          }
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.property.count({ where: whereClause })
    ])

    properties = propertiesResult as PropertyWithDetails[]
    total = totalResult
  }

  const totalPages = Math.ceil(total / limit)

  return {
    properties,
    total,
    page,
    totalPages,
    filters
  }
}

export async function getFilterCounts(baseFilters: PropertyFilters) {
  // Get counts for various filter options to show in the UI
  const { listingType = 'SALE', location } = baseFilters

  const baseWhere: Prisma.PropertyWhereInput = {
    listingType,
    status: 'AVAILABLE'
  }

  if (location) {
    baseWhere.OR = [
      { addressTown: { contains: location, mode: 'insensitive' } },
      { addressPostcode: { contains: location, mode: 'insensitive' } },
      { addressLine1: { contains: location, mode: 'insensitive' } }
    ]
  }

  // Get bedroom counts
  const bedroomCounts = await prisma.property.groupBy({
    by: ['bedrooms'],
    where: baseWhere,
    _count: true,
    orderBy: { bedrooms: 'asc' }
  })

  // Get property type counts
  const propertyTypeCounts = await prisma.property.groupBy({
    by: ['propertyType'],
    where: baseWhere,
    _count: true
  })

  return {
    bedrooms: bedroomCounts.map(item => ({
      value: item.bedrooms || 0,
      count: item._count
    })),
    propertyTypes: propertyTypeCounts.map(item => ({
      value: item.propertyType,
      count: item._count
    }))
  }
}