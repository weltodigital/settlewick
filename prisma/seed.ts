import { PrismaClient } from '@prisma/client'
import { createSpatialIndexes } from '../src/lib/geo'

const prisma = new PrismaClient()

// Portsmouth postcodes with approximate coordinates
const PORTSMOUTH_AREAS = {
  'PO1': { lat: 50.8058, lng: -1.0872, area: 'Old Portsmouth', town: 'Portsmouth' }, // Old Portsmouth
  'PO2': { lat: 50.8168, lng: -1.0871, area: 'Portsea', town: 'Portsmouth' }, // Portsea
  'PO3': { lat: 50.8019, lng: -1.0663, area: 'Eastney', town: 'Portsmouth' }, // Eastney
  'PO4': { lat: 50.7896, lng: -1.0854, area: 'Southsea', town: 'Portsmouth' }, // Southsea
  'PO5': { lat: 50.8296, lng: -1.0820, area: 'Fratton', town: 'Portsmouth' }, // Fratton
  'PO6': { lat: 50.8589, lng: -1.0636, area: 'Cosham', town: 'Portsmouth' }, // Cosham
}

const STREET_NAMES = [
  'Albert Road', 'Victoria Road', 'Kings Road', 'Queens Avenue', 'The Hard',
  'Palmerston Road', 'Elm Grove', 'Highland Road', 'Fawcett Road', 'London Road',
  'Commercial Road', 'Kingston Road', 'Fratton Road', 'Copnor Road', 'Tangier Road',
  'Clarendon Road', 'Osborne Road', 'Marmion Road', 'Waverley Road', 'Goldsmith Avenue',
  'Winter Road', 'Summer Road', 'Spring Road', 'North End Avenue', 'Cosham High Street',
  'The Boardwalk', 'Gunwharf Quays', 'Port Solent', 'Clarence Parade', 'South Parade'
]

const PROPERTY_DESCRIPTIONS = {
  flat: [
    "A beautifully presented {bedrooms} bedroom apartment located in the heart of {area}. This modern flat features an open-plan living area, contemporary kitchen, and private balcony with views across Portsmouth. Perfect for first-time buyers or investors.",
    "Stunning {bedrooms} bedroom flat situated on the {floorLevel} floor of a period conversion. Offering bright and spacious accommodation with high ceilings, large windows, and period features throughout. Ideally located within walking distance of Gunwharf Quays.",
    "Modern {bedrooms} bedroom apartment in a popular development in {area}. The property boasts a fitted kitchen, comfortable living space, and secure parking. Close to local amenities and transport links to Portsmouth city centre."
  ],
  house: [
    "Charming {bedrooms} bedroom {propertyType} house located on a quiet residential street in {area}. The property features a welcoming entrance hall, spacious living room, modern kitchen, and private rear garden. Perfect for families looking for their forever home.",
    "Victorian {bedrooms} bedroom {propertyType} offering period charm combined with modern convenience. This delightful home includes original features such as high ceilings and sash windows, alongside a contemporary kitchen and bathroom. The property benefits from a lovely south-facing garden.",
    "Immaculately presented {bedrooms} bedroom {propertyType} situated in the desirable {area} area. The accommodation comprises entrance porch, lounge, dining room, fitted kitchen, and upstairs {bathrooms} bathroom(s). Outside there is off-street parking and an enclosed rear garden."
  ]
}

const ESTATE_AGENTS = [
  {
    name: "Chinneck Shaw",
    slug: "chinneck-shaw",
    branchName: "Portsmouth",
    email: "portsmouth@chinneckshaw.co.uk",
    phone: "023 9229 5046",
    websiteUrl: "https://chinneckshaw.co.uk",
    addressLine1: "123 High Street",
    addressTown: "Portsmouth",
    addressPostcode: "PO1 2AA",
    latitude: 50.8058,
    longitude: -1.0872,
    description: "Independent estate agents specialising in Portsmouth properties since 1995."
  },
  {
    name: "Whiteley & Co",
    slug: "whiteley-co",
    branchName: "Southsea",
    email: "southsea@whiteleyco.co.uk",
    phone: "023 9273 3456",
    websiteUrl: "https://whiteleyco.co.uk",
    addressLine1: "45 Albert Road",
    addressTown: "Southsea",
    addressPostcode: "PO4 0JW",
    latitude: 50.7896,
    longitude: -1.0854,
    description: "Premier estate agents serving Portsmouth and surrounding areas for over 25 years."
  },
  {
    name: "Portsmouth Property Partners",
    slug: "portsmouth-property-partners",
    branchName: "Old Portsmouth",
    email: "sales@portsmouthproperty.co.uk",
    phone: "023 9282 7890",
    websiteUrl: "https://portsmouthproperty.co.uk",
    addressLine1: "78 The Hard",
    addressTown: "Portsmouth",
    addressPostcode: "PO1 3DT",
    latitude: 50.8058,
    longitude: -1.1072,
    description: "Boutique estate agency focusing on unique and period properties in historic Portsmouth."
  }
]

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomBoolean(probability: number = 0.5): boolean {
  return Math.random() < probability
}

