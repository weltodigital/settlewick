-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create agents table
CREATE TABLE agents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    branch_name TEXT,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    website_url TEXT,
    logo_url TEXT,
    address_line_1 TEXT,
    address_town TEXT,
    address_postcode TEXT,
    latitude DECIMAL,
    longitude DECIMAL,
    description TEXT,
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'basic', 'premium')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'agent', 'admin')),
    agent_id UUID REFERENCES agents(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create properties table
CREATE TABLE properties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    listing_type TEXT NOT NULL CHECK (listing_type IN ('sale', 'rent')),
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'under_offer', 'sstc', 'sold', 'let_agreed', 'let')),
    price INTEGER NOT NULL, -- in pence
    price_qualifier TEXT DEFAULT 'fixed_price' CHECK (price_qualifier IN ('guide_price', 'offers_over', 'offers_in_region', 'fixed_price', 'from', 'poa')),
    property_type TEXT NOT NULL CHECK (property_type IN ('detached', 'semi_detached', 'terraced', 'flat', 'bungalow', 'maisonette', 'cottage', 'town_house', 'park_home', 'land', 'other')),
    new_build BOOLEAN DEFAULT FALSE,

    -- Address
    address_line_1 TEXT NOT NULL,
    address_line_2 TEXT,
    address_town TEXT NOT NULL,
    address_county TEXT NOT NULL,
    address_postcode TEXT NOT NULL,
    latitude DECIMAL NOT NULL,
    longitude DECIMAL NOT NULL,
    location GEOMETRY(POINT, 4326),

    -- Core specs
    bedrooms INTEGER NOT NULL,
    bathrooms INTEGER NOT NULL,
    reception_rooms INTEGER,
    floor_area_sqft INTEGER,
    floor_area_sqm DECIMAL,
    plot_size_sqft INTEGER,
    floor_level TEXT CHECK (floor_level IN ('ground', 'first', 'second', 'upper', 'top')),

    -- Tenure & leasehold details
    tenure TEXT NOT NULL DEFAULT 'freehold' CHECK (tenure IN ('freehold', 'leasehold', 'share_of_freehold', 'commonhold')),
    lease_length_remaining INTEGER, -- years
    service_charge_annual INTEGER, -- pence
    ground_rent_annual INTEGER, -- pence

    -- Energy
    epc_rating TEXT CHECK (epc_rating IN ('A', 'B', 'C', 'D', 'E', 'F', 'G')),
    epc_potential_rating TEXT CHECK (epc_potential_rating IN ('A', 'B', 'C', 'D', 'E', 'F', 'G')),
    heating_type TEXT CHECK (heating_type IN ('gas_central', 'electric', 'oil', 'heat_pump', 'biomass', 'district', 'other')),
    mains_gas BOOLEAN,
    mains_sewer BOOLEAN,
    estimated_annual_energy_cost INTEGER, -- pence

    -- Outdoor & parking
    garden_type TEXT CHECK (garden_type IN ('private', 'communal', 'none')),
    garden_orientation TEXT CHECK (garden_orientation IN ('north', 'south', 'east', 'west')),
    parking_type TEXT CHECK (parking_type IN ('driveway', 'garage', 'allocated', 'on_street', 'none')),
    ev_charging BOOLEAN DEFAULT FALSE,

    -- Property features (boolean flags)
    period_property BOOLEAN DEFAULT FALSE,
    modern BOOLEAN DEFAULT FALSE,
    cottage BOOLEAN DEFAULT FALSE,
    fixer_upper BOOLEAN DEFAULT FALSE,
    utility_room BOOLEAN DEFAULT FALSE,
    basement BOOLEAN DEFAULT FALSE,
    conservatory BOOLEAN DEFAULT FALSE,
    home_office BOOLEAN DEFAULT FALSE,
    en_suite BOOLEAN DEFAULT FALSE,
    bathtub BOOLEAN DEFAULT FALSE,
    patio BOOLEAN DEFAULT FALSE,
    kitchen_island BOOLEAN DEFAULT FALSE,
    loft_conversion BOOLEAN DEFAULT FALSE,
    annexe BOOLEAN DEFAULT FALSE,
    open_plan_kitchen BOOLEAN DEFAULT FALSE,
    separate_dining_room BOOLEAN DEFAULT FALSE,
    downstairs_wc BOOLEAN DEFAULT FALSE,
    double_glazing BOOLEAN DEFAULT FALSE,
    log_burner BOOLEAN DEFAULT FALSE,
    solar_panels BOOLEAN DEFAULT FALSE,
    underfloor_heating BOOLEAN DEFAULT FALSE,
    wet_room BOOLEAN DEFAULT FALSE,
    walk_in_wardrobe BOOLEAN DEFAULT FALSE,
    bifold_doors BOOLEAN DEFAULT FALSE,
    bay_windows BOOLEAN DEFAULT FALSE,
    original_features BOOLEAN DEFAULT FALSE,
    cellar BOOLEAN DEFAULT FALSE,
    garage BOOLEAN DEFAULT FALSE,
    outbuildings BOOLEAN DEFAULT FALSE,
    swimming_pool BOOLEAN DEFAULT FALSE,
    balcony BOOLEAN DEFAULT FALSE,
    roof_terrace BOOLEAN DEFAULT FALSE,

    -- Rental-specific
    furnished TEXT CHECK (furnished IN ('furnished', 'unfurnished', 'part_furnished')),
    pets_allowed BOOLEAN,
    bills_included BOOLEAN,
    deposit_amount INTEGER, -- pence
    available_from DATE,
    min_tenancy_months INTEGER,

    -- Status & transparency
    chain_free BOOLEAN,
    listed_date TIMESTAMPTZ DEFAULT NOW(),
    price_changed_date TIMESTAMPTZ,
    original_price INTEGER, -- pence

    -- Content
    description TEXT NOT NULL,
    summary TEXT NOT NULL,

    -- Relationships
    agent_id UUID NOT NULL REFERENCES agents(id),
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create property_images table
CREATE TABLE property_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    display_order INTEGER DEFAULT 0,
    is_floorplan BOOLEAN DEFAULT FALSE,
    is_primary BOOLEAN DEFAULT FALSE,
    room_tag TEXT CHECK (room_tag IN ('kitchen', 'living_room', 'bedroom_1', 'bedroom_2', 'bathroom', 'garden', 'exterior', 'other')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create property_price_history table
CREATE TABLE property_price_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (event_type IN ('listed', 'price_reduced', 'price_increased', 'sstc', 'under_offer', 'back_on_market', 'sold', 'withdrawn', 'let_agreed', 'let')),
    price INTEGER NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create saved_properties table
CREATE TABLE saved_properties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, property_id)
);

