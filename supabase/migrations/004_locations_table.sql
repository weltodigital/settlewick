-- Create locations table for UK-wide hierarchical location data
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                          -- e.g. "Southsea", "Portsmouth", "Hampshire"
  slug TEXT NOT NULL UNIQUE,                   -- e.g. "southsea", "portsmouth", "hampshire"
  location_type TEXT NOT NULL,                 -- 'neighbourhood' | 'city' | 'town' | 'county' | 'region' | 'postcode_district' | 'postcode_area'
  parent_id UUID REFERENCES locations(id),     -- hierarchical: Southsea → Portsmouth → Hampshire → South East
  postcode_prefix TEXT,                        -- e.g. 'PO1', 'PO4' (nullable, for postcode-based locations)
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  bounds_ne_lat DECIMAL(10, 7),               -- bounding box for map viewport
  bounds_ne_lng DECIMAL(10, 7),
  bounds_sw_lat DECIMAL(10, 7),
  bounds_sw_lng DECIMAL(10, 7),
  population INTEGER,                          -- for area guides
  description TEXT,                            -- area guide content
  property_count_sale INTEGER DEFAULT 0,       -- cached count, updated periodically
  property_count_rent INTEGER DEFAULT 0,
  average_price INTEGER,                       -- cached average, updated periodically
  average_rent INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_locations_slug ON locations(slug);
CREATE INDEX idx_locations_type ON locations(location_type);
CREATE INDEX idx_locations_parent ON locations(parent_id);
CREATE INDEX idx_locations_postcode ON locations(postcode_prefix);

-- Trigram index for fuzzy search
CREATE INDEX idx_locations_name_trgm ON locations USING GIN (name gin_trgm_ops);

-- Function for location autocomplete with trigram matching
CREATE OR REPLACE FUNCTION autocomplete_locations(search_query TEXT, max_results INT DEFAULT 10)
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT,
  location_type TEXT,
  parent_name TEXT,
  parent_slug TEXT,
  full_slug TEXT,          -- e.g. "portsmouth/southsea" for URL building
  latitude DECIMAL,
  longitude DECIMAL,
  property_count_sale INT,
  property_count_rent INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    l.id, l.name, l.slug, l.location_type,
    p.name AS parent_name, p.slug AS parent_slug,
    CASE WHEN p.slug IS NOT NULL THEN p.slug || '/' || l.slug ELSE l.slug END AS full_slug,
    l.latitude, l.longitude,
    l.property_count_sale, l.property_count_rent
  FROM locations l
  LEFT JOIN locations p ON l.parent_id = p.id
  WHERE l.name ILIKE search_query || '%'
     OR l.name % search_query  -- trigram similarity
     OR l.postcode_prefix ILIKE search_query || '%'
  ORDER BY
    CASE WHEN l.name ILIKE search_query || '%' THEN 0 ELSE 1 END,  -- prefix matches first
    similarity(l.name, search_query) DESC,
    l.property_count_sale DESC  -- popular locations first
  LIMIT max_results;
END;
$$ LANGUAGE plpgsql;