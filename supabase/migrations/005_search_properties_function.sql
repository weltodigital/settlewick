-- Comprehensive search function for properties with all filters
CREATE OR REPLACE FUNCTION search_properties(
  -- Location
  p_location_slug TEXT DEFAULT NULL,
  p_latitude DECIMAL DEFAULT NULL,
  p_longitude DECIMAL DEFAULT NULL,
  p_radius_miles DECIMAL DEFAULT NULL,
  p_bounds_ne_lat DECIMAL DEFAULT NULL,
  p_bounds_ne_lng DECIMAL DEFAULT NULL,
  p_bounds_sw_lat DECIMAL DEFAULT NULL,
  p_bounds_sw_lng DECIMAL DEFAULT NULL,

  -- Core
  p_listing_type TEXT DEFAULT 'sale',
  p_min_price INTEGER DEFAULT NULL,
  p_max_price INTEGER DEFAULT NULL,
  p_min_beds INTEGER DEFAULT NULL,
  p_max_beds INTEGER DEFAULT NULL,
  p_min_baths INTEGER DEFAULT NULL,
  p_min_receptions INTEGER DEFAULT NULL,
  p_min_floor_area INTEGER DEFAULT NULL,
  p_max_floor_area INTEGER DEFAULT NULL,
  p_property_types TEXT[] DEFAULT NULL,

  -- Features (each is a boolean — true means "must have", null means "don't care")
  p_period_property BOOLEAN DEFAULT NULL,
  p_modern BOOLEAN DEFAULT NULL,
  p_cottage BOOLEAN DEFAULT NULL,
  p_fixer_upper BOOLEAN DEFAULT NULL,
  p_new_build BOOLEAN DEFAULT NULL,
  p_en_suite BOOLEAN DEFAULT NULL,
  p_bathtub BOOLEAN DEFAULT NULL,
  p_wet_room BOOLEAN DEFAULT NULL,
  p_walk_in_wardrobe BOOLEAN DEFAULT NULL,
  p_kitchen_island BOOLEAN DEFAULT NULL,
  p_open_plan_kitchen BOOLEAN DEFAULT NULL,
  p_separate_dining_room BOOLEAN DEFAULT NULL,
  p_utility_room BOOLEAN DEFAULT NULL,
  p_conservatory BOOLEAN DEFAULT NULL,
  p_home_office BOOLEAN DEFAULT NULL,
  p_basement BOOLEAN DEFAULT NULL,
  p_loft_conversion BOOLEAN DEFAULT NULL,
  p_annexe BOOLEAN DEFAULT NULL,
  p_downstairs_wc BOOLEAN DEFAULT NULL,
  p_double_glazing BOOLEAN DEFAULT NULL,
  p_log_burner BOOLEAN DEFAULT NULL,
  p_solar_panels BOOLEAN DEFAULT NULL,
  p_underfloor_heating BOOLEAN DEFAULT NULL,
  p_bay_windows BOOLEAN DEFAULT NULL,
  p_bifold_doors BOOLEAN DEFAULT NULL,
  p_original_features BOOLEAN DEFAULT NULL,
  p_cellar BOOLEAN DEFAULT NULL,
  p_garage BOOLEAN DEFAULT NULL,
  p_outbuildings BOOLEAN DEFAULT NULL,
  p_swimming_pool BOOLEAN DEFAULT NULL,
  p_balcony BOOLEAN DEFAULT NULL,
  p_roof_terrace BOOLEAN DEFAULT NULL,
  p_patio BOOLEAN DEFAULT NULL,

  -- Garden & parking
  p_garden_type TEXT DEFAULT NULL,
  p_garden_orientation TEXT DEFAULT NULL,
  p_parking_type TEXT DEFAULT NULL,
  p_ev_charging BOOLEAN DEFAULT NULL,

  -- Energy
  p_min_epc TEXT DEFAULT NULL,
  p_heating_types TEXT[] DEFAULT NULL,
  p_mains_gas BOOLEAN DEFAULT NULL,
  p_mains_sewer BOOLEAN DEFAULT NULL,

  -- Tenure
  p_tenures TEXT[] DEFAULT NULL,
  p_max_service_charge INTEGER DEFAULT NULL,
  p_max_ground_rent INTEGER DEFAULT NULL,
  p_min_lease_length INTEGER DEFAULT NULL,

  -- Status
  p_added_within_days INTEGER DEFAULT NULL,
  p_statuses TEXT[] DEFAULT NULL,
  p_price_reduced BOOLEAN DEFAULT NULL,
  p_chain_free BOOLEAN DEFAULT NULL,
  p_max_days_on_market INTEGER DEFAULT NULL,
  p_back_on_market BOOLEAN DEFAULT NULL,

  -- Rental only
  p_furnished TEXT DEFAULT NULL,
  p_pets_allowed BOOLEAN DEFAULT NULL,
  p_bills_included BOOLEAN DEFAULT NULL,

  -- Include/exclude
  p_include_new_builds_only BOOLEAN DEFAULT NULL,
  p_exclude_new_builds BOOLEAN DEFAULT NULL,
  p_include_retirement BOOLEAN DEFAULT NULL,
  p_exclude_retirement BOOLEAN DEFAULT NULL,
  p_include_shared_ownership BOOLEAN DEFAULT NULL,
  p_include_auction BOOLEAN DEFAULT NULL,

  -- Pagination & sort
  p_sort TEXT DEFAULT 'newest',
  p_page INTEGER DEFAULT 1,
  p_per_page INTEGER DEFAULT 20,

  -- User context (for hiding dismissed properties)
  p_user_id UUID DEFAULT NULL
)
RETURNS TABLE (
  -- Return all property fields needed for search result cards and map pins
  id UUID,
  slug TEXT,
  listing_type TEXT,
  status TEXT,
  price INTEGER,
  price_qualifier TEXT,
  property_type TEXT,
  bedrooms INTEGER,
  bathrooms INTEGER,
  reception_rooms INTEGER,
  floor_area_sqft INTEGER,
  address_line_1 TEXT,
  address_town TEXT,
  address_postcode TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  tenure TEXT,
  epc_rating TEXT,
  chain_free BOOLEAN,
  new_build BOOLEAN,
  garden_type TEXT,
  parking_type TEXT,
  primary_image_url TEXT,
  summary TEXT,
  agent_name TEXT,
  agent_logo_url TEXT,
  listed_date TIMESTAMPTZ,
  price_changed_date TIMESTAMPTZ,
  original_price INTEGER,
  days_on_market INTEGER,
  total_count BIGINT  -- total matching results for pagination
) AS $$
DECLARE
  location_bounds RECORD;
  offset_value INTEGER;
  epc_numeric INTEGER;