-- Create hidden_properties table
CREATE TABLE hidden_properties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    reason TEXT CHECK (reason IN ('too_small', 'too_expensive', 'wrong_area', 'not_interested', 'other')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, property_id)
);

-- Create saved_searches table
CREATE TABLE saved_searches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    search_params JSONB NOT NULL,
    alert_enabled BOOLEAN DEFAULT FALSE,
    alert_frequency TEXT DEFAULT 'daily' CHECK (alert_frequency IN ('instant', 'daily', 'weekly')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create property_enquiries table
CREATE TABLE property_enquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    agent_id UUID NOT NULL REFERENCES agents(id),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    enquiry_type TEXT NOT NULL CHECK (enquiry_type IN ('viewing_request', 'more_info', 'general')),
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'responded')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create property_views table (analytics)
CREATE TABLE property_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    session_id TEXT,
    viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sold_prices table
CREATE TABLE sold_prices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    address TEXT NOT NULL,
    postcode TEXT NOT NULL,
    price INTEGER NOT NULL,
    date_sold DATE NOT NULL,
    property_type TEXT NOT NULL,
    new_build BOOLEAN DEFAULT FALSE,
    tenure TEXT NOT NULL,
    latitude DECIMAL,
    longitude DECIMAL,
    location GEOMETRY(POINT, 4326),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create area_guides table