function generatePropertyDescription(
  bedrooms: number,
  propertyType: string,
  area: string,
  floorLevel?: string
): string {
  const isFlat = ['FLAT', 'MAISONETTE'].includes(propertyType)
  const templates = isFlat ? PROPERTY_DESCRIPTIONS.flat : PROPERTY_DESCRIPTIONS.house

  const template = getRandomItem(templates)
  const bathrooms = Math.max(1, Math.floor(bedrooms * 0.8))

  return template
    .replace('{bedrooms}', bedrooms.toString())
    .replace('{propertyType}', propertyType.toLowerCase().replace('_', ' '))
    .replace('{area}', area)
    .replace('{floorLevel}', floorLevel || 'ground')
    .replace('{bathrooms}', bathrooms.toString())
}

function generateSlug(address: string, propertyType: string, bedrooms: number): string {
  return `${bedrooms}-bed-${propertyType.toLowerCase().replace('_', '-')}-${address.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
}

function addRandomDaysToDate(date: Date, maxDays: number): Date {
  const randomDays = Math.floor(Math.random() * maxDays)
  return new Date(date.getTime() + randomDays * 24 * 60 * 60 * 1000)
}

async function main() {
  console.log('🌱 Starting seed process...')

  // Clear existing data
  console.log('🗑️  Clearing existing data...')
  await prisma.propertyView.deleteMany({})
  await prisma.propertyEnquiry.deleteMany({})
  await prisma.savedSearch.deleteMany({})
  await prisma.hiddenProperty.deleteMany({})
  await prisma.savedProperty.deleteMany({})
  await prisma.propertyPriceHistory.deleteMany({})
  await prisma.propertyImage.deleteMany({})
  await prisma.property.deleteMany({})
  await prisma.soldPrice.deleteMany({})
  await prisma.areaGuide.deleteMany({})
  await prisma.user.deleteMany({})
  await prisma.agent.deleteMany({})

  // Create estate agents
  console.log('🏢 Creating estate agents...')
  const agents = []
  for (const agentData of ESTATE_AGENTS) {
    const agent = await prisma.agent.create({
      data: agentData
    })
    agents.push(agent)
  }

  // Create test users
  console.log('👤 Creating test users...')
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@settlewick.com',
      name: 'Admin User',
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewreL3rNCq3Pf4r.', // "admin123"
      role: 'ADMIN'
    }
  })

  const agentUser = await prisma.user.create({
    data: {
      email: 'agent@chinneckshaw.co.uk',
      name: 'Sarah Johnson',
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewreL3rNCq3Pf4r.', // "admin123"
      role: 'AGENT',
      agentId: agents[0].id
    }
  })

  const buyerUser = await prisma.user.create({
    data: {
      email: 'buyer@example.com',
      name: 'John Smith',
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewreL3rNCq3Pf4r.', // "admin123"
      role: 'USER'
    }
  })

  // Create 50 properties
  console.log('🏠 Creating 50 Portsmouth properties...')

  const properties = []
  const salePropertyCount = 40
  const rentalPropertyCount = 10

  for (let i = 0; i < salePropertyCount + rentalPropertyCount; i++) {
    const isRental = i >= salePropertyCount
    const listingType = isRental ? 'RENT' : 'SALE'

    // Random area
    const postcodeKey = getRandomItem(Object.keys(PORTSMOUTH_AREAS))
    const areaData = PORTSMOUTH_AREAS[postcodeKey as keyof typeof PORTSMOUTH_AREAS]

    // Generate address
    const streetName = getRandomItem(STREET_NAMES)
    const houseNumber = getRandomNumber(1, 250)
    const addressLine1 = `${houseNumber} ${streetName}`

    // Random coordinates within area (±0.01 degrees)
    const latitude = areaData.lat + (Math.random() - 0.5) * 0.02
    const longitude = areaData.lng + (Math.random() - 0.5) * 0.02

    // Property characteristics
    const propertyTypes = ['DETACHED', 'SEMI_DETACHED', 'TERRACED', 'FLAT', 'BUNGALOW', 'MAISONETTE']
    const propertyType = getRandomItem(propertyTypes)

    const bedrooms = getRandomNumber(1, 5)
    const bathrooms = Math.max(1, Math.floor(bedrooms * 0.8) + getRandomNumber(0, 1))
    const receptionRooms = bedrooms > 2 ? getRandomNumber(1, 3) : 1

    // Price generation
    let basePrice: number
    if (isRental) {
      basePrice = getRandomNumber(60000, 200000) // £600-2000 pcm
    } else {
      // Sale prices vary by area and property type
      const multipliers = {
        FLAT: 0.7, MAISONETTE: 0.8, TERRACED: 0.9,
        SEMI_DETACHED: 1.1, DETACHED: 1.4, BUNGALOW: 1.0
      }
      const baseForBedrooms = bedrooms * 7500000 + getRandomNumber(10000000, 20000000) // £100k-£400k base
      basePrice = Math.floor(baseForBedrooms * (multipliers[propertyType as keyof typeof multipliers] || 1))
    }

    // Floor area
    const avgSqftPerBed = getRandomNumber(300, 600)
    const floorAreaSqft = bedrooms * avgSqftPerBed + getRandomNumber(-100, 200)

    // Listing date (within last 6 months)
    const listedDate = new Date()
    listedDate.setDate(listedDate.getDate() - getRandomNumber(1, 180))

    // Property status
    let status = 'AVAILABLE'
    if (!isRental && getRandomBoolean(0.15)) {
      status = getRandomItem(['UNDER_OFFER', 'SSTC'])
    }

    // Price reduction logic
    let originalPrice = null
    let priceChangedDate = null
    let currentPrice = basePrice

    if (getRandomBoolean(0.25)) {
      originalPrice = Math.floor(basePrice * getRandomNumber(110, 125) / 100)
      currentPrice = basePrice
      priceChangedDate = addRandomDaysToDate(listedDate, 90)
    }

    const agent = getRandomItem(agents)

    const propertyData = {
      slug: generateSlug(addressLine1, propertyType, bedrooms),
      listingType,
      status: status as any,
      price: currentPrice,
      priceQualifier: isRental ? null : getRandomItem(['GUIDE_PRICE', 'OFFERS_OVER', 'FIXED_PRICE', null]),
      propertyType: propertyType as any,
      newBuild: getRandomBoolean(0.1),

      // Address
      addressLine1,
      addressLine2: getRandomBoolean(0.3) ? `Flat ${getRandomNumber(1, 6)}` : null,
      addressTown: areaData.town,
      addressCounty: 'Hampshire',
      addressPostcode: `${postcodeKey} ${getRandomNumber(1, 9)}${String.fromCharCode(65 + getRandomNumber(0, 25))}${String.fromCharCode(65 + getRandomNumber(0, 25))}`,
      latitude,
      longitude,

      // Specs
      bedrooms,
      bathrooms,
      receptionRooms,
      floorAreaSqft,
      floorAreaSqm: Math.round(floorAreaSqft * 0.092903 * 10) / 10,
      plotSizeSqft: propertyType === 'DETACHED' ? getRandomNumber(2000, 8000) :
                   propertyType === 'SEMI_DETACHED' ? getRandomNumber(1000, 4000) :
                   getRandomBoolean(0.3) ? getRandomNumber(500, 2000) : null,
      floorLevel: ['FLAT', 'MAISONETTE'].includes(propertyType) ?
                  getRandomItem(['GROUND', 'FIRST', 'SECOND', 'TOP']) : null,

      // Tenure
      tenure: ['FLAT', 'MAISONETTE'].includes(propertyType) ?
              getRandomItem(['LEASEHOLD', 'SHARE_OF_FREEHOLD']) : 'FREEHOLD',
      leaseLengthRemaining: ['FLAT', 'MAISONETTE'].includes(propertyType) ? getRandomNumber(85, 999) : null,
      serviceChargeAnnual: ['FLAT', 'MAISONETTE'].includes(propertyType) ? getRandomNumber(80000, 300000) : null,
      groundRentAnnual: ['FLAT', 'MAISONETTE'].includes(propertyType) && getRandomBoolean(0.7) ? getRandomNumber(10000, 50000) : null,

      // Energy
      epcRating: getRandomItem(['A', 'B', 'C', 'D', 'E', 'F']),
      epcPotentialRating: getRandomItem(['A', 'B', 'C', 'D']),
      heatingType: getRandomItem(['GAS_CENTRAL', 'ELECTRIC', 'HEAT_PUMP']),
      mainsGas: getRandomBoolean(0.8),
      mainsSewer: getRandomBoolean(0.95),
      estimatedAnnualEnergyCost: getRandomNumber(80000, 250000),

      // Outdoor & parking
      gardenType: propertyType !== 'FLAT' ? getRandomItem(['PRIVATE', 'COMMUNAL', 'NONE']) :
                  getRandomBoolean(0.3) ? 'COMMUNAL' : 'NONE',
      gardenOrientation: getRandomBoolean(0.7) ? getRandomItem(['NORTH', 'SOUTH', 'EAST', 'WEST']) : null,
      parkingType: getRandomItem(['DRIVEWAY', 'GARAGE', 'ON_STREET', 'NONE']),
      evCharging: getRandomBoolean(0.15),

      // Features
      periodProperty: getRandomBoolean(0.4),
      modern: getRandomBoolean(0.3),
      cottage: propertyType === 'DETACHED' && getRandomBoolean(0.2),
      fixerUpper: getRandomBoolean(0.1),
      utilityRoom: bedrooms >= 3 && getRandomBoolean(0.6),
      basement: getRandomBoolean(0.1),
      conservatory: getRandomBoolean(0.25),
      homeOffice: getRandomBoolean(0.3),
      enSuite: bedrooms >= 2 && getRandomBoolean(0.7),
      bathtub: getRandomBoolean(0.8),
      patio: getRandomBoolean(0.5),
      kitchenIsland: bedrooms >= 3 && getRandomBoolean(0.4),
      loftConversion: getRandomBoolean(0.2),
      annexe: propertyType === 'DETACHED' && getRandomBoolean(0.05),
      openPlanKitchen: getRandomBoolean(0.4),
      separateDiningRoom: bedrooms >= 3 && getRandomBoolean(0.6),
      downstairsWc: bedrooms >= 2 && getRandomBoolean(0.7),
      doubleGlazing: getRandomBoolean(0.85),
      logBurner: getRandomBoolean(0.2),
      solarPanels: getRandomBoolean(0.15),
      underfloorHeating: getRandomBoolean(0.1),
      wetRoom: getRandomBoolean(0.1),
      walkInWardrobe: bedrooms >= 3 && getRandomBoolean(0.3),
      bifoldDoors: getRandomBoolean(0.3),
      bayWindows: getRandomBoolean(0.4),
      originalFeatures: getRandomBoolean(0.3),
      cellar: getRandomBoolean(0.1),
      garage: getRandomBoolean(0.3),
      outbuildings: propertyType !== 'FLAT' && getRandomBoolean(0.2),
      swimmingPool: getRandomBoolean(0.02),
      balcony: ['FLAT', 'MAISONETTE'].includes(propertyType) && getRandomBoolean(0.4),
      roofTerrace: ['FLAT', 'MAISONETTE'].includes(propertyType) && getRandomBoolean(0.1),

      // Rental specific
      furnished: isRental ? getRandomItem(['FURNISHED', 'UNFURNISHED', 'PART_FURNISHED']) : null,
      petsAllowed: isRental ? getRandomBoolean(0.4) : null,
      billsIncluded: isRental ? getRandomBoolean(0.2) : null,
      depositAmount: isRental ? currentPrice + getRandomNumber(0, currentPrice) : null,
      availableFrom: isRental ? addRandomDaysToDate(new Date(), 60) : null,
      minTenancyMonths: isRental ? getRandomNumber(6, 18) : null,

      // Status
      chainFree: !isRental ? getRandomBoolean(0.3) : null,
      listedDate,
      priceChangedDate,
      originalPrice,

      // Content
      description: generatePropertyDescription(bedrooms, propertyType, areaData.area,
        ['FLAT', 'MAISONETTE'].includes(propertyType) ?
        getRandomItem(['ground', 'first', 'second', 'top']) : undefined),
      summary: `${bedrooms} bedroom ${propertyType.toLowerCase().replace('_', ' ')} in ${areaData.area}`,

      // Relations
      agentId: agent.id,
      createdBy: adminUser.id
    }

    const property = await prisma.property.create({ data: propertyData })
    properties.push(property)

    // Add images
    const imageCount = getRandomNumber(3, 8)
    for (let j = 0; j < imageCount; j++) {
      await prisma.propertyImage.create({
        data: {
          propertyId: property.id,
          imageUrl: `https://placehold.co/800x600/e2e8f0/64748b?text=Property+Photo+${j + 1}`,
          displayOrder: j,
          isPrimary: j === 0,
          isFloorplan: false,
          roomTag: j === 0 ? 'EXTERIOR' : getRandomItem(['KITCHEN', 'LIVING_ROOM', 'BEDROOM_1', 'BATHROOM', 'GARDEN'])
        }
      })
    }

    // Add floorplan
    await prisma.propertyImage.create({
      data: {
        propertyId: property.id,
        imageUrl: `https://placehold.co/800x600/f8f9fa/6c757d?text=Floor+Plan`,
        displayOrder: 999,
        isPrimary: false,
        isFloorplan: true
      }
    })

    // Add price history
    await prisma.propertyPriceHistory.create({
      data: {
        propertyId: property.id,
        eventType: 'LISTED',
        price: originalPrice || currentPrice,
        date: listedDate
      }
    })

    if (originalPrice) {
      await prisma.propertyPriceHistory.create({
        data: {
          propertyId: property.id,
          eventType: 'PRICE_REDUCED',
          price: currentPrice,
          date: priceChangedDate!
        }
      })
    }

    console.log(`✅ Created property ${i + 1}: ${propertyData.addressLine1}, ${areaData.area}`)
  }

  // Create sold prices data
  console.log('📊 Creating sold prices data...')
  for (let i = 0; i < 200; i++) {
    const postcodeKey = getRandomItem(Object.keys(PORTSMOUTH_AREAS))
    const areaData = PORTSMOUTH_AREAS[postcodeKey as keyof typeof PORTSMOUTH_AREAS]

    const streetName = getRandomItem(STREET_NAMES)
    const houseNumber = getRandomNumber(1, 250)

    const soldDate = new Date()
    soldDate.setDate(soldDate.getDate() - getRandomNumber(1, 730)) // Last 2 years

    const propertyType = getRandomItem(['DETACHED', 'SEMI_DETACHED', 'TERRACED', 'FLAT'])
    const bedrooms = getRandomNumber(1, 5)

    const multipliers = {
      FLAT: 0.6, TERRACED: 0.8, SEMI_DETACHED: 1.0, DETACHED: 1.3
    }
    const basePrice = bedrooms * 6000000 + getRandomNumber(8000000, 15000000)
    const price = Math.floor(basePrice * (multipliers[propertyType as keyof typeof multipliers] || 1))

    await prisma.soldPrice.create({
      data: {
        address: `${houseNumber} ${streetName}`,
        postcode: `${postcodeKey} ${getRandomNumber(1, 9)}${String.fromCharCode(65 + getRandomNumber(0, 25))}${String.fromCharCode(65 + getRandomNumber(0, 25))}`,
        price,
        dateSold: soldDate,
        propertyType: propertyType as any,
        newBuild: getRandomBoolean(0.1),
        tenure: propertyType === 'FLAT' ? getRandomItem(['LEASEHOLD', 'FREEHOLD']) : 'FREEHOLD',
        latitude: areaData.lat + (Math.random() - 0.5) * 0.02,
        longitude: areaData.lng + (Math.random() - 0.5) * 0.02
      }
    })
  }

  // Create area guides
  console.log('📍 Creating area guides...')
  for (const [postcode, data] of Object.entries(PORTSMOUTH_AREAS)) {
    await prisma.areaGuide.create({
      data: {
        slug: data.area.toLowerCase().replace(/\s+/g, '-'),
        name: data.area,
        parentArea: 'Portsmouth',
        postcodePrefix: postcode,
        description: `${data.area} is a vibrant area of Portsmouth, offering excellent amenities, transport links, and a strong sense of community. Perfect for families, professionals, and first-time buyers looking for quality properties in a desirable location.`,
        latitude: data.lat,
        longitude: data.lng,
        averagePrice: getRandomNumber(25000000, 40000000), // £250k-400k
        averageRent: getRandomNumber(100000, 180000) // £1000-1800 pcm
      }
    })
  }

  // Create spatial indexes
  console.log('🗺️  Creating spatial indexes...')
  await createSpatialIndexes()

  console.log('✅ Seed completed successfully!')
  console.log(`Created:`)
  console.log(`- ${agents.length} estate agents`)
  console.log(`- 3 test users (admin, agent, buyer)`)
  console.log(`- ${properties.length} properties (${salePropertyCount} for sale, ${rentalPropertyCount} to rent)`)
  console.log(`- ${properties.length * 4} property images`)
  console.log(`- 200 sold prices`)
  console.log(`- ${Object.keys(PORTSMOUTH_AREAS).length} area guides`)

  console.log('\nTest accounts:')
  console.log('Admin: admin@settlewick.com / admin123')
  console.log('Agent: agent@chinneckshaw.co.uk / admin123')
  console.log('Buyer: buyer@example.com / admin123')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })