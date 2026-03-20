# Settlewick — Phase 2 Build Prompt: UK-Wide Architecture, Complete Filters & SEO

This prompt addresses three critical priorities for the Settlewick property portal (settlewick.co.uk). The site is built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Supabase (PostgreSQL + Auth + Storage), and deployed on Vercel.

---

## PRIORITY 1: UK-Wide Site Architecture

The site must feel and function like a national UK property portal, even though we're launching with Portsmouth listings first. No page, URL, heading, or piece of copy should suggest this is a Portsmouth-only site.

### URL Structure (SEO-critical)

The URL structure must support any UK location at every level of the hierarchy:

**For Sale:**
```
/for-sale                                    → UK-wide sales search landing
/for-sale/portsmouth                         → City level
/for-sale/portsmouth/southsea               → Area/neighbourhood level
/for-sale/portsmouth/southsea/albert-road   → Street level (future)
/for-sale/hampshire                          → County level
/for-sale/south-east                         → Region level (future)
```

**To Rent:**
```
/to-rent                                     → UK-wide lettings search landing
/to-rent/portsmouth                          → City level
/to-rent/portsmouth/southsea                → Area level
/to-rent/hampshire                           → County level
```

**Sold Prices:**
```
/sold-prices                                 → UK-wide sold prices landing
/sold-prices/portsmouth                      → City level
/sold-prices/po1                             → Postcode district level
/sold-prices/po1-1aa                         → Full postcode level (future)
```

**Area Guides:**
```
/area-guide/portsmouth                       → City guide
/area-guide/portsmouth/southsea             → Neighbourhood guide
/area-guide/hampshire                        → County guide
```

### Location Data Architecture

Create a `locations` table in Supabase to power search, autocomplete, URLs, and SEO pages:

```sql
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

CREATE INDEX idx_locations_slug ON locations(slug);
CREATE INDEX idx_locations_type ON locations(location_type);
CREATE INDEX idx_locations_parent ON locations(parent_id);
CREATE INDEX idx_locations_postcode ON locations(postcode_prefix);
```

**Seed this with a comprehensive UK location hierarchy.** Start with full detail for Portsmouth and Hampshire, but include at minimum:
- All UK regions (South East, South West, London, East, West Midlands, East Midlands, North West, North East, Yorkshire, Wales, Scotland)
- All counties within each region
- All major cities and towns (at least the top 100 UK cities/towns by population)
- For Portsmouth specifically: every neighbourhood (Southsea, Old Portsmouth, Fratton, Copnor, Hilsea, Cosham, Drayton, Farlington, Anchorage Park, North End, Eastney, Milton, Baffins, Stamshaw, Tipner, Landport, Somers Town, Portsea, Paulsgrove, Wymering, Port Solent)
- For Portsmouth: all postcode districts (PO1, PO2, PO3, PO4, PO5, PO6)
- For Hampshire: all major towns (Southampton, Winchester, Fareham, Gosport, Havant, Basingstoke, Andover, Alton, Petersfield, Romsey, Eastleigh, etc.)

This location data powers:
1. Search autocomplete (user types "south" → shows Southsea, Southampton, South East, etc.)
2. SEO page generation (every location gets a for-sale, to-rent, sold-prices, and area-guide page)
3. Breadcrumb navigation (Home > For Sale > Hampshire > Portsmouth > Southsea)
4. URL routing

### Search Autocomplete

The location search bar (used on homepage and in search pages) must:
- Search against the `locations` table using trigram matching for fuzzy search
- Also search against UK postcodes (user types "PO1 3" → suggests "PO1 3AX", etc.)
- Show results grouped by type: "Locations" (areas/cities) and "Postcodes"
- Show the parent location in grey text: "Southsea, Portsmouth" or "Fratton, Portsmouth"
- Be fast (debounced, 200ms delay, cancels previous requests)
- Work on homepage hero search AND on search results page filter bar

Create a Supabase RPC function for this:
```sql
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
```

### Homepage Changes

The homepage must NOT mention Portsmouth specifically. It should say:

- Hero heading: "Search properly." or "Find home, not just houses."
- Hero subheading: "The UK property search with every filter you've ever wished for."
- Search bar: Location input (autocomplete) + Buy/Rent toggle + Search button
- Below hero: "Properties for sale across the UK" with popular location links (London, Manchester, Birmingham, Portsmouth, Bristol, Leeds, etc.)
- Featured properties section can show Portsmouth properties but labelled by area, not "Featured Portsmouth Properties"
- Stats bar: "X properties | 50+ search filters | Free for agents"