CREATE TABLE area_guides (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    parent_area TEXT,
    postcode_prefix TEXT,
    description TEXT NOT NULL,
    latitude DECIMAL,
    longitude DECIMAL,
    average_price INTEGER, -- pence
    average_rent INTEGER, -- pence monthly
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX properties_listing_type_status_idx ON properties(listing_type, status);
CREATE INDEX properties_price_idx ON properties(price);
CREATE INDEX properties_bedrooms_idx ON properties(bedrooms);
CREATE INDEX properties_bathrooms_idx ON properties(bathrooms);
CREATE INDEX properties_property_type_idx ON properties(property_type);
CREATE INDEX properties_epc_rating_idx ON properties(epc_rating);
CREATE INDEX properties_listed_date_idx ON properties(listed_date);
CREATE INDEX properties_agent_id_idx ON properties(agent_id);

-- PostGIS spatial indexes
CREATE INDEX properties_location_gist_idx ON properties USING GIST (location);
CREATE INDEX sold_prices_location_gist_idx ON sold_prices USING GIST (location);

-- Trigram indexes for text search/autocomplete
CREATE INDEX properties_address_trgm_idx ON properties USING GIN (address_line_1 gin_trgm_ops);
CREATE INDEX properties_town_trgm_idx ON properties USING GIN (address_town gin_trgm_ops);
CREATE INDEX properties_postcode_trgm_idx ON properties USING GIN (address_postcode gin_trgm_ops);

-- GIN index for property features (boolean columns)
CREATE INDEX properties_features_idx ON properties USING GIN (
    (CASE WHEN period_property THEN 'period_property' END),
    (CASE WHEN modern THEN 'modern' END),
    (CASE WHEN cottage THEN 'cottage' END),
    (CASE WHEN new_build THEN 'new_build' END),
    (CASE WHEN chain_free THEN 'chain_free' END),
    (CASE WHEN garage THEN 'garage' END),
    (CASE WHEN garden_type IS NOT NULL THEN 'has_garden' END),
    (CASE WHEN parking_type IS NOT NULL AND parking_type != 'none' THEN 'has_parking' END)
);

-- Function to automatically set location point from lat/lng
CREATE OR REPLACE FUNCTION set_location_point()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
        NEW.location := ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically set location
CREATE TRIGGER set_properties_location_trigger
    BEFORE INSERT OR UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION set_location_point();

CREATE TRIGGER set_sold_prices_location_trigger
    BEFORE INSERT OR UPDATE ON sold_prices
    FOR EACH ROW
    EXECUTE FUNCTION set_location_point();

-- Function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, name, role)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', ''), 'user');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- Function: Search properties by radius
CREATE OR REPLACE FUNCTION search_properties_by_radius(
    lat DECIMAL,
    lng DECIMAL,
    radius_miles DECIMAL,
    filters JSONB DEFAULT '{}'::JSONB
)
RETURNS TABLE (
    id UUID,
    slug TEXT,
    listing_type TEXT,
    status TEXT,
    price INTEGER,
    property_type TEXT,
    bedrooms INTEGER,
    bathrooms INTEGER,
    address_line_1 TEXT,
    address_town TEXT,
    address_postcode TEXT,
    latitude DECIMAL,
    longitude DECIMAL,
    distance DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.slug,
        p.listing_type,
        p.status,
        p.price,
        p.property_type,
        p.bedrooms,
        p.bathrooms,
        p.address_line_1,
        p.address_town,
        p.address_postcode,
        p.latitude,
        p.longitude,
        ST_Distance(
            ST_GeogFromWKB(p.location::bytea),
            ST_GeogFromWKB(ST_SetSRID(ST_MakePoint(lng, lat), 4326)::bytea)
        ) / 1609.34 AS distance -- Convert meters to miles
    FROM properties p
    WHERE
        ST_DWithin(
            ST_GeogFromWKB(p.location::bytea),
            ST_GeogFromWKB(ST_SetSRID(ST_MakePoint(lng, lat), 4326)::bytea),
            radius_miles * 1609.34 -- Convert miles to meters
        )
        AND p.status = 'available'
        AND (
            (filters->>'listing_type') IS NULL OR
            p.listing_type = (filters->>'listing_type')
        )
    ORDER BY distance;
END;
$$ LANGUAGE plpgsql;

-- Function: Search properties by bounding box
CREATE OR REPLACE FUNCTION search_properties_by_bounds(
    min_lat DECIMAL,
    min_lng DECIMAL,
    max_lat DECIMAL,
    max_lng DECIMAL,
    filters JSONB DEFAULT '{}'::JSONB
)
RETURNS TABLE (
    id UUID,
    slug TEXT,
    listing_type TEXT,
    status TEXT,
    price INTEGER,
    property_type TEXT,
    bedrooms INTEGER,
    bathrooms INTEGER,
    address_line_1 TEXT,
    address_town TEXT,
    address_postcode TEXT,
    latitude DECIMAL,
    longitude DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.slug,
        p.listing_type,
        p.status,
        p.price,
        p.property_type,
        p.bedrooms,
        p.bathrooms,
        p.address_line_1,
        p.address_town,
        p.address_postcode,
        p.latitude,
        p.longitude
    FROM properties p
    WHERE
        p.location && ST_MakeEnvelope(min_lng, min_lat, max_lng, max_lat, 4326)
        AND p.status = 'available'
        AND (
            (filters->>'listing_type') IS NULL OR
            p.listing_type = (filters->>'listing_type')
        );
END;
$$ LANGUAGE plpgsql;

-- Function: Search properties by polygon
CREATE OR REPLACE FUNCTION search_properties_by_polygon(
    polygon_geojson TEXT,
    filters JSONB DEFAULT '{}'::JSONB
)
RETURNS TABLE (
    id UUID,
    slug TEXT,
    listing_type TEXT,
    status TEXT,
    price INTEGER,
    property_type TEXT,
    bedrooms INTEGER,
    bathrooms INTEGER,
    address_line_1 TEXT,
    address_town TEXT,
    address_postcode TEXT,
    latitude DECIMAL,
    longitude DECIMAL
) AS $$
DECLARE
    polygon_geom GEOMETRY;
BEGIN
    -- Convert GeoJSON to PostGIS geometry
    polygon_geom := ST_GeomFromGeoJSON(polygon_geojson);

    RETURN QUERY
    SELECT
        p.id,
        p.slug,
        p.listing_type,
        p.status,
        p.price,
        p.property_type,
        p.bedrooms,
        p.bathrooms,
        p.address_line_1,
        p.address_town,
        p.address_postcode,
        p.latitude,
        p.longitude
    FROM properties p
    WHERE
        ST_Within(p.location, polygon_geom)
        AND p.status = 'available'
        AND (
            (filters->>'listing_type') IS NULL OR
            p.listing_type = (filters->>'listing_type')
        );
END;
$$ LANGUAGE plpgsql;

-- Function: Autocomplete locations
CREATE OR REPLACE FUNCTION autocomplete_locations(query TEXT)
RETURNS TABLE (
    type TEXT,
    name TEXT,
    postcode TEXT,
    latitude DECIMAL,
    longitude DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    -- Search properties by town
    SELECT DISTINCT
        'town'::TEXT,
        p.address_town,
        NULL::TEXT,
        AVG(p.latitude)::DECIMAL,
        AVG(p.longitude)::DECIMAL
    FROM properties p
    WHERE p.address_town ILIKE '%' || query || '%'
    GROUP BY p.address_town
    LIMIT 5

    UNION ALL

    -- Search properties by postcode
    SELECT DISTINCT
        'postcode'::TEXT,
        p.address_postcode,
        p.address_postcode,
        AVG(p.latitude)::DECIMAL,
        AVG(p.longitude)::DECIMAL
    FROM properties p
    WHERE p.address_postcode ILIKE '%' || query || '%'
    GROUP BY p.address_postcode
    LIMIT 5

    UNION ALL

    -- Search area guides
    SELECT
        'area'::TEXT,
        ag.name,
        ag.postcode_prefix,
        ag.latitude,
        ag.longitude
    FROM area_guides ag
    WHERE ag.name ILIKE '%' || query || '%'
    ORDER BY LENGTH(ag.name)
    LIMIT 5;
END;
$$ LANGUAGE plpgsql;