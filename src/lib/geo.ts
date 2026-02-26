import { prisma } from './db'

// PostGIS helper functions

export function createPoint(latitude: number, longitude: number): string {
  return `ST_GeomFromText('POINT(${longitude} ${latitude})', 4326)`
}

export function createPolygon(coordinates: Array<[number, number]>): string {
  // Ensure polygon is closed (first point === last point)
  const coords = [...coordinates]
  if (coords[0][0] !== coords[coords.length - 1][0] || coords[0][1] !== coords[coords.length - 1][1]) {
    coords.push(coords[0])
  }

  const coordString = coords.map(([lat, lng]) => `${lng} ${lat}`).join(', ')
  return `ST_GeomFromText('POLYGON((${coordString}))', 4326)`
}

export function distanceQuery(latitude: number, longitude: number, radiusMiles: number): string {
  const radiusMeters = radiusMiles * 1609.34 // Convert miles to meters
  const point = createPoint(latitude, longitude)

  return `ST_DWithin(
    ST_GeomFromText('POINT(' || longitude || ' ' || latitude || ')', 4326),
    ${point},
    ${radiusMeters}
  )`
}

export function boundingBoxQuery(
  swLat: number,
  swLng: number,
  neLat: number,
  neLng: number
): string {
  return `ST_Within(
    ST_GeomFromText('POINT(' || longitude || ' ' || latitude || ')', 4326),
    ST_GeomFromText('POLYGON((${swLng} ${swLat}, ${neLng} ${swLat}, ${neLng} ${neLat}, ${swLng} ${neLat}, ${swLng} ${swLat}))', 4326)
  )`
}

export function polygonQuery(coordinates: Array<[number, number]>): string {
  const polygon = createPolygon(coordinates)

  return `ST_Within(
    ST_GeomFromText('POINT(' || longitude || ' ' || latitude || ')', 4326),
    ${polygon}
  )`
}

// Utility to calculate distance between two points
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3959 // Earth's radius in miles
  const dLat = toRadians(lat2 - lat1)
  const dLng = toRadians(lng2 - lng1)

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

// Create spatial indexes (to be run after Prisma migrations)
export async function createSpatialIndexes() {
  await prisma.$executeRaw`
    -- Add spatial column for properties
    ALTER TABLE properties ADD COLUMN IF NOT EXISTS location geometry(Point, 4326);
  `

  await prisma.$executeRaw`
    -- Update location column based on lat/lng
    UPDATE properties
    SET location = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
    WHERE location IS NULL;
  `

  await prisma.$executeRaw`
    -- Create spatial index
    CREATE INDEX IF NOT EXISTS idx_properties_location ON properties USING GIST(location);
  `

  await prisma.$executeRaw`
    -- Add spatial column for sold_prices
    ALTER TABLE sold_prices ADD COLUMN IF NOT EXISTS location geometry(Point, 4326);
  `

  await prisma.$executeRaw`
    -- Update location column for sold_prices
    UPDATE sold_prices
    SET location = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
    WHERE location IS NULL AND longitude IS NOT NULL AND latitude IS NOT NULL;
  `

  await prisma.$executeRaw`
    -- Create spatial index for sold_prices
    CREATE INDEX IF NOT EXISTS idx_sold_prices_location ON sold_prices USING GIST(location);
  `

  // Create other performance indexes
  await prisma.$executeRaw`
    -- Property search indexes
    CREATE INDEX IF NOT EXISTS idx_properties_listing_type ON properties(listing_type);
    CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
    CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
    CREATE INDEX IF NOT EXISTS idx_properties_bedrooms ON properties(bedrooms);
    CREATE INDEX IF NOT EXISTS idx_properties_bathrooms ON properties(bathrooms);
    CREATE INDEX IF NOT EXISTS idx_properties_property_type ON properties(property_type);
    CREATE INDEX IF NOT EXISTS idx_properties_tenure ON properties(tenure);
    CREATE INDEX IF NOT EXISTS idx_properties_listed_date ON properties(listed_date);
    CREATE INDEX IF NOT EXISTS idx_properties_postcode ON properties(address_postcode);

    -- Text search indexes
    CREATE INDEX IF NOT EXISTS idx_properties_address_gin ON properties
    USING gin(to_tsvector('english', address_line_1 || ' ' || address_town || ' ' || address_postcode));

    -- Trigram indexes for autocomplete
    CREATE EXTENSION IF NOT EXISTS pg_trgm;
    CREATE INDEX IF NOT EXISTS idx_properties_address_trgm ON properties
    USING gin((address_line_1 || ' ' || address_town || ' ' || address_postcode) gin_trgm_ops);
  `
}