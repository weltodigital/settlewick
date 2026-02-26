# Settlewick — Claude Code Build Prompt

Build a full-featured UK property portal called **Settlewick** (settlewick.com). This is a Rightmove/Zoopla competitor focused on the UK market, starting in Portsmouth. It must support both **sales** (for-sale properties) and **lettings** (rental properties). The platform serves three user types: **property searchers** (buyers/renters), **estate agents**, and **site admins**.

---

## Tech Stack

- **Framework:** Next.js 14+ (App Router) with TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL with PostGIS extension (for geospatial queries — radius search, map bounds, draw-your-own-area)
- **ORM:** Prisma (with PostGIS support via raw queries where needed)
- **Auth:** NextAuth.js (credentials + Google + email magic link)
- **Maps:** Leaflet with OpenStreetMap tiles (free, no API key needed to start — we can swap to Mapbox later)
- **Image storage:** Local filesystem initially (structured for easy migration to S3/Cloudflare R2 later)
- **Email:** Resend (for alerts and notifications)
- **Search:** PostgreSQL full-text search + trigram indexing
- **Deployment-ready:** Docker Compose config for local development with PostgreSQL + PostGIS

---

## Database Schema

Design a comprehensive PostgreSQL schema with these core entities:

### Properties Table
```
id, slug (URL-friendly), listing_type (sale | rent), status (available | under_offer | sstc | sold | let_agreed | let), 
price (integer, in pence for sales / monthly pence for rentals), price_qualifier (guide_price | offers_over | offers_in_region | fixed_price | from | POA),
property_type (detached | semi_detached | terraced | flat | bungalow | maisonette | cottage | town_house | park_home | land | other),
new_build (boolean), 

-- Address
address_line_1, address_line_2, address_town, address_county, address_postcode,
latitude (decimal), longitude (decimal), location (PostGIS POINT geometry for spatial queries),

-- Core specs
bedrooms (int), bathrooms (int), reception_rooms (int), floor_area_sqft (int, nullable), floor_area_sqm (decimal, nullable),
plot_size_sqft (int, nullable), floor_level (ground | first | second | upper | top | null — for flats),

-- Tenure & leasehold details
tenure (freehold | leasehold | share_of_freehold | commonhold),
lease_length_remaining (int, years, nullable), service_charge_annual (int, pence, nullable), ground_rent_annual (int, pence, nullable),

-- Energy
epc_rating (A | B | C | D | E | F | G | null), epc_potential_rating (same), 
heating_type (gas_central | electric | oil | heat_pump | biomass | district | other | null),
mains_gas (boolean, nullable), mains_sewer (boolean, nullable),
estimated_annual_energy_cost (int, pence, nullable),

-- Outdoor & parking
garden_type (private | communal | none | null), garden_orientation (north | south | east | west | null),
parking_type (driveway | garage | allocated | on_street | none | null), ev_charging (boolean),

-- Property features (boolean flags)
period_property, modern, cottage, fixer_upper, utility_room, basement, conservatory, home_office,
en_suite, bathtub, patio, kitchen_island, loft_conversion, annexe, open_plan_kitchen, 
separate_dining_room, downstairs_wc, double_glazing, log_burner, solar_panels, 
underfloor_heating, wet_room, walk_in_wardrobe, bifold_doors, bay_windows, 
original_features, cellar, garage, outbuildings, swimming_pool, balcony, roof_terrace,

-- Rental-specific
furnished (furnished | unfurnished | part_furnished | null), pets_allowed (boolean, nullable),
bills_included (boolean, nullable), deposit_amount (int, pence, nullable),
available_from (date, nullable), min_tenancy_months (int, nullable),

-- Status & transparency
chain_free (boolean, nullable), 
listed_date (timestamp), price_changed_date (timestamp, nullable),
original_price (int, pence, nullable),

-- Content
description (text), summary (text, short description for cards),

-- Relationships
agent_id (FK to agents), created_by (FK to users), 
created_at, updated_at
```

### Property Images Table
```
id, property_id (FK), image_url, caption, display_order (int), is_floorplan (boolean), is_primary (boolean),
room_tag (kitchen | living_room | bedroom_1 | bedroom_2 | bathroom | garden | exterior | other | null),
created_at
```