### Header & Navigation

```
Logo (left)

Nav links (centre):
- For Sale (dropdown: Search, New homes, Sold prices)
- To Rent (dropdown: Search, Student, Short lets - future)
- House Prices (sold prices tool)
- Find Agents
- Area Guides

Tools (right):
- Stamp Duty Calculator
- Mortgage Calculator

Auth (far right):
- Sign In / Register
- Or: user avatar dropdown (Dashboard, Saved, Settings, Sign Out)
```

### Footer

```
For Sale: Popular cities (London, Manchester, Birmingham, Portsmouth, Bristol, Leeds, Edinburgh, etc.)
To Rent: Popular cities (same)
Tools: Stamp Duty Calculator, Mortgage Calculator, Property Valuation
Company: About, Contact, For Agents, Blog, Careers (future)
Legal: Privacy Policy, Terms, Cookie Policy, Complaints
```

### SEO Meta Titles

Every search results page gets a dynamic meta title:
- `/for-sale/portsmouth` → "Property for Sale in Portsmouth | Settlewick"
- `/for-sale/portsmouth/southsea` → "Property for Sale in Southsea, Portsmouth | Settlewick"
- `/to-rent/portsmouth` → "Property to Rent in Portsmouth | Settlewick"
- `/sold-prices/po1` → "Sold House Prices in PO1, Portsmouth | Settlewick"
- `/area-guide/portsmouth/southsea` → "Living in Southsea, Portsmouth — Area Guide | Settlewick"

### "No Listings Yet" Handling

For locations outside Portsmouth that won't have listings yet:
- Still show the page (important for SEO indexing)
- Show "No properties currently listed in [Location]. Be the first agent to list — it's free."
- Show nearby sold prices from Land Registry data
- Show the area guide content
- Show a "Register for alerts" CTA so users can be notified when properties are listed
- Show links to nearby areas that DO have listings
- NEVER show a 404 for a valid UK location

---

## PRIORITY 2: Complete Filter System

The filter system is Settlewick's entire USP. Every single filter below must be:
1. Present in the filter panel UI
2. Wired to the database query
3. Reflected in the URL query parameters (for shareable/bookmarkable searches)
4. Functional (actually filters results correctly)
5. Persistent (NEVER resets when switching between list/map view or paginating)

### Filter Panel Layout

The filter panel should be organised into collapsible sections. On desktop it's a sidebar (left side, sticky, scrollable). On mobile it's a slide-up bottom sheet triggered by a "Filters" button showing the count of active filters.

**Section 1: Price & Size**
- Price range: min and max dropdowns with preset values
  - For sale: £50k, £75k, £100k, £125k, £150k, £175k, £200k, £225k, £250k, £275k, £300k, £325k, £350k, £375k, £400k, £450k, £500k, £550k, £600k, £650k, £700k, £750k, £800k, £900k, £1m, £1.25m, £1.5m, £2m, £3m, £5m+
  - To rent: £300, £400, £500, £600, £700, £800, £900, £1000, £1250, £1500, £1750, £2000, £2500, £3000, £4000, £5000+ pcm
- Bedrooms: min and max (Studio, 1, 2, 3, 4, 5, 6, 7+)
- Bathrooms: min and max (1, 2, 3, 4, 5+)
- Reception rooms: min (1, 2, 3, 4+)
- Floor area: min and max sqft (with sqft/sqm toggle)
  - Presets: 250, 500, 750, 1000, 1250, 1500, 2000, 2500, 3000, 4000, 5000+ sqft
- Plot size: min sqft (for houses/land)

**Section 2: Property Type**
- Checkboxes: Detached, Semi-detached, Terraced, Flat/Apartment, Bungalow, Maisonette, Cottage, Town house, Park home, Land, Other
- Multi-select (can pick multiple types)

**Section 3: Property Features**
Organised in a 2-column grid of checkboxes:
- Period property
- Modern
- Cottage
- Fixer upper
- New build
- En-suite
- Bathtub
- Wet room
- Walk-in wardrobe
- Kitchen island
- Open-plan kitchen
- Separate dining room
- Utility room
- Conservatory
- Home office
- Basement / cellar
- Loft conversion
- Annexe / granny flat
- Downstairs WC
- Double glazing
- Log burner / wood stove
- Underfloor heating
- Bay windows
- Bi-fold doors
- Original features
- Balcony
- Roof terrace
- Patio
- Swimming pool
- Outbuildings / shed
- Garage (the building, separate from parking filter)

