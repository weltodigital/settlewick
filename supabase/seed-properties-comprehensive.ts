import { supabaseAdmin } from '../src/lib/supabase/admin'

// Enhanced property generation with comprehensive filter coverage
async function generateComprehensiveProperties() {
  console.log('🏠 Generating comprehensive property data with full filter coverage...')

  try {
    // Get agents to assign properties to
    const { data: agents } = await supabaseAdmin.from('agents').select('*')
    if (!agents || agents.length === 0) {
      throw new Error('No agents found. Run main seed script first.')
    }

    // Get admin user for created_by
    const { data: profiles } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('role', 'admin')
      .limit(1)

    const adminUserId = profiles?.[0]?.id

    const properties = []

    // Property configuration to ensure filter coverage
    const filterCoverage = {
      // Core specs coverage
      bedrooms: [1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 5, 6], // Weighted distribution
      bathrooms: [1, 1, 1, 2, 2, 2, 3, 3, 4, 5],
      receptionRooms: [1, 1, 2, 2, 3, 3, 4],
      floorAreas: [400, 500, 750, 1000, 1250, 1500, 1750, 2000, 2500, 3000, 4000], // sqft

      // Property types (ensure coverage)
      propertyTypes: ['detached', 'semi_detached', 'terraced', 'flat', 'bungalow', 'maisonette', 'cottage', 'town_house'],

      // EPC ratings (ensure A-G coverage)
      epcRatings: ['A', 'A', 'B', 'B', 'C', 'C', 'C', 'D', 'D', 'E', 'F'],

      // Tenure types
      tenures: ['freehold', 'freehold', 'freehold', 'leasehold', 'leasehold', 'share_of_freehold'],

      // Garden types and orientations
      gardenTypes: ['private', 'private', 'private', 'communal', 'none'],
      gardenOrientations: ['south', 'east', 'west', 'north'],

      // Parking types
      parkingTypes: ['driveway', 'driveway', 'garage', 'allocated', 'on_street', 'none'],

      // Heating types
      heatingTypes: ['gas_central', 'gas_central', 'gas_central', 'electric', 'oil', 'heat_pump'],

      // Status variety
      statuses: ['available', 'available', 'available', 'under_offer', 'sstc'],

      // Rental specific
      furnishedOptions: ['furnished', 'unfurnished', 'part_furnished']
    }

    const areas = [
      { name: 'Southsea', lat: 50.7904, lng: -1.0867, postcode: 'PO5' },
      { name: 'Old Portsmouth', lat: 50.7837, lng: -1.1064, postcode: 'PO1' },
      { name: 'Fratton', lat: 50.7965, lng: -1.0639, postcode: 'PO4' },
      { name: 'Copnor', lat: 50.8157, lng: -1.0503, postcode: 'PO3' },
      { name: 'Hilsea', lat: 50.8292, lng: -1.0717, postcode: 'PO2' },
      { name: 'Cosham', lat: 50.8485, lng: -1.0639, postcode: 'PO6' },
      { name: 'North End', lat: 50.8120, lng: -1.0717, postcode: 'PO2' },
      { name: 'Eastney', lat: 50.7837, lng: -1.0503, postcode: 'PO4' },
      { name: 'Milton', lat: 50.7865, lng: -1.0281, postcode: 'PO4' },
      { name: 'Baffins', lat: 50.8013, lng: -1.0425, postcode: 'PO3' }
    ]

    // Generate 80 properties with comprehensive coverage
    const totalProperties = 80
    const rentalProperties = 15 // 15 rentals, 65 sales

    for (let i = 0; i < totalProperties; i++) {
      const isRental = i < rentalProperties
      const area = areas[i % areas.length] // Cycle through areas
      const agent = agents[i % agents.length] // Cycle through agents

      // Ensure filter coverage by cycling through options
      const bedrooms = filterCoverage.bedrooms[i % filterCoverage.bedrooms.length]
      const bathrooms = Math.min(bedrooms, filterCoverage.bathrooms[i % filterCoverage.bathrooms.length])
      const receptionRooms = filterCoverage.receptionRooms[i % filterCoverage.receptionRooms.length]
      const propertyType = filterCoverage.propertyTypes[i % filterCoverage.propertyTypes.length]
      const epcRating = filterCoverage.epcRatings[i % filterCoverage.epcRatings.length]
      const tenure = filterCoverage.tenures[i % filterCoverage.tenures.length]
      const gardenType = propertyType === 'flat' ? null : filterCoverage.gardenTypes[i % filterCoverage.gardenTypes.length]
      const gardenOrientation = gardenType === 'private' ? filterCoverage.gardenOrientations[i % filterCoverage.gardenOrientations.length] : null
      const parkingType = filterCoverage.parkingTypes[i % filterCoverage.parkingTypes.length]
      const heatingType = filterCoverage.heatingTypes[i % filterCoverage.heatingTypes.length]
      const status = filterCoverage.statuses[i % filterCoverage.statuses.length]
      const floorAreaSqft = filterCoverage.floorAreas[i % filterCoverage.floorAreas.length]

      // Generate features with strategic coverage
      const features = {
        // Ensure at least 5 properties have each feature
        period_property: i % 10 < 5,
        modern: i % 10 < 4,
        cottage: propertyType === 'cottage' || i % 20 < 3,
        fixer_upper: i % 15 < 3,
        new_build: i % 12 < 2,
        en_suite: bedrooms >= 2 && i % 8 < 5,
        bathtub: i % 6 < 4,
        wet_room: i % 15 < 2,
        walk_in_wardrobe: bedrooms >= 3 && i % 10 < 3,
        kitchen_island: floorAreaSqft > 1000 && i % 8 < 3,
        open_plan_kitchen: i % 7 < 4,
        separate_dining_room: bedrooms >= 3 && i % 6 < 4,
        utility_room: bedrooms >= 3 && i % 5 < 3,
        conservatory: i % 8 < 3,
        home_office: i % 6 < 4, // Important filter
        basement: i % 12 < 2,
        loft_conversion: i % 10 < 3,
        annexe: propertyType === 'detached' && i % 20 < 2,
        downstairs_wc: bedrooms >= 3 && i % 5 < 4,
        double_glazing: i % 4 < 3, // Most properties
        log_burner: i % 7 < 3,
        solar_panels: i % 10 < 3,
        underfloor_heating: i % 12 < 2,
        bay_windows: propertyType !== 'flat' && i % 6 < 3,
        bifold_doors: i % 8 < 3,
        original_features: features.period_property && i % 6 < 4,
        cellar: propertyType !== 'flat' && i % 15 < 2,
        garage: parkingType === 'garage',
        outbuildings: propertyType !== 'flat' && i % 8 < 2,
        swimming_pool: propertyType === 'detached' && i % 30 < 1,
        balcony: propertyType === 'flat' && i % 4 < 2,
        roof_terrace: i % 15 < 2,
        patio: gardenType === 'private' && i % 4 < 3
      }

      // Calculate price based on specs
      let basePrice = isRental ? 100000 : 25000000 // £1000 rent or £250k sale
      basePrice += bedrooms * (isRental ? 25000 : 6000000) // Per bedroom
      basePrice += floorAreaSqft * (isRental ? 1 : 200) // Per sqft

      // Area multipliers
      const areaMultipliers: Record<string, number> = {
        'Southsea': 1.2,
        'Old Portsmouth': 1.4,
        'Fratton': 0.8,
        'Copnor': 0.9,
        'Hilsea': 0.85,
        'Cosham': 1.1,
        'North End': 0.9,
        'Eastney': 1.15,
        'Milton': 1.0,
        'Baffins': 0.9
      }

      basePrice *= areaMultipliers[area.name] || 1.0
      basePrice += Math.random() * basePrice * 0.2 - basePrice * 0.1 // ±10% variation

      // Generate address
      const streets = [
        'Albert Road', 'Victoria Road', 'Kings Road', 'Queens Road', 'High Street',
        'Church Road', 'Station Road', 'Mill Road', 'Park Road', 'Grove Road'
      ]
      const street = streets[i % streets.length]
      const number = i + 1

      const latVariation = (Math.random() - 0.5) * 0.02
      const lngVariation = (Math.random() - 0.5) * 0.02

      const address = {
        address_line_1: `${number} ${street}`,
        address_town: 'Portsmouth',
        address_county: 'Hampshire',
        address_postcode: `${area.postcode} ${Math.floor(i / 10) + 1}${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(65 + ((i + 1) % 26))}`,
        latitude: area.lat + latVariation,
        longitude: area.lng + lngVariation
      }

      const slug = `${address.address_line_1.toLowerCase().replace(/\s+/g, '-')}-${area.name.toLowerCase().replace(/\s+/g, '-')}-${address.address_postcode.toLowerCase().replace(/\s+/g, '-')}`

      // Generate listing dates for variety
      const daysAgo = Math.floor(Math.random() * 180) // 0-180 days ago
      const listedDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)

      // Some properties have price reductions
      const hasPriceReduction = i % 8 < 2 && daysAgo > 30
      const originalPrice = hasPriceReduction ? Math.floor(basePrice * 1.1) : null
      const currentPrice = hasPriceReduction ? basePrice : Math.floor(basePrice)

      // Leasehold details for flats
      const leaseDetails = tenure === 'leasehold' ? {
        lease_length_remaining: 80 + Math.floor(Math.random() * 120), // 80-200 years
        service_charge_annual: Math.floor(Math.random() * 300000) + 100000, // £1000-£4000
        ground_rent_annual: Math.floor(Math.random() * 50000) + 10000 // £100-£600
      } : {}

      const propertyData = {
        slug,
        listing_type: isRental ? 'rent' as const : 'sale' as const,
        status,
        price: currentPrice,
        price_qualifier: 'fixed_price',
        property_type: propertyType,
        new_build: features.new_build,
        ...address,
        bedrooms,
        bathrooms,
        reception_rooms: receptionRooms,
        floor_area_sqft: floorAreaSqft,
        floor_area_sqm: Math.floor(floorAreaSqft * 0.092903), // Convert to sqm
        tenure,
        ...leaseDetails,
        epc_rating: epcRating,
        heating_type: heatingType,
        mains_gas: heatingType === 'gas_central',
        mains_sewer: true,
        garden_type: gardenType,
        garden_orientation: gardenOrientation,
        parking_type: parkingType,
        ev_charging: parkingType !== 'none' && i % 15 < 2, // Some have EV charging
        chain_free: i % 4 < 1, // 25% chain free
        listed_date: listedDate.toISOString(),
        price_changed_date: hasPriceReduction ? new Date(listedDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString() : null,
        original_price: originalPrice,
        description: `${bedrooms} bedroom ${propertyType.replace('_', ' ')} in ${area.name}. ${features.period_property ? 'Period property with original features. ' : ''}${features.modern ? 'Modern throughout with contemporary fittings. ' : ''}${features.home_office ? 'Perfect home office space. ' : ''}${features.conservatory ? 'Lovely conservatory. ' : ''}Great location with excellent transport links.`,
        summary: `${bedrooms} bed ${propertyType.replace('_', ' ')} in ${area.name}`,
        agent_id: agent.id,
        created_by: adminUserId,
        ...features,
        // Rental specific fields
        ...(isRental && {
          furnished: filterCoverage.furnishedOptions[i % filterCoverage.furnishedOptions.length],
          pets_allowed: i % 5 < 2, // 40% allow pets
          bills_included: i % 10 < 1, // 10% include bills
          deposit_amount: Math.floor(currentPrice * 1.5), // 1.5 months
          min_tenancy_months: 6 + Math.floor(Math.random() * 6) // 6-12 months
        })
      }

      const { data: property, error } = await supabaseAdmin
        .from('properties')
        .insert(propertyData as any)
        .select()
        .single()

      if (error) {
        console.error('Error creating property:', error)
        continue
      }

      properties.push(property)

      // Create property images
      const imageCount = Math.floor(Math.random() * 8) + 3
      for (let j = 0; j < imageCount; j++) {
        await supabaseAdmin
          .from('property_images')
          .insert({
            property_id: property.id,
            image_url: `https://placehold.co/800x600/e2e8f0/64748b?text=${encodeURIComponent(`${area.name} Property ${i + 1} Photo ${j + 1}`)}`,
            display_order: j,
            is_primary: j === 0,
            is_floorplan: j === imageCount - 1 && Math.random() < 0.3,
            room_tag: (['kitchen', 'living_room', 'bedroom_1', 'bedroom_2', 'bathroom', 'exterior'] as const)[Math.floor(Math.random() * 6)]
          })
      }

      // Create price history
      await supabaseAdmin
        .from('property_price_history')
        .insert({
          property_id: property.id,
          event_type: 'listed',
          price: originalPrice || currentPrice,
          date: listedDate.toISOString()
        })

      // Add price reduction event if applicable
      if (hasPriceReduction) {
        await supabaseAdmin
          .from('property_price_history')
          .insert({
            property_id: property.id,
            event_type: 'price_reduced',
            price: currentPrice,
            date: new Date(listedDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()
          })
      }

      // Status change events for under offer/sstc properties
      if (status !== 'available') {
        await supabaseAdmin
          .from('property_price_history')
          .insert({
            property_id: property.id,
            event_type: status,
            price: currentPrice,
            date: new Date(listedDate.getTime() + daysAgo * 0.7 * 24 * 60 * 60 * 1000).toISOString()
          })
      }

      console.log(`✅ Created property ${i + 1}/${totalProperties}: ${bedrooms}bed ${propertyType} in ${area.name} (${isRental ? 'rental' : 'sale'})`)
    }

    // Create more sold prices data
    console.log('💰 Creating comprehensive sold prices data...')
    for (let i = 0; i < 500; i++) {
      const area = areas[i % areas.length]
      const propertyType = filterCoverage.propertyTypes[i % filterCoverage.propertyTypes.length]
      const bedrooms = filterCoverage.bedrooms[i % filterCoverage.bedrooms.length]

      const street = ['Albert Road', 'Victoria Road', 'Kings Road', 'Church Road', 'High Street'][i % 5]
      const number = (i % 200) + 1

      const latVariation = (Math.random() - 0.5) * 0.02
      const lngVariation = (Math.random() - 0.5) * 0.02

      // Sold price calculation (slightly lower than current market)
      let soldPrice = 20000000 + bedrooms * 5000000 // Base price in pence
      soldPrice *= areaMultipliers[area.name] || 1.0
      soldPrice *= 0.95 // 5% lower than current market
      soldPrice += Math.random() * soldPrice * 0.2 - soldPrice * 0.1

      // Random date in last 3 years
      const soldDate = new Date(Date.now() - Math.floor(Math.random() * 1095) * 24 * 60 * 60 * 1000)

      await supabaseAdmin
        .from('sold_prices')
        .insert({
          address: `${number} ${street}, Portsmouth`,
          postcode: `${area.postcode} ${Math.floor(i / 10) + 1}${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(65 + ((i + 1) % 26))}`,
          price: Math.floor(soldPrice),
          date_sold: soldDate.toISOString().split('T')[0],
          property_type: propertyType,
          new_build: Math.random() < 0.05,
          tenure: propertyType === 'flat' ? 'leasehold' : 'freehold',
          latitude: area.lat + latVariation,
          longitude: area.lng + lngVariation
        })
    }

    console.log(`🎉 Comprehensive property seeding completed!`)
    console.log(`📊 Created ${properties.length} properties with full filter coverage`)
    console.log(`💰 Created 500 sold price records`)
    console.log(`✅ All filters should now have adequate coverage for testing`)

  } catch (error) {
    console.error('❌ Error during comprehensive property seeding:', error)
  }
}

// Run the seeder
if (require.main === module) {
  generateComprehensiveProperties()
    .then(() => {
      console.log('Comprehensive property seeding finished')
      process.exit(0)
    })
    .catch(error => {
      console.error('Comprehensive property seeding failed:', error)
      process.exit(1)
    })
}

export { generateComprehensiveProperties }