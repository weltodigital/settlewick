import { supabaseAdmin } from '../src/lib/supabase/admin'

// Portsmouth areas with realistic coordinates
const PORTSMOUTH_AREAS = [
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

// Estate agents data
const AGENTS_DATA = [
  {
    name: 'Portsmouth Property Partners',
    slug: 'portsmouth-property-partners',
    branch_name: 'Southsea Branch',
    email: 'southsea@portsmouthpropertypartners.co.uk',
    phone: '023 9273 1234',
    website_url: 'https://portsmouthpropertypartners.co.uk',
    address_line_1: '125 Albert Road',
    address_town: 'Portsmouth',
    address_postcode: 'PO5 2SE',
    latitude: 50.7904,
    longitude: -1.0867,
    description: 'Local property experts serving Portsmouth and surrounding areas for over 20 years.',
    subscription_tier: 'premium'
  },
  {
    name: 'Solent Homes',
    slug: 'solent-homes',
    branch_name: 'Portsmouth Central',
    email: 'portsmouth@solenthomes.co.uk',
    phone: '023 9282 5678',
    website_url: 'https://solenthomes.co.uk',
    address_line_1: '89 Commercial Road',
    address_town: 'Portsmouth',
    address_postcode: 'PO1 1BG',
    latitude: 50.7969,
    longitude: -1.0947,
    description: 'Specializing in period properties and new builds across South Hampshire.',
    subscription_tier: 'basic'
  },
  {
    name: 'Harbour View Estate Agents',
    slug: 'harbour-view-estate-agents',
    branch_name: 'Old Portsmouth',
    email: 'info@harbourviewea.co.uk',
    phone: '023 9275 9876',
    address_line_1: '42 High Street',
    address_town: 'Portsmouth',
    address_postcode: 'PO1 2LS',
    latitude: 50.7837,
    longitude: -1.1064,
    description: 'Boutique agency focusing on unique properties in historic Portsmouth.',
    subscription_tier: 'premium'
  }
]

// Property types and their typical features
const PROPERTY_TYPES = [
  'detached', 'semi_detached', 'terraced', 'flat', 'bungalow',
  'maisonette', 'cottage', 'town_house'
] as const

const PROPERTY_FEATURES = [
  'period_property', 'modern', 'cottage', 'utility_room', 'basement',
  'conservatory', 'home_office', 'en_suite', 'bathtub', 'patio',
  'garage', 'balcony', 'double_glazing', 'log_burner', 'solar_panels',
  'walk_in_wardrobe', 'bifold_doors', 'bay_windows', 'original_features'
] as const

// Generate realistic Portsmouth address
function generateAddress(area: typeof PORTSMOUTH_AREAS[0]) {
  const streets = [
    'Albert Road', 'Victoria Road', 'Kings Road', 'Queens Road', 'High Street',
    'Church Road', 'Station Road', 'Mill Road', 'Park Road', 'Grove Road',
    'Manor Road', 'Castle Road', 'Beach Road', 'Hill Road', 'Green Lane'
  ]

  const street = streets[Math.floor(Math.random() * streets.length)]
  const number = Math.floor(Math.random() * 200) + 1

  // Generate coordinates near the area center
  const latVariation = (Math.random() - 0.5) * 0.02 // ~1km variation
  const lngVariation = (Math.random() - 0.5) * 0.02

  return {
    address_line_1: `${number} ${street}`,
    address_town: 'Portsmouth',
    address_county: 'Hampshire',
    address_postcode: `${area.postcode} ${Math.floor(Math.random() * 9) + 1}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
    latitude: area.lat + latVariation,
    longitude: area.lng + lngVariation
  }
}

// Generate random property features
function generateFeatures() {
  const features: Partial<Record<typeof PROPERTY_FEATURES[number], boolean>> = {}

  // Randomly assign some features (30% chance for each)
  PROPERTY_FEATURES.forEach(feature => {
    if (Math.random() < 0.3) {
      features[feature] = true
    }
  })

  return features
}

// Generate realistic price based on property type and area
function generatePrice(propertyType: string, bedrooms: number, area: string, isRental = false): number {
  let basePrice: number

  if (isRental) {
    // Monthly rental prices in pence
    basePrice = 80000 // £800 base
    basePrice += bedrooms * 20000 // £200 per bedroom
  } else {
    // Sale prices in pence
    basePrice = 20000000 // £200k base
    basePrice += bedrooms * 5000000 // £50k per bedroom
  }

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

  // Property type multipliers
  const typeMultipliers: Record<string, number> = {
    'detached': 1.4,
    'semi_detached': 1.1,
    'terraced': 1.0,
    'flat': 0.8,
    'bungalow': 1.2,
    'maisonette': 0.9,
    'cottage': 1.3,
    'town_house': 1.15
  }

  basePrice *= (areaMultipliers[area] || 1.0)
  basePrice *= (typeMultipliers[propertyType] || 1.0)

  // Add some random variation (±15%)
  const variation = 0.85 + Math.random() * 0.3
  basePrice *= variation

  return Math.round(basePrice)
}

// Generate property description
function generateDescription(propertyType: string, bedrooms: number, area: string, features: any): string {
  const descriptions = [
    `Beautiful ${bedrooms} bedroom ${propertyType.replace('_', ' ')} in the heart of ${area}.`,
    `Charming ${propertyType.replace('_', ' ')} offering ${bedrooms} bedrooms in sought-after ${area}.`,
    `Stunning ${propertyType.replace('_', ' ')} with ${bedrooms} bedrooms in popular ${area} location.`,
    `Impressive ${bedrooms} bedroom ${propertyType.replace('_', ' ')} situated in ${area}.`
  ]

  let desc = descriptions[Math.floor(Math.random() * descriptions.length)]

  // Add feature descriptions
  if (features.period_property) desc += ' This period property retains many original features.'
  if (features.modern) desc += ' Modern throughout with contemporary fittings.'
  if (features.garage) desc += ' Benefits from private garage.'
  if (features.conservatory) desc += ' Lovely conservatory overlooking the garden.'
  if (features.log_burner) desc += ' Cozy log burner in the living room.'

  desc += ` Convenient location with easy access to Portsmouth city centre and excellent transport links. Close to local amenities, schools, and ${area === 'Southsea' ? 'the seafront' : 'green spaces'}.`

  return desc
}

async function seedDatabase() {
  console.log('🌱 Starting database seeding...')

  try {
    // 1. Create test users first (they need to exist for agents to reference)
    console.log('👤 Creating test users...')

    // Admin user
    const { data: adminUser, error: adminError } = await supabaseAdmin.auth.admin.createUser({
      email: 'admin@settlewick.com',
      password: 'admin123',
      email_confirm: true,
      user_metadata: {
        name: 'Admin User'
      }
    })

    if (adminError) {
      console.error('Error creating admin user:', adminError)
    } else {
      console.log('✅ Admin user created')

      // Update admin profile
      await supabaseAdmin
        .from('profiles')
        .update({ role: 'admin', name: 'Admin User' })
        .eq('id', adminUser.user.id)
    }

    // Test agent user
    const { data: agentUser, error: agentError } = await supabaseAdmin.auth.admin.createUser({
      email: 'agent@test.com',
      password: 'agent123',
      email_confirm: true,
      user_metadata: {
        name: 'Test Agent'
      }
    })

    if (agentError) {
      console.error('Error creating agent user:', agentError)
    } else {
      console.log('✅ Agent user created')
    }

    // Test buyer user
    const { data: buyerUser, error: buyerError } = await supabaseAdmin.auth.admin.createUser({
      email: 'buyer@test.com',
      password: 'buyer123',
      email_confirm: true,
      user_metadata: {
        name: 'Test Buyer'
      }
    })

    if (buyerError) {
      console.error('Error creating buyer user:', buyerError)
    } else {
      console.log('✅ Buyer user created')
    }

    // 2. Create agents
    console.log('🏢 Creating estate agents...')
    const agents = []

    for (const agentData of AGENTS_DATA) {
      const { data: agent, error } = await supabaseAdmin
        .from('agents')
        .insert(agentData)
        .select()
        .single()

      if (error) {
        console.error('Error creating agent:', error)
      } else {
        agents.push(agent)
        console.log(`✅ Created agent: ${agent.name}`)
      }
    }

    // Update test agent user to link to first agent
    if (agentUser && agents.length > 0) {
      await supabaseAdmin
        .from('profiles')
        .update({
          role: 'agent',
          agent_id: agents[0].id,
          name: 'Test Agent'
        })
        .eq('id', agentUser.user.id)
    }

    // 3. Create area guides
    console.log('📍 Creating area guides...')

    for (const area of PORTSMOUTH_AREAS) {
      const { error } = await supabaseAdmin
        .from('area_guides')
        .insert({
          slug: area.name.toLowerCase().replace(' ', '-'),
          name: area.name,
          postcode_prefix: area.postcode,
          description: `${area.name} is a vibrant area of Portsmouth offering excellent amenities and transport links. Popular with families and young professionals alike, the area boasts good schools, local shops, and easy access to Portsmouth city centre.`,
          latitude: area.lat,
          longitude: area.lng,
          average_price: generatePrice('terraced', 3, area.name, false),
          average_rent: generatePrice('terraced', 2, area.name, true)
        })

      if (error) {
        console.error(`Error creating area guide for ${area.name}:`, error)
      } else {
        console.log(`✅ Created area guide: ${area.name}`)
      }
    }

    // 4. Create properties
    console.log('🏠 Creating properties...')

    const properties = []

    // Create 40 sale properties and 10 rental properties
    for (let i = 0; i < 50; i++) {
      const isRental = i >= 40
      const area = PORTSMOUTH_AREAS[Math.floor(Math.random() * PORTSMOUTH_AREAS.length)]
      const agent = agents[Math.floor(Math.random() * agents.length)]
      const propertyType = PROPERTY_TYPES[Math.floor(Math.random() * PROPERTY_TYPES.length)]

      // Generate bedrooms (1-5, weighted toward 2-3)
      const bedroomWeights = [0.1, 0.3, 0.35, 0.2, 0.05] // 1br, 2br, 3br, 4br, 5br
      const rand = Math.random()
      let bedrooms = 1
      let cumulative = 0
      for (let j = 0; j < bedroomWeights.length; j++) {
        cumulative += bedroomWeights[j]
        if (rand <= cumulative) {
          bedrooms = j + 1
          break
        }
      }

      const bathrooms = Math.min(bedrooms, Math.floor(Math.random() * 3) + 1)
      const address = generateAddress(area)
      const features = generateFeatures()
      const price = generatePrice(propertyType, bedrooms, area.name, isRental)

      // Create property slug
      const slug = `${address.address_line_1.toLowerCase().replace(/\s+/g, '-')}-${area.name.toLowerCase().replace(/\s+/g, '-')}-${address.address_postcode.toLowerCase().replace(/\s+/g, '-')}`

      const propertyData = {
        slug,
        listing_type: isRental ? 'rent' : 'sale',
        status: 'available',
        price,
        price_qualifier: 'fixed_price',
        property_type: propertyType,
        new_build: Math.random() < 0.1, // 10% chance
        ...address,
        bedrooms,
        bathrooms,
        reception_rooms: Math.floor(Math.random() * 3) + 1,
        floor_area_sqft: Math.floor(Math.random() * 1000) + 500,
        tenure: propertyType === 'flat' ? (Math.random() < 0.7 ? 'leasehold' : 'share_of_freehold') : 'freehold',
        epc_rating: ['A', 'B', 'C', 'D', 'E', 'F'][Math.floor(Math.random() * 6)],
        heating_type: 'gas_central',
        mains_gas: true,
        mains_sewer: true,
        garden_type: ['flat', 'maisonette'].includes(propertyType) ? null : 'private',
        parking_type: Math.random() < 0.7 ? 'driveway' : 'on_street',
        chain_free: Math.random() < 0.3,
        listed_date: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString(),
        description: generateDescription(propertyType, bedrooms, area.name, features),
        summary: `${bedrooms} bed ${propertyType.replace('_', ' ')} in ${area.name}`,
        agent_id: agent.id,
        created_by: agentUser?.user.id || adminUser?.user.id,
        ...features,
        // Rental specific
        ...(isRental && {
          furnished: ['furnished', 'unfurnished', 'part_furnished'][Math.floor(Math.random() * 3)],
          pets_allowed: Math.random() < 0.4,
          deposit_amount: Math.floor(price * 1.5), // 1.5 months deposit
        })
      }

      const { data: property, error } = await supabaseAdmin
        .from('properties')
        .insert(propertyData)
        .select()
        .single()

      if (error) {
        console.error('Error creating property:', error)
      } else {
        properties.push(property)

        // Create property images
        const imageCount = Math.floor(Math.random() * 8) + 3 // 3-10 images
        for (let j = 0; j < imageCount; j++) {
          await supabaseAdmin
            .from('property_images')
            .insert({
              property_id: property.id,
              image_url: `https://placehold.co/800x600/e2e8f0/64748b?text=Property+Photo+${j + 1}`,
              display_order: j,
              is_primary: j === 0,
              is_floorplan: j === imageCount - 1 && Math.random() < 0.5,
              room_tag: ['kitchen', 'living_room', 'bedroom_1', 'bedroom_2', 'bathroom', 'exterior'][Math.floor(Math.random() * 6)]
            })
        }

        // Create price history entry
        await supabaseAdmin
          .from('property_price_history')
          .insert({
            property_id: property.id,
            event_type: 'listed',
            price: property.price,
            date: property.listed_date
          })

        // Maybe add a price reduction (20% chance)
        if (Math.random() < 0.2) {
          const reductionAmount = Math.floor(property.price * 0.05) // 5% reduction
          const reductionDate = new Date(new Date(property.listed_date).getTime() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)

          await supabaseAdmin
            .from('property_price_history')
            .insert({
              property_id: property.id,
              event_type: 'price_reduced',
              price: property.price - reductionAmount,
              date: reductionDate.toISOString()
            })

          // Update property with new price
          await supabaseAdmin
            .from('properties')
            .update({
              price: property.price - reductionAmount,
              original_price: property.price,
              price_changed_date: reductionDate.toISOString()
            })
            .eq('id', property.id)
        }
      }
    }

    console.log(`✅ Created ${properties.length} properties`)

    // 5. Create sold prices data
    console.log('💰 Creating sold prices data...')

    for (let i = 0; i < 200; i++) {
      const area = PORTSMOUTH_AREAS[Math.floor(Math.random() * PORTSMOUTH_AREAS.length)]
      const address = generateAddress(area)
      const propertyType = PROPERTY_TYPES[Math.floor(Math.random() * PROPERTY_TYPES.length)]
      const bedrooms = Math.floor(Math.random() * 4) + 1
      const soldPrice = generatePrice(propertyType, bedrooms, area.name, false) * (0.95 + Math.random() * 0.1) // Sold prices vary ±5%

      // Random date in last 2 years
      const soldDate = new Date(Date.now() - Math.floor(Math.random() * 730) * 24 * 60 * 60 * 1000)

      await supabaseAdmin
        .from('sold_prices')
        .insert({
          address: `${address.address_line_1}, ${address.address_town}`,
          postcode: address.address_postcode,
          price: Math.floor(soldPrice),
          date_sold: soldDate.toISOString().split('T')[0],
          property_type: propertyType,
          new_build: Math.random() < 0.05,
          tenure: propertyType === 'flat' ? 'leasehold' : 'freehold',
          latitude: address.latitude,
          longitude: address.longitude
        })
    }

    console.log('✅ Created 200 sold price records')

    console.log('🎉 Database seeding completed successfully!')

  } catch (error) {
    console.error('❌ Error during seeding:', error)
  }
}

// Run the seeder
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seeding finished')
      process.exit(0)
    })
    .catch(error => {
      console.error('Seeding failed:', error)
      process.exit(1)
    })
}

export { seedDatabase }