**Section 4: Outdoor Space & Parking**
- Garden: Any / Private garden / Communal garden / No garden
- Garden orientation: Any / South-facing / East-facing / West-facing / North-facing
- Parking: Any / Driveway / Garage / Allocated space / On-street only / No parking
- EV charging: Yes only (checkbox)

**Section 5: Energy & Utilities**
- EPC rating: Minimum rating dropdown (A, B, C, D, E, F, G)
- Heating type: Checkboxes (Gas central heating, Electric, Oil, Heat pump, Other)
- Mains gas: Yes only (checkbox)
- Mains sewer: Yes only (checkbox)

**Section 6: Tenure & Costs**
- Tenure: Any / Freehold only / Leasehold only / Share of freehold
- Max service charge: dropdown (£500, £1000, £1500, £2000, £2500, £3000, £4000, £5000+ per year)
- Max ground rent: dropdown (£100, £200, £300, £500, £750, £1000+ per year)
- Min lease length remaining: dropdown (80, 90, 100, 125, 150, 200, 500+ years)

**Section 7: Listing Status**
- Added to site: Any / Last 24 hours / Last 3 days / Last 7 days / Last 14 days / Last 30 days
- Property status: Available / Under offer / SSTC / Sold (checkboxes, default: available only)
- Price reduced: Yes only (checkbox)
- Chain free: Yes only (checkbox)
- Days on market: max dropdown (7, 14, 30, 60, 90, 180, 365+ days)
- Back on market: Yes only (checkbox)

**Section 8: Rental Only** (shown only when listing_type = rent)
- Furnished: Any / Furnished / Unfurnished / Part-furnished
- Pets allowed: Yes only (checkbox)
- Bills included: Yes only (checkbox)
- Available from: date picker
- Max deposit: dropdown (2 weeks, 4 weeks, 5 weeks, 6 weeks)

**Section 9: Include / Exclude**
- Include: New builds only, Retirement homes, Shared ownership, Auction properties
- Exclude: New builds, Retirement homes

**Section 10: Sort By** (not in the filter panel, in the results header)
- Newest listed
- Oldest listed  
- Price: low to high
- Price: high to low
- Most reduced
- Most popular (by views — future)

### Filter Behaviour Requirements

**URL Sync:** Every filter change updates the URL query parameters immediately. Example:
```
/for-sale/portsmouth?minPrice=200000&maxPrice=350000&minBeds=3&bathrooms=2&epc=C&garden=private&chainFree=true&sort=newest
```

**Persistent State:** Filters must NEVER reset when:
- Switching between list view and map view
- Clicking into a property and pressing back
- Paginating through results
- Resizing the browser window

**Active Filter Pills:** Show active filters as pills/tags above the results with an X to remove each one. Show "Clear all filters" link when any filters are active.

**Filter Counts:** Show the total number of matching results that update as filters change. If possible, show counts next to filter options (e.g. "3 bed (24)" ).

**Mobile UX:**
- "Filters (3)" button showing count of active filters
- Tapping opens a full-screen or bottom-sheet filter panel
- "Show X results" button at bottom to apply and close
- "Clear all" button in the header of the filter panel

### Database Query

Create a comprehensive Supabase RPC function that accepts ALL filter parameters and returns matching properties efficiently:

```sql
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
-- Implementation: build dynamic WHERE clause from all non-null parameters
-- Use PostGIS ST_DWithin for radius search, ST_MakeEnvelope for bounds
-- Join against property_images for primary image
-- Join against agents for agent info
-- LEFT JOIN against hidden_properties to exclude user's hidden listings
-- Calculate days_on_market as EXTRACT(DAY FROM NOW() - listed_date)
-- For EPC rating filter, convert letter to number for comparison (A=1, G=7)
-- Use window function COUNT(*) OVER() for total_count
$$ LANGUAGE plpgsql;
```

This single function handles ALL search queries across the entire site. The Next.js API route passes through whatever filters the user has set, and nulls for everything else.

### Ensuring Filters Actually Work

For EVERY filter listed above, verify:
1. The database column exists and is properly typed
2. The seed data includes varied values (some properties with south-facing gardens, some without; some with EPC A, some with D; etc.)
3. The filter UI element exists in the filter panel
4. Changing the filter triggers a new query
5. The query parameter appears in the URL
6. The results actually change (narrowing when filter applied, widening when removed)
7. The active filter pill appears and removing it restores results