BEGIN
  -- Calculate offset for pagination
  offset_value := (p_page - 1) * p_per_page;

  -- If location_slug is provided, get the bounds from locations table
  IF p_location_slug IS NOT NULL THEN
    SELECT
      l.bounds_ne_lat, l.bounds_ne_lng, l.bounds_sw_lat, l.bounds_sw_lng,
      l.latitude, l.longitude
    INTO location_bounds
    FROM locations l
    WHERE l.slug = p_location_slug
    OR EXISTS (
      SELECT 1 FROM locations child
      WHERE child.parent_id = l.id
      AND child.slug = p_location_slug
    );
  END IF;

  -- Convert EPC rating to numeric for comparison (A=1, G=7)
  IF p_min_epc IS NOT NULL THEN
    epc_numeric := CASE p_min_epc
      WHEN 'A' THEN 1
      WHEN 'B' THEN 2
      WHEN 'C' THEN 3
      WHEN 'D' THEN 4
      WHEN 'E' THEN 5
      WHEN 'F' THEN 6
      WHEN 'G' THEN 7
      ELSE 7
    END;
  END IF;

  RETURN QUERY
  SELECT
    p.id,
    p.slug,
    p.listing_type,
    p.status,
    p.price,
    p.price_qualifier,
    p.property_type,
    p.bedrooms,
    p.bathrooms,
    p.reception_rooms,
    p.floor_area_sqft,
    p.address_line_1,
    p.address_town,
    p.address_postcode,
    p.latitude,
    p.longitude,
    p.tenure,
    p.epc_rating,
    p.chain_free,
    p.new_build,
    p.garden_type,
    p.parking_type,
    pi.image_url AS primary_image_url,
    p.summary,
    a.name AS agent_name,
    a.logo_url AS agent_logo_url,
    p.listed_date,
    p.price_changed_date,
    p.original_price,
    EXTRACT(DAY FROM NOW() - p.listed_date)::INTEGER AS days_on_market,
    COUNT(*) OVER() AS total_count
  FROM properties p
  LEFT JOIN agents a ON p.agent_id = a.id
  LEFT JOIN property_images pi ON p.id = pi.property_id AND pi.is_primary = true
  LEFT JOIN hidden_properties hp ON p.id = hp.property_id AND hp.user_id = p_user_id
  WHERE
    -- Hidden properties filter
    hp.id IS NULL

    -- Core filters
    AND (p_listing_type IS NULL OR p.listing_type = p_listing_type)
    AND (p_min_price IS NULL OR p.price >= p_min_price)
    AND (p_max_price IS NULL OR p.price <= p_max_price)
    AND (p_min_beds IS NULL OR p.bedrooms >= p_min_beds)
    AND (p_max_beds IS NULL OR p.bedrooms <= p_max_beds)
    AND (p_min_baths IS NULL OR p.bathrooms >= p_min_baths)
    AND (p_min_receptions IS NULL OR p.reception_rooms >= p_min_receptions)
    AND (p_min_floor_area IS NULL OR p.floor_area_sqft >= p_min_floor_area)
    AND (p_max_floor_area IS NULL OR p.floor_area_sqft <= p_max_floor_area)
    AND (p_property_types IS NULL OR p.property_type = ANY(p_property_types))

    -- Location filters
    AND (
      -- Location slug filter (using bounds from locations table)
      (location_bounds IS NULL) OR
      (location_bounds.bounds_ne_lat IS NOT NULL AND
       p.latitude BETWEEN location_bounds.bounds_sw_lat AND location_bounds.bounds_ne_lat AND
       p.longitude BETWEEN location_bounds.bounds_sw_lng AND location_bounds.bounds_ne_lng) OR
      -- Radius filter
      (p_latitude IS NOT NULL AND p_longitude IS NOT NULL AND p_radius_miles IS NOT NULL AND
       ST_DWithin(
         ST_GeogFromWKB(p.location::bytea),
         ST_GeogFromWKB(ST_SetSRID(ST_MakePoint(p_longitude, p_latitude), 4326)::bytea),
         p_radius_miles * 1609.34
       )) OR
      -- Bounding box filter
      (p_bounds_ne_lat IS NOT NULL AND p_bounds_ne_lng IS NOT NULL AND
       p_bounds_sw_lat IS NOT NULL AND p_bounds_sw_lng IS NOT NULL AND
       p.latitude BETWEEN p_bounds_sw_lat AND p_bounds_ne_lat AND
       p.longitude BETWEEN p_bounds_sw_lng AND p_bounds_ne_lng)
    )

    -- Feature filters (only check if explicitly set to true)
    AND (p_period_property IS NULL OR p.period_property = p_period_property)
    AND (p_modern IS NULL OR p.modern = p_modern)
    AND (p_cottage IS NULL OR p.cottage = p_cottage)
    AND (p_fixer_upper IS NULL OR p.fixer_upper = p_fixer_upper)
    AND (p_new_build IS NULL OR p.new_build = p_new_build)
    AND (p_en_suite IS NULL OR p.en_suite = p_en_suite)
    AND (p_bathtub IS NULL OR p.bathtub = p_bathtub)
    AND (p_wet_room IS NULL OR p.wet_room = p_wet_room)
    AND (p_walk_in_wardrobe IS NULL OR p.walk_in_wardrobe = p_walk_in_wardrobe)
    AND (p_kitchen_island IS NULL OR p.kitchen_island = p_kitchen_island)
    AND (p_open_plan_kitchen IS NULL OR p.open_plan_kitchen = p_open_plan_kitchen)
    AND (p_separate_dining_room IS NULL OR p.separate_dining_room = p_separate_dining_room)
    AND (p_utility_room IS NULL OR p.utility_room = p_utility_room)
    AND (p_conservatory IS NULL OR p.conservatory = p_conservatory)
    AND (p_home_office IS NULL OR p.home_office = p_home_office)
    AND (p_basement IS NULL OR p.basement = p_basement)
    AND (p_loft_conversion IS NULL OR p.loft_conversion = p_loft_conversion)
    AND (p_annexe IS NULL OR p.annexe = p_annexe)
    AND (p_downstairs_wc IS NULL OR p.downstairs_wc = p_downstairs_wc)
    AND (p_double_glazing IS NULL OR p.double_glazing = p_double_glazing)
    AND (p_log_burner IS NULL OR p.log_burner = p_log_burner)
    AND (p_solar_panels IS NULL OR p.solar_panels = p_solar_panels)
    AND (p_underfloor_heating IS NULL OR p.underfloor_heating = p_underfloor_heating)
    AND (p_bay_windows IS NULL OR p.bay_windows = p_bay_windows)
    AND (p_bifold_doors IS NULL OR p.bifold_doors = p_bifold_doors)
    AND (p_original_features IS NULL OR p.original_features = p_original_features)
    AND (p_cellar IS NULL OR p.cellar = p_cellar)
    AND (p_garage IS NULL OR p.garage = p_garage)
    AND (p_outbuildings IS NULL OR p.outbuildings = p_outbuildings)
    AND (p_swimming_pool IS NULL OR p.swimming_pool = p_swimming_pool)
    AND (p_balcony IS NULL OR p.balcony = p_balcony)
    AND (p_roof_terrace IS NULL OR p.roof_terrace = p_roof_terrace)
    AND (p_patio IS NULL OR p.patio = p_patio)

    -- Garden & parking
    AND (p_garden_type IS NULL OR p.garden_type = p_garden_type)
    AND (p_garden_orientation IS NULL OR p.garden_orientation = p_garden_orientation)
    AND (p_parking_type IS NULL OR p.parking_type = p_parking_type)
    AND (p_ev_charging IS NULL OR p.ev_charging = p_ev_charging)

    -- Energy
    AND (p_min_epc IS NULL OR
         CASE p.epc_rating
           WHEN 'A' THEN 1
           WHEN 'B' THEN 2
           WHEN 'C' THEN 3
           WHEN 'D' THEN 4
           WHEN 'E' THEN 5
           WHEN 'F' THEN 6
           WHEN 'G' THEN 7
           ELSE 8
         END <= epc_numeric)
    AND (p_heating_types IS NULL OR p.heating_type = ANY(p_heating_types))
    AND (p_mains_gas IS NULL OR p.mains_gas = p_mains_gas)
    AND (p_mains_sewer IS NULL OR p.mains_sewer = p_mains_sewer)

    -- Tenure
    AND (p_tenures IS NULL OR p.tenure = ANY(p_tenures))
    AND (p_max_service_charge IS NULL OR p.service_charge_annual <= p_max_service_charge)
    AND (p_max_ground_rent IS NULL OR p.ground_rent_annual <= p_max_ground_rent)
    AND (p_min_lease_length IS NULL OR p.lease_length_remaining >= p_min_lease_length)

    -- Status filters
    AND (p_added_within_days IS NULL OR p.listed_date >= NOW() - INTERVAL '1 day' * p_added_within_days)
    AND (p_statuses IS NULL OR p.status = ANY(p_statuses))
    AND (p_price_reduced IS NULL OR (p.original_price IS NOT NULL AND p.price < p.original_price) = p_price_reduced)
    AND (p_chain_free IS NULL OR p.chain_free = p_chain_free)
    AND (p_max_days_on_market IS NULL OR EXTRACT(DAY FROM NOW() - p.listed_date) <= p_max_days_on_market)
    AND (p_back_on_market IS NULL OR
         (EXISTS (SELECT 1 FROM property_price_history pph
                 WHERE pph.property_id = p.id
                 AND pph.event_type = 'back_on_market')) = p_back_on_market)

    -- Rental filters
    AND (p_furnished IS NULL OR p.furnished = p_furnished)
    AND (p_pets_allowed IS NULL OR p.pets_allowed = p_pets_allowed)
    AND (p_bills_included IS NULL OR p.bills_included = p_bills_included)

    -- Include/exclude filters
    AND (p_include_new_builds_only IS NULL OR p.new_build = true)
    AND (p_exclude_new_builds IS NULL OR p.new_build = false)

  ORDER BY
    CASE p_sort
      WHEN 'newest' THEN p.listed_date
      WHEN 'oldest' THEN p.listed_date
      ELSE p.listed_date
    END DESC,
    CASE p_sort
      WHEN 'price_low_high' THEN p.price
      WHEN 'price_high_low' THEN p.price
      ELSE NULL
    END ASC,
    CASE p_sort
      WHEN 'price_high_low' THEN p.price
      ELSE NULL
    END DESC,
    CASE p_sort
      WHEN 'most_reduced' THEN
        CASE WHEN p.original_price IS NOT NULL
        THEN (p.original_price - p.price)::DECIMAL / p.original_price
        ELSE 0 END
      ELSE NULL
    END DESC,
    p.id  -- Ensure consistent ordering

  OFFSET offset_value
  LIMIT p_per_page;

END;
$$ LANGUAGE plpgsql;