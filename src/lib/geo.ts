// PostGIS helper functions
// Note: Spatial index creation functions are now handled by Supabase migrations

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

// Spatial index creation is now handled by Supabase migrations in:
// supabase/migrations/001_initial_schema.sql