**Test scenario to verify:** Set filters to 3+ bedrooms, 2+ bathrooms, EPC C or above, private garden, south-facing, freehold, chain free, gas central heating. The results should narrow with each filter. Removing any filter should widen results.

---

## PRIORITY 3: SEO Pages

These pages need to exist NOW, even before we have real listings, because:
- Google needs time to crawl and index them (weeks/months)
- They target high-value search queries that bring free traffic
- They make the site feel complete and authoritative
- They're useful to visitors even without listings (sold prices, area info, calculators)

### 3A. Area Guide Pages (`/area-guide/[...slug]`)

Create an area guide page for every location in the `locations` table. Each page contains:

**Hero section:**
- Area name as H1: "Living in Southsea, Portsmouth"
- Breadcrumb: Home > Area Guides > Hampshire > Portsmouth > Southsea
- Hero stat bar: Average house price | Average rent | Properties for sale | Properties to rent

**Overview section:**
- Description text (from locations table, or generated placeholder)
- For Portsmouth areas, write genuine, useful descriptions (you know the city)
- For other areas, use a template: "[Area] is a [type] in [parent area], [county]. The average property price in [Area] is £X based on recent sold prices."

**Property Prices section:**
- Average prices by property type (detached, semi, terraced, flat) — from sold_prices table
- Price trend chart (last 5 years if data available)
- Recent sold prices table (last 10 sales)
- Link to full sold prices page

**Schools section:**
- List of nearest schools with Ofsted rating, type (primary/secondary), and distance
- Data source: placeholder data initially, later from Get Information About Schools API

**Transport section:**
- Nearest train stations with distance
- Nearest motorway junctions
- Travel time to nearest city centre

**Properties section:**
- "Properties for sale in [Area]" with count and link to search
- "Properties to rent in [Area]" with count and link to search
- Show 4-6 property cards if listings exist, or "No properties currently listed" with alert signup

**Nearby areas section:**
- Links to sibling area guides (other neighbourhoods in same city)

**SEO:**
- Title: "Living in [Area], [Parent] — Area Guide | Settlewick"
- Meta description: "Discover what it's like to live in [Area]. Average house prices, schools, transport links, and properties for sale and rent in [Area], [Parent]."
- Schema.org: Place schema with geo coordinates
- Canonical URL

### 3B. Sold Prices Pages (`/sold-prices/[...slug]`)

Create a sold prices page for every location and postcode district.

**Content:**
- H1: "Sold House Prices in [Location]"
- Search bar to look up a specific address or postcode
- Summary stats: total sales in last 12 months, average price, price change YoY
- Results table: address, price, date, property type, tenure — sortable by each column
- Map view showing sold prices as colour-coded pins
- Price distribution chart (bar chart of price ranges)
- Link to area guide

**Data:**
- Seed the `sold_prices` table with realistic data for Portsmouth postcodes (PO1-PO6)
- Generate 500+ realistic sold price records spanning the last 3 years
- For other locations, show "Sold price data coming soon" with alert signup

**SEO:**
- Title: "Sold House Prices in [Location] | Settlewick"
- Meta description: "See recent sold house prices in [Location]. [X] properties sold in the last 12 months with an average price of £[X]."

### 3C. Stamp Duty Calculator (`/stamp-duty-calculator`)

A fully interactive stamp duty calculator page designed to rank for "stamp duty calculator" searches.

**Calculator features:**
- Property price input (large, prominent)
- Buyer type toggle: Standard / First-time buyer / Additional property / Non-UK resident
- England & Wales rates (current 2025/2026 rates)
- Results: total stamp duty, effective rate, breakdown by band in a clear table
- "What is stamp duty?" explainer section with FAQ
- "Stamp duty rates" table showing all current bands
- Link to mortgage calculator

**Current stamp duty rates (England, from April 2025):**

Standard rates:
- Up to £125,000: 0%
- £125,001 to £250,000: 2%
- £250,001 to £925,000: 5%
- £925,001 to £1,500,000: 10%
- Over £1,500,000: 12%

First-time buyer rates:
- Up to £300,000: 0%
- £300,001 to £500,000: 5%
- Properties over £500,000: standard rates apply

Additional property surcharge: +5% on top of standard rates
Non-UK resident surcharge: +2% on top of applicable rates