### Property Price History Table
```
id, property_id (FK), event_type (listed | price_reduced | price_increased | sstc | under_offer | back_on_market | sold | withdrawn | let_agreed | let),
price (int, pence), date (timestamp), created_at
```

### Agents Table
```
id, name, slug, branch_name, email, phone, website_url, logo_url, 
address_line_1, address_town, address_postcode, latitude, longitude,
description (text), subscription_tier (free | basic | premium),
created_at, updated_at
```

### Users Table
```
id, email, name, password_hash (nullable for social auth), role (user | agent | admin),
agent_id (FK, nullable — links agent users to their agency),
created_at, updated_at
```

### Saved Properties Table
```
id, user_id (FK), property_id (FK), notes (text, nullable), created_at
```

### Hidden Properties Table
```
id, user_id (FK), property_id (FK), reason (too_small | too_expensive | wrong_area | not_interested | other | null), created_at
```

### Saved Searches Table
```
id, user_id (FK), name, search_params (JSONB — stores all filter state), 
alert_enabled (boolean), alert_frequency (instant | daily | weekly),
created_at, updated_at
```

### Property Enquiries Table
```
id, property_id (FK), user_id (FK, nullable), agent_id (FK), 
name, email, phone, message, 
enquiry_type (viewing_request | more_info | general),
status (new | read | responded), created_at
```

### Property Views Table (analytics)
```
id, property_id (FK), user_id (FK, nullable), session_id, viewed_at
```

### Sold Prices Table (from Land Registry data)
```
id, address, postcode, price (int), date_sold (date), property_type, 
new_build (boolean), tenure, latitude, longitude, location (PostGIS POINT),
created_at
```

### Area Guides Table (SEO content)
```
id, slug, name, parent_area (nullable), postcode_prefix,
description (text), latitude, longitude,
average_price (int, nullable), average_rent (int, nullable),
created_at, updated_at
```

Add appropriate indexes: PostGIS spatial indexes on all location columns, btree indexes on price/bedrooms/bathrooms/epc_rating/listing_type/status, GIN index on property features for fast boolean filtering, trigram index on address fields for autocomplete.

---

## Pages & Routes

### Public Pages

**Homepage** (`/`)
- Hero section with prominent search bar (location input with autocomplete, buy/rent toggle)
- "Search properly." tagline
- Featured properties carousel
- Quick links to Portsmouth area guides
- Stats banner (X properties listed, X+ filters available, £0 for agents to list)
- How it works section (for buyers and for agents)
- Newsletter signup
- Clean, modern, premium design — not cluttered like Rightmove. The homepage should feel like a premium British brand. Deep forest green header, warm cream background, brass accents on CTAs. Think Aesop or Farrow & Ball's web presence applied to a property portal.

**Property Search Results** (`/for-sale/[location]` and `/to-rent/[location]`)
- SEO-friendly URLs: `/for-sale/portsmouth`, `/to-rent/southsea`
- Split view: list on left, map on right (desktop) — full list with map toggle on mobile
- Filter panel (collapsible sidebar on desktop, slide-up sheet on mobile) with ALL filters organised into logical groups:
  - **Basics:** Price range, bedrooms, bathrooms, property type
  - **Size & Specs:** Floor area (sqft), reception rooms, floor level (flats), plot size
  - **Property Features:** All boolean feature checkboxes organised in a scrollable grid
  - **Tenure & Costs:** Freehold/leasehold, max service charge, max ground rent, min lease length
  - **Energy & Utilities:** EPC rating (min), heating type, mains gas, mains sewer
  - **Outdoor & Parking:** Garden type, garden orientation, parking type, EV charging
  - **Status:** Chain free, price reduced, new listings, exclude SSTC/under offer, days on market range
  - **Rental Extras** (only shown for lettings): Furnished, pets allowed, bills included, available from, max deposit
  - **Lifestyle:** Max walk time to station, max walk time to school (these can be placeholder UI for now)
- Results count with active filter pills (click to remove)
- Sort: newest, price low-high, price high-low, most reduced, nearest (if location available)
- Property cards showing: primary image, price, bedrooms/bathrooms/sqft badges, address, key features icons, days on market, price reduction badge if applicable, agent logo
- "Hide" button on each card (X icon, moves to hidden, doesn't show again)
- "Viewed" subtle badge on properties the user has clicked into
- Infinite scroll or pagination
- Map shows pins for all results, clicking a pin highlights the card and vice versa
- "Draw area" button on map (let user draw polygon, results filter to within it)
- Persistent filters — switching between list/map view NEVER resets filters
- "Save search" button + "Create alert" button

**Property Listing Detail** (`/property/[slug]`)
- Full-width image gallery with lightbox (swipeable on mobile)
- Floorplan tab in gallery
- Key facts bar: price, bedrooms, bathrooms, sqft, property type, tenure
- "Days on market" badge
- "Price reduced" badge with original price and percentage
- "Chain free" badge
- Description section
- Key features list (all the boolean features that are true, displayed as tags)
- **Running Costs Dashboard** section:
  - Estimated monthly mortgage (editable deposit % and term, default 10% deposit 25yr)
  - Council tax (band + annual amount)
  - Estimated energy costs (monthly, from EPC data)
  - Service charge + ground rent (if leasehold)
  - Total estimated monthly cost
- **EPC section:** Rating displayed as the coloured bar chart (A-G), current + potential
- **Map section:** Property location on map, nearby amenities markers
- **Price History Timeline:** Visual timeline showing listed → reduced → SSTC events with dates and prices
- **Nearby Sold Prices:** Table of recent sold prices on same street/postcode from Land Registry
- **Price per sqft comparison** to local average
- **Local Area section:** 
  - Nearest schools with Ofsted ratings and distance
  - Transport links with walking times
  - Nearest amenities
- **Agent section:** Agent card with logo, name, phone, email, "Request viewing" and "Ask a question" buttons
- **Enquiry form:** Name, email, phone, message, viewing request checkbox
- **Actions:** Save/favourite, share (copy link, email, WhatsApp), print, hide
- **Similar properties** carousel at bottom
- Breadcrumb: Home > For Sale > Portsmouth > Southsea > [Address]
- Full schema.org markup (RealEstateListing)

**Sold Prices** (`/sold-prices/[location]`)
- Search by postcode or street
- Results table: address, price, date, property type, tenure
- Map view of sold prices with colour-coded pins by price range
- Price trends chart for the area (average price over time)
- Link to area guide

**Area Guides** (`/area-guide/[slug]`)
- Overview description
- Average property prices (sale + rent)
- Price trend chart
- Schools nearby with ratings
- Transport links
- What residents say (placeholder for community reviews)
- Current properties for sale / to rent in this area (dynamic links)
- Nearby areas

**Stamp Duty Calculator** (`/stamp-duty-calculator`)
- Interactive calculator
- First-time buyer toggle
- Additional property toggle
- England/Wales rates (current 2025-2026 rates)
- Results breakdown by band
- Schema.org FAQPage markup for SEO

**Mortgage Calculator** (`/mortgage-calculator`)
- Property price input
- Deposit amount/percentage
- Interest rate (default to current average, editable)
- Term (years)
- Monthly payment result
- Affordability check (income input, shows if affordable at 4.5x multiplier)
- Amortisation schedule table

**About / How it Works** (`/about`)
- For buyers: what makes Settlewick different
- For agents: why list with us, pricing (free to start)
- Our story (Portsmouth-born, newsletter connection)

**Contact** (`/contact`)
- Contact form
- Email address
- For agents CTA

### Auth Pages
- `/auth/signin` — email/password + Google + magic link
- `/auth/register` — name, email, password, role selection (buyer/renter or agent)
- `/auth/forgot-password`

### User Dashboard (`/dashboard`)
- **Saved Properties** tab: grid of saved properties with notes, remove button, "compare" checkbox
- **Hidden Properties** tab: list of hidden properties with "unhide" option
- **Saved Searches** tab: list of saved searches with alert toggle (instant/daily/weekly)
- **My Enquiries** tab: list of enquiries sent
- **Search History** tab: recent searches
- **Property Comparison** page: side-by-side table comparing 2-4 selected properties on all specs
- **Account Settings:** name, email, password, notification preferences, delete account

### Agent Dashboard (`/agent`)
- **My Listings** tab: all properties listed by this agent, with status, views, saves, enquiries counts
- **Add New Listing** page: comprehensive form with ALL property fields from the schema, image upload (drag & drop, reorder), floorplan upload, preview before publish
- **Edit Listing** page: same form, pre-populated
- **Enquiries** tab: all enquiries received, mark as read/responded, reply
- **Analytics** tab: views over time chart, saves over time, enquiry conversion rate, top performing listings
- **Agency Profile** page: edit agency details, logo, description

### Admin Dashboard (`/admin`)
- **Properties** tab: all properties, approve/reject, edit, delete
- **Agents** tab: all agents, approve/reject, edit subscription tier
- **Users** tab: all users
- **Sold Prices** tab: import Land Registry CSV data
- **Area Guides** tab: create/edit area guides
- **Analytics** tab: site-wide stats (total listings, total users, total enquiries, views)

---

## Design System

**Brand colours (Forest & Brass — premium British feel):**
- Primary: Deep forest green (#1B3A2D)
- Primary light: Muted forest (#2D5E4A) — for hover states, secondary buttons
- Accent: Aged brass/gold (#B5985A) — for CTAs, highlights, active states, badges
- Accent light: Soft gold (#D4C5A0) — for subtle highlights, borders
- Secondary: Warm linen (#EDE8E0) — for cards, panels, secondary backgrounds
- Background: Soft cream (#FAFAF6) — main page background
- Surface: White (#FFFFFF) — for cards, modals, inputs
- Text primary: Deep charcoal (#2A2A28)
- Text secondary: Warm grey (#6B6560)
- Text muted: (#9B9590)
- Border: (#DDD6CE)
- Success: Forest green (#27AE60)
- Warning: Amber (#D4A03C)
- Error: Muted red (#C0392B)
- EPC colours: standard green-to-red gradient for A-G ratings
- Property status badges: Brass background with dark text for "Price Reduced", "Chain Free", "New", "Back on Market"

**Typography:**
- Headings: Inter (or similar clean sans-serif from Google Fonts)
- Body: Inter
- Clean, generous whitespace — the opposite of Rightmove's cramped layout

**Design principles:**
- Mobile-first responsive design
- Clean and modern with a heritage/premium feel — think a well-designed British brand, not a Silicon Valley startup
- Generous whitespace
- The forest green should be used for the header, footer, and primary buttons — it's the colour people associate with Settlewick
- Brass/gold is the accent — used sparingly for CTAs, active states, badges, and highlights. It should feel special, not overdone
- The warm linen and cream backgrounds give the site warmth — never use stark white (#FFF) as a page background, always the soft cream (#FAFAF6)
- Property cards should be white (#FFF) on the cream background for subtle contrast
- Clear visual hierarchy
- Fast — aim for sub-2-second page loads
- Accessible (WCAG 2.1 AA — ensure sufficient contrast on the deep green)
- Trust signals throughout (transparency, data, clean design)
- The overall vibe should feel like: "this is what a property portal looks like when it's built properly"

**Key UI components to build:**
- PropertyCard (used in search results, similar properties, etc.)
- PropertyFilterPanel (the comprehensive filter sidebar/sheet)
- MapView (Leaflet map with property pins, draw-area tool, cluster markers)
- ImageGallery (lightbox, swipeable, floorplan tab)
- PriceHistoryTimeline (visual timeline component)
- RunningCostsDashboard (interactive cost breakdown)
- EPCRatingBar (the coloured A-G bar chart)
- MortgageCalculator (interactive with sliders)
- StampDutyCalculator (interactive with band breakdown)
- AgentCard (logo, name, contact details)
- SearchAutocomplete (location input with suggestions — postcodes, areas, streets)
- ComparisonTable (side-by-side property comparison)
- FilterPill (active filter with X to remove)

---

## Seed Data

Create a seed script that generates **50 realistic Portsmouth properties** (40 for sale, 10 to rent) across different areas (Southsea, Old Portsmouth, Fratton, Copnor, Hilsea, Cosham, North End, Eastney, Milton, Baffins). Each property should have:
- Realistic Portsmouth addresses and postcodes (PO1-PO6)
- Realistic prices for the area (£150k-£600k for sales, £600-£2000/month for rentals)  
- Varied property types, bedroom counts, features
- Placeholder image URLs (use https://placehold.co/800x600/e2e8f0/64748b?text=Property+Photo or similar)
- Floorplan placeholder images
- Realistic descriptions mentioning Portsmouth landmarks and areas
- Full EPC data, tenure details, running costs
- Some with price reductions, some chain-free, varied days on market
- At least 3 different dummy estate agents

Also seed:
- 200+ sold prices from realistic Portsmouth addresses (last 2 years)
- 10 Portsmouth area guides (Southsea, Old Portsmouth, Fratton, Copnor, Hilsea, Cosham, North End, Eastney, Milton, Baffins)
- Admin user (admin@settlewick.com / admin123)
- Test agent user
- Test buyer user

---

## API Routes

Build Next.js API routes (or Server Actions) for:

- `GET /api/properties` — search with all filters, pagination, geospatial queries, text search
- `GET /api/properties/[slug]` — single property with all relations
- `POST /api/properties` — create (agent/admin only)
- `PUT /api/properties/[id]` — update (agent owner/admin only)
- `DELETE /api/properties/[id]` — soft delete
- `POST /api/properties/[id]/enquiry` — send enquiry
- `GET /api/properties/[id]/similar` — similar properties
- `POST /api/user/saved-properties` — save a property
- `DELETE /api/user/saved-properties/[id]` — unsave
- `POST /api/user/hidden-properties` — hide a property
- `DELETE /api/user/hidden-properties/[id]` — unhide
- `GET /api/user/saved-searches` — get saved searches
- `POST /api/user/saved-searches` — create saved search
- `GET /api/sold-prices` — search sold prices by location
- `GET /api/areas/[slug]` — area guide data
- `GET /api/autocomplete` — location autocomplete
- `GET /api/agent/listings` — agent's own listings
- `GET /api/agent/enquiries` — agent's enquiries
- `GET /api/agent/analytics` — agent analytics data
- `GET /api/admin/stats` — admin dashboard stats

All property search queries must:
- Respect hidden properties (exclude for logged-in users)
- Support PostGIS radius search (lat/lng + radius in miles)
- Support PostGIS bounding box search (for map viewport)
- Support PostGIS polygon search (for draw-your-own-area)
- Support all filters simultaneously with AND logic
- Return results with pagination (20 per page)
- Include aggregation counts (total results matching current filters)

---

## SEO Requirements

- Server-side rendered pages (Next.js SSR/SSG where appropriate)
- Dynamic meta titles and descriptions for every page:
  - Search: "3 Bedroom Houses for Sale in Southsea, Portsmouth | Settlewick"
  - Listing: "[Address] — [Beds] Bed [Type] for Sale, £[Price] | Settlewick"
  - Area guide: "Living in Southsea, Portsmouth — Area Guide | Settlewick"
  - Sold prices: "Sold House Prices in PO4, Southsea | Settlewick"
- Schema.org structured data (RealEstateListing on property pages, LocalBusiness on homepage, FAQPage on calculators)
- XML sitemap generation (`/sitemap.xml`)
- robots.txt
- Canonical URLs
- Open Graph + Twitter Card meta tags for social sharing
- Breadcrumb navigation with BreadcrumbList schema
- Clean URL structure with human-readable slugs
- Next.js Image component for optimised image loading

---

## Important Implementation Notes

1. **Start with the database schema and seed data** — get the data model right first, everything else flows from it
2. **The filter system is the most important feature** — this is Settlewick's entire competitive advantage. The filter panel must be comprehensive, well-organised, fast, and must NEVER reset when switching views
3. **Mobile-first** — most property browsing is on mobile. The filter panel should be a slide-up bottom sheet on mobile
4. **Map and list must stay in sync** — selecting a property on the map highlights it in the list and vice versa
5. **URL state** — all filter state should be reflected in the URL (query params) so searches are shareable and bookmarkable
6. **Performance** — property search must be fast. Use database indexes aggressively. Paginate. Don't load all properties at once
7. **The homepage should NOT look like Rightmove** — it should feel modern, clean, and premium. Think Airbnb's clean aesthetic applied to a UK property portal
8. **Progressive enhancement** — the site should work without JavaScript for basic search (SEO), but enhance with JS for map, filters, etc.

---

## File Structure

```
settlewick/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── src/
│   ├── app/
│   │   ├── layout.tsx (root layout with nav, footer)
│   │   ├── page.tsx (homepage)
│   │   ├── for-sale/
│   │   │   └── [location]/page.tsx (sales search results)
│   │   ├── to-rent/
│   │   │   └── [location]/page.tsx (lettings search results)
│   │   ├── property/
│   │   │   └── [slug]/page.tsx (property detail)
│   │   ├── sold-prices/
│   │   │   └── [location]/page.tsx
│   │   ├── area-guide/
│   │   │   └── [slug]/page.tsx
│   │   ├── stamp-duty-calculator/page.tsx
│   │   ├── mortgage-calculator/page.tsx
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── auth/
│   │   │   ├── signin/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── dashboard/
│   │   │   ├── page.tsx (saved properties)
│   │   │   ├── hidden/page.tsx
│   │   │   ├── searches/page.tsx
│   │   │   ├── compare/page.tsx
│   │   │   └── settings/page.tsx
│   │   ├── agent/
│   │   │   ├── page.tsx (agent dashboard)
│   │   │   ├── listings/new/page.tsx
│   │   │   ├── listings/[id]/edit/page.tsx
│   │   │   ├── enquiries/page.tsx
│   │   │   └── analytics/page.tsx
│   │   ├── admin/
│   │   │   ├── page.tsx
│   │   │   ├── properties/page.tsx
│   │   │   ├── agents/page.tsx
│   │   │   ├── users/page.tsx
│   │   │   ├── sold-prices/page.tsx
│   │   │   └── area-guides/page.tsx
│   │   └── api/
│   │       ├── properties/
│   │       ├── user/
│   │       ├── agent/
│   │       ├── admin/
│   │       ├── sold-prices/
│   │       ├── areas/
│   │       └── autocomplete/
│   ├── components/
│   │   ├── ui/ (buttons, inputs, modals, badges, etc.)
│   │   ├── property/ (PropertyCard, ImageGallery, PriceHistoryTimeline, etc.)
│   │   ├── search/ (FilterPanel, SearchAutocomplete, FilterPill, SortDropdown, etc.)
│   │   ├── map/ (MapView, DrawAreaTool, PropertyPin, etc.)
│   │   ├── calculators/ (MortgageCalculator, StampDutyCalculator, RunningCosts)
│   │   ├── layout/ (Header, Footer, Breadcrumbs, MobileNav)
│   │   └── dashboard/ (SavedPropertyCard, ComparisonTable, etc.)
│   ├── lib/
│   │   ├── db.ts (Prisma client)
│   │   ├── auth.ts (NextAuth config)
│   │   ├── filters.ts (filter types, parsing, URL serialization)
│   │   ├── geo.ts (PostGIS query helpers)
│   │   ├── format.ts (price formatting £125,000 / £1,200 pcm, etc.)
│   │   └── seo.ts (meta tag generators, schema.org helpers)
│   ├── hooks/
│   │   ├── useFilters.ts (filter state management + URL sync)
│   │   ├── useMap.ts (map state)
│   │   └── usePropertySearch.ts (search API integration)
│   └── types/
│       ├── property.ts
│       ├── filters.ts
│       └── api.ts
├── public/
│   ├── images/ (logo, og-image, etc.)
│   └── fonts/
├── docker-compose.yml (PostgreSQL + PostGIS)
├── .env.example
├── tailwind.config.ts
├── next.config.js
└── package.json
```

---

## What to Build First (Suggested Order)

1. Project setup (Next.js, Tailwind, Prisma, Docker PostgreSQL)
2. Database schema + seed data
3. Homepage with search bar
4. Property search results page with ALL filters + list view
5. Map view integration
6. Property detail page with all sections
7. Auth (register, login)
8. User dashboard (saves, hidden, searches)
9. Agent dashboard (listings CRUD, enquiries)
10. Sold prices pages
11. Area guide pages
12. Calculators (stamp duty, mortgage)
13. Admin dashboard
14. SEO (sitemaps, schema markup, meta tags)

Build it step by step but aim for a fully working end-to-end flow as quickly as possible — a user should be able to search, filter, view a property, and save it within the first few build steps.