**SEO:**
- Title: "Stamp Duty Calculator 2026 — How Much Will You Pay? | Settlewick"
- Meta description: "Calculate stamp duty on your property purchase. Free stamp duty calculator for England & Wales with first-time buyer, additional property and non-UK resident rates."
- Schema.org: FAQPage schema for the FAQ section
- Aim to rank for: "stamp duty calculator", "stamp duty calculator 2026", "how much is stamp duty"

### 3D. Mortgage Calculator (`/mortgage-calculator`)

**Calculator features:**
- Property price input
- Deposit amount (£ and % with toggle)
- Interest rate (default to ~5%, editable with 0.1% step)
- Mortgage term (years, default 25, slider 5-40)
- Repayment type: Repayment / Interest-only toggle
- Results: monthly payment (large, prominent), total cost over term, total interest paid
- Affordability section: "What salary do you need?" (based on 4.5x multiplier)
- Comparison table showing payments at different rates (+/- 1-2%)
- "What is a mortgage?" explainer with FAQ

**SEO:**
- Title: "Mortgage Calculator 2026 — Monthly Payment Calculator | Settlewick"
- Schema.org: FAQPage schema

### 3E. XML Sitemap (`/sitemap.xml`)

Generate a dynamic XML sitemap that includes:
- Homepage
- All for-sale location pages (from locations table)
- All to-rent location pages
- All property detail pages
- All sold-prices location pages
- All area guide pages
- Stamp duty calculator
- Mortgage calculator
- About, contact pages

Use Next.js `sitemap.ts` in the app directory. Prioritise:
- Homepage: priority 1.0
- Search landing pages: priority 0.9
- Property detail pages: priority 0.8
- Area guides: priority 0.7
- Tools: priority 0.6

Submit to Google Search Console once deployed.

### 3F. Robots.txt

```
User-agent: *
Allow: /
Disallow: /dashboard/
Disallow: /agent/
Disallow: /admin/
Disallow: /api/
Disallow: /auth/

Sitemap: https://www.settlewick.co.uk/sitemap.xml
```

### 3G. Structured Data (Schema.org)

Add JSON-LD structured data to:
- **Homepage:** WebSite schema with SearchAction (enables Google sitelinks search box)
- **Property pages:** RealEstateListing schema with price, address, features
- **Area guides:** Place schema with geo coordinates and aggregateRating (future)
- **Calculators:** FAQPage schema for the FAQ sections
- **Search results:** ItemList schema (optional but good)
- **All pages:** BreadcrumbList schema

---

## Seed Data Updates

Update the seed script to include:

1. **Locations:** Full UK hierarchy as described above (regions → counties → cities → neighbourhoods → postcode districts). Minimum 200 locations, with full detail for Hampshire/Portsmouth.

2. **Properties:** Keep the 50 Portsmouth properties but ensure EVERY filter has coverage:
   - At least 5 properties with EPC A or B
   - At least 5 with south-facing gardens
   - At least 10 freehold, 10 leasehold (with service charge and ground rent filled in)
   - At least 5 chain-free
   - At least 5 with price reductions (with original_price set)
   - At least 5 new builds
   - At least 5 with each parking type
   - At least 3 with solar panels, 3 with log burners, 3 with home offices, etc.
   - Varied floor areas from 400 sqft to 3000 sqft
   - Mix of 1-bed flats through to 5-bed detached houses
   - 10 rental listings with varied furnished/pets/bills status
   - At least 3 different agents

3. **Sold Prices:** 500+ records for Portsmouth postcodes (PO1-PO6), spanning 2023-2026, with realistic prices.

4. **Area Guides:** Written descriptions for all Portsmouth neighbourhoods. Template descriptions for Hampshire towns and UK cities.

---

## Build Order

1. Create the `locations` table, seed with UK location data
2. Build the autocomplete search function and wire it to the search bar
3. Update URL routing to support the UK-wide slug structure
4. Update homepage to be UK-wide (remove any Portsmouth-specific copy)
5. Update navigation header and footer for UK-wide site
6. Implement the COMPLETE filter panel with all sections and all filters
7. Create the `search_properties` RPC function with all filter parameters
8. Wire every filter to the query and verify each one works
9. Ensure URL sync, filter persistence, and active filter pills all work
10. Build the stamp duty calculator page
11. Build the mortgage calculator page
12. Build the area guide page template
13. Build the sold prices page template
14. Update seed data for full filter coverage
15. Generate XML sitemap
16. Add robots.txt
17. Add Schema.org structured data to all pages
18. Add proper meta titles and descriptions to all pages
19. Handle "no listings" state gracefully for locations without properties
20. Test every filter end-to-end
