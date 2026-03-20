import { supabaseAdmin } from '../src/lib/supabase/admin'

// UK Regions with their major areas
const UK_REGIONS = [
  {
    name: 'South East',
    slug: 'south-east',
    type: 'region',
    latitude: 51.3026,
    longitude: -0.7394,
    description: 'The South East region includes London\'s surrounding counties, offering excellent transport links and diverse housing options.'
  },
  {
    name: 'South West',
    slug: 'south-west',
    type: 'region',
    latitude: 50.7236,
    longitude: -3.5293,
    description: 'The South West encompasses Cornwall, Devon, Somerset and surrounding counties, known for coastal properties and rural charm.'
  },
  {
    name: 'London',
    slug: 'london',
    type: 'region',
    latitude: 51.5074,
    longitude: -0.1278,
    description: 'London, the capital city of England, offering diverse property options from period homes to modern developments.'
  },
  {
    name: 'East of England',
    slug: 'east-of-england',
    type: 'region',
    latitude: 52.2400,
    longitude: 0.4757,
    description: 'The East of England region includes Cambridge, Norwich and surrounding areas with excellent commuter links to London.'
  },
  {
    name: 'West Midlands',
    slug: 'west-midlands',
    type: 'region',
    latitude: 52.4862,
    longitude: -1.8904,
    description: 'The West Midlands includes Birmingham and surrounding areas, offering affordable housing and regeneration opportunities.'
  },
  {
    name: 'East Midlands',
    slug: 'east-midlands',
    type: 'region',
    latitude: 52.8382,
    longitude: -1.1391,
    description: 'The East Midlands includes Nottingham, Leicester and Derby with varied property types and good value for money.'
  },
  {
    name: 'North West',
    slug: 'north-west',
    type: 'region',
    latitude: 53.4839,
    longitude: -2.2446,
    description: 'The North West includes Manchester, Liverpool and surrounding areas with diverse property options and strong rental markets.'
  },
  {
    name: 'North East',
    slug: 'north-east',
    type: 'region',
    latitude: 54.9783,
    longitude: -1.6178,
    description: 'The North East includes Newcastle and surrounding areas, offering excellent value properties and coastal locations.'
  },
  {
    name: 'Yorkshire and the Humber',
    slug: 'yorkshire-humber',
    type: 'region',
    latitude: 53.9583,
    longitude: -1.0803,
    description: 'Yorkshire includes Leeds, Sheffield and York, offering period properties, modern developments and rural retreats.'
  },
  {
    name: 'Scotland',
    slug: 'scotland',
    type: 'region',
    latitude: 56.4907,
    longitude: -4.2026,
    description: 'Scotland offers diverse property options from Edinburgh and Glasgow city living to Highland retreats and coastal homes.'
  },
  {
    name: 'Wales',
    slug: 'wales',
    type: 'region',
    latitude: 52.1307,
    longitude: -3.7837,
    description: 'Wales offers properties from Cardiff city living to rural cottages and coastal homes throughout this beautiful country.'
  }
] as const

// Counties with their parent regions
const UK_COUNTIES = [
  // South East
  { name: 'Hampshire', slug: 'hampshire', parent_region: 'South East', latitude: 51.0577, longitude: -1.3081, postcode_prefix: 'PO,SO,GU,RG' },
  { name: 'Kent', slug: 'kent', parent_region: 'South East', latitude: 51.2787, longitude: 0.5217, postcode_prefix: 'CT,DA,ME,TN' },
  { name: 'Surrey', slug: 'surrey', parent_region: 'South East', latitude: 51.3148, longitude: -0.5600, postcode_prefix: 'GU,KT,RH,SM' },
  { name: 'West Sussex', slug: 'west-sussex', parent_region: 'South East', latitude: 50.8362, longitude: -0.4763, postcode_prefix: 'BN,PO,RH' },
  { name: 'East Sussex', slug: 'east-sussex', parent_region: 'South East', latitude: 50.8429, longitude: 0.1313, postcode_prefix: 'BN,TN' },
  { name: 'Berkshire', slug: 'berkshire', parent_region: 'South East', latitude: 51.4543, longitude: -0.9781, postcode_prefix: 'RG,SL' },
  { name: 'Buckinghamshire', slug: 'buckinghamshire', parent_region: 'South East', latitude: 51.8168, longitude: -0.8052, postcode_prefix: 'HP,MK,SL' },
  { name: 'Oxfordshire', slug: 'oxfordshire', parent_region: 'South East', latitude: 51.7612, longitude: -1.2577, postcode_prefix: 'OX' },

  // South West
  { name: 'Devon', slug: 'devon', parent_region: 'South West', latitude: 50.7156, longitude: -3.5309, postcode_prefix: 'EX,PL,TQ' },
  { name: 'Cornwall', slug: 'cornwall', parent_region: 'South West', latitude: 50.2660, longitude: -5.0527, postcode_prefix: 'TR,PL' },
  { name: 'Somerset', slug: 'somerset', parent_region: 'South West', latitude: 51.1056, longitude: -2.9199, postcode_prefix: 'BA,TA,BS' },
  { name: 'Dorset', slug: 'dorset', parent_region: 'South West', latitude: 50.7448, longitude: -2.3282, postcode_prefix: 'BH,DT,SP' },
  { name: 'Gloucestershire', slug: 'gloucestershire', parent_region: 'South West', latitude: 51.8642, longitude: -2.2381, postcode_prefix: 'GL' },
  { name: 'Wiltshire', slug: 'wiltshire', parent_region: 'South West', latitude: 51.3494, longitude: -1.9931, postcode_prefix: 'SN,SP,BA' },

  // West Midlands
  { name: 'West Midlands', slug: 'west-midlands-county', parent_region: 'West Midlands', latitude: 52.5150, longitude: -1.8624, postcode_prefix: 'B,CV,DY,WS,WV' },
  { name: 'Warwickshire', slug: 'warwickshire', parent_region: 'West Midlands', latitude: 52.3804, longitude: -1.5910, postcode_prefix: 'CV' },
  { name: 'Worcestershire', slug: 'worcestershire', parent_region: 'West Midlands', latitude: 52.1923, longitude: -2.2218, postcode_prefix: 'WR,B,DY' },
  { name: 'Staffordshire', slug: 'staffordshire', parent_region: 'West Midlands', latitude: 52.8321, longitude: -2.0074, postcode_prefix: 'ST,WS,WV' },
  { name: 'Shropshire', slug: 'shropshire', parent_region: 'West Midlands', latitude: 52.6685, longitude: -2.7485, postcode_prefix: 'SY,TF,WV' },
  { name: 'Herefordshire', slug: 'herefordshire', parent_region: 'West Midlands', latitude: 52.0567, longitude: -2.7150, postcode_prefix: 'HR' },

  // East of England
  { name: 'Cambridgeshire', slug: 'cambridgeshire', parent_region: 'East of England', latitude: 52.5755, longitude: -0.2354, postcode_prefix: 'CB,PE' },
  { name: 'Norfolk', slug: 'norfolk', parent_region: 'East of England', latitude: 52.6309, longitude: 1.2974, postcode_prefix: 'NR,PE,IP' },
  { name: 'Suffolk', slug: 'suffolk', parent_region: 'East of England', latitude: 52.1872, longitude: 0.9708, postcode_prefix: 'IP,CO,CB' },
  { name: 'Essex', slug: 'essex', parent_region: 'East of England', latitude: 51.7346, longitude: 0.4683, postcode_prefix: 'CM,CO,SS,IG,RM' },
  { name: 'Hertfordshire', slug: 'hertfordshire', parent_region: 'East of England', latitude: 51.8090, longitude: -0.237, postcode_prefix: 'AL,EN,SG,HP,WD' },
  { name: 'Bedfordshire', slug: 'bedfordshire', parent_region: 'East of England', latitude: 52.0406, longitude: -0.4547, postcode_prefix: 'LU,MK,SG,AL' }
] as const

// Major UK cities and towns
const UK_CITIES = [
  // Hampshire cities (detailed)
  { name: 'Portsmouth', slug: 'portsmouth', county: 'Hampshire', latitude: 50.8058, longitude: -1.0873, population: 238137,
    description: 'Historic naval port city with waterfront living and excellent transport links to London.' },
  { name: 'Southampton', slug: 'southampton', county: 'Hampshire', latitude: 50.9097, longitude: -1.4044, population: 253651,
    description: 'Major cruise port and university city offering diverse property options and cultural amenities.' },
  { name: 'Winchester', slug: 'winchester', county: 'Hampshire', latitude: 51.0632, longitude: -1.3080, population: 45184,
    description: 'Historic cathedral city offering character properties and excellent schools in beautiful surroundings.' },
  { name: 'Basingstoke', slug: 'basingstoke', county: 'Hampshire', latitude: 51.2649, longitude: -1.0873, population: 107642,
    description: 'Modern town with excellent rail links to London and diverse housing developments.' },
  { name: 'Fareham', slug: 'fareham', county: 'Hampshire', latitude: 50.8555, longitude: -1.1827, population: 42210,
    description: 'Market town between Portsmouth and Southampton with period properties and modern developments.' },
  { name: 'Gosport', slug: 'gosport', county: 'Hampshire', latitude: 50.7958, longitude: -1.1297, population: 82622,
    description: 'Waterfront town with marina developments and traditional housing, close to Portsmouth.' },
  { name: 'Havant', slug: 'havant', county: 'Hampshire', latitude: 50.8554, longitude: -0.9799, population: 45826,
    description: 'Market town near Portsmouth with good value family housing and excellent transport links.' },
  { name: 'Alton', slug: 'alton', county: 'Hampshire', latitude: 51.1537, longitude: -0.9731, population: 17816,
    description: 'Historic market town with period properties and beautiful countryside settings.' },
  { name: 'Petersfield', slug: 'petersfield', county: 'Hampshire', latitude: 51.0021, longitude: -0.9370, population: 14974,
    description: 'Georgian market town near South Downs National Park with character properties.' },
  { name: 'Romsey', slug: 'romsey', county: 'Hampshire', latitude: 50.9888, longitude: -1.4943, population: 17342,
    description: 'Historic market town with abbey, offering period properties near Test Valley.' },
  { name: 'Eastleigh', slug: 'eastleigh', county: 'Hampshire', latitude: 50.9697, longitude: -1.3206, population: 55000,
    description: 'Railway town with modern developments and excellent transport connections.' },
  { name: 'Andover', slug: 'andover', county: 'Hampshire', latitude: 51.2118, longitude: -1.4959, population: 59677,
    description: 'Market town with mix of period and modern housing, excellent value for money.' },

  // Major UK cities
  { name: 'London', slug: 'london', county: 'London', latitude: 51.5074, longitude: -0.1278, population: 8982000,
    description: 'The capital city offering diverse property options from period homes to luxury new builds.' },
  { name: 'Birmingham', slug: 'birmingham', county: 'West Midlands', latitude: 52.4862, longitude: -1.8904, population: 1141374,
    description: 'Major city undergoing regeneration with affordable housing and excellent transport links.' },
  { name: 'Manchester', slug: 'manchester', county: 'Greater Manchester', latitude: 53.4839, longitude: -2.2446, population: 547858,
    description: 'Vibrant northern city with strong rental market and regeneration opportunities.' },
  { name: 'Liverpool', slug: 'liverpool', county: 'Merseyside', latitude: 53.4106, longitude: -2.9779, population: 498042,
    description: 'Historic waterfront city with period properties and cultural quarter developments.' },
  { name: 'Leeds', slug: 'leeds', county: 'West Yorkshire', latitude: 53.7997, longitude: -1.5492, population: 789194,
    description: 'Major northern city with diverse property options and strong economy.' },
  { name: 'Sheffield', slug: 'sheffield', county: 'South Yorkshire', latitude: 53.3811, longitude: -1.4701, population: 584853,
    description: 'Steel city with affordable housing and green spaces throughout.' },
  { name: 'Bristol', slug: 'bristol', county: 'South West', latitude: 51.4545, longitude: -2.5879, population: 467099,
    description: 'Creative city with waterfront regeneration and period property opportunities.' },
  { name: 'Newcastle upon Tyne', slug: 'newcastle', county: 'Tyne and Wear', latitude: 54.9783, longitude: -1.6178, population: 300196,
    description: 'Historic northern city with excellent value properties and cultural scene.' },
  { name: 'Nottingham', slug: 'nottingham', county: 'Nottinghamshire', latitude: 52.9548, longitude: -1.1581, population: 332900,
    description: 'University city with strong rental market and period property opportunities.' },
  { name: 'Leicester', slug: 'leicester', county: 'Leicestershire', latitude: 52.6369, longitude: -1.1398, population: 355218,
    description: 'Diverse city with affordable housing and excellent transport links.' }
] as const

// Portsmouth neighbourhoods (detailed for full coverage)
const PORTSMOUTH_NEIGHBOURHOODS = [
  { name: 'Southsea', slug: 'southsea', city: 'Portsmouth', latitude: 50.7904, longitude: -1.0867,
    postcode_prefix: 'PO5', description: 'Vibrant seaside area with period terraces, seafront living and excellent amenities.' },
  { name: 'Old Portsmouth', slug: 'old-portsmouth', city: 'Portsmouth', latitude: 50.7837, longitude: -1.1064,
    postcode_prefix: 'PO1', description: 'Historic quarter with cobbled streets, period properties and waterfront views.' },
  { name: 'Fratton', slug: 'fratton', city: 'Portsmouth', latitude: 50.7965, longitude: -1.0639,
    postcode_prefix: 'PO4', description: 'Diverse residential area with Victorian terraces and good transport links.' },
  { name: 'Copnor', slug: 'copnor', city: 'Portsmouth', latitude: 50.8157, longitude: -1.0503,
    postcode_prefix: 'PO3', description: 'Family-friendly area with mix of period and modern housing, good schools nearby.' },
  { name: 'Hilsea', slug: 'hilsea', city: 'Portsmouth', latitude: 50.8292, longitude: -1.0717,
    postcode_prefix: 'PO2', description: 'Residential area with green spaces and varied housing options.' },
  { name: 'Cosham', slug: 'cosham', city: 'Portsmouth', latitude: 50.8485, longitude: -1.0639,
    postcode_prefix: 'PO6', description: 'Suburban area with excellent transport links and family housing.' },
  { name: 'Drayton', slug: 'drayton', city: 'Portsmouth', latitude: 50.8301, longitude: -1.0458,
    postcode_prefix: 'PO6', description: 'Quiet residential area with parks and family-friendly housing.' },
  { name: 'Farlington', slug: 'farlington', city: 'Portsmouth', latitude: 50.8444, longitude: -1.0325,
    postcode_prefix: 'PO6', description: 'Semi-rural area with larger properties and easy access to countryside.' },
  { name: 'Anchorage Park', slug: 'anchorage-park', city: 'Portsmouth', latitude: 50.8156, longitude: -1.0656,
    postcode_prefix: 'PO3', description: 'Planned community with modern housing and local amenities.' },
  { name: 'North End', slug: 'north-end', city: 'Portsmouth', latitude: 50.8120, longitude: -1.0717,
    postcode_prefix: 'PO2', description: 'Established residential area with period properties and local shops.' },
  { name: 'Eastney', slug: 'eastney', city: 'Portsmouth', latitude: 50.7837, longitude: -1.0503,
    postcode_prefix: 'PO4', description: 'Coastal area with period properties and beach access.' },
  { name: 'Milton', slug: 'milton', city: 'Portsmouth', latitude: 50.7865, longitude: -1.0281,
    postcode_prefix: 'PO4', description: 'Residential area with varied housing and proximity to seafront.' },
  { name: 'Baffins', slug: 'baffins', city: 'Portsmouth', latitude: 50.8013, longitude: -1.0425,
    postcode_prefix: 'PO3', description: 'Family area with schools, parks and mix of housing types.' },
  { name: 'Stamshaw', slug: 'stamshaw', city: 'Portsmouth', latitude: 50.8156, longitude: -1.0953,
    postcode_prefix: 'PO2', description: 'Residential area with community facilities and good transport links.' },
  { name: 'Tipner', slug: 'tipner', city: 'Portsmouth', latitude: 50.8200, longitude: -1.1059,
    postcode_prefix: 'PO2', description: 'Regeneration area with new developments and waterfront access.' },
  { name: 'Landport', slug: 'landport', city: 'Portsmouth', latitude: 50.7969, longitude: -1.0947,
    postcode_prefix: 'PO1', description: 'Central area with period terraces close to city amenities.' },
  { name: 'Somers Town', slug: 'somers-town', city: 'Portsmouth', latitude: 50.7969, longitude: -1.0858,
    postcode_prefix: 'PO1', description: 'Historic area with character properties and community spirit.' },
  { name: 'Portsea', slug: 'portsea', city: 'Portsmouth', latitude: 50.7995, longitude: -1.1059,
    postcode_prefix: 'PO1', description: 'Historic naval area with period properties and maritime heritage.' },
  { name: 'Paulsgrove', slug: 'paulsgrove', city: 'Portsmouth', latitude: 50.8485, longitude: -1.1118,
    postcode_prefix: 'PO6', description: 'Suburban area with community facilities and varied housing.' },
  { name: 'Wymering', slug: 'wymering', city: 'Portsmouth', latitude: 50.8529, longitude: -1.0769,
    postcode_prefix: 'PO6', description: 'Residential area with parks and family housing options.' },
  { name: 'Port Solent', slug: 'port-solent', city: 'Portsmouth', latitude: 50.8444, longitude: -1.1127,
    postcode_prefix: 'PO6', description: 'Marina development with waterfront properties and leisure facilities.' }
] as const

// Portsmouth postcode districts
const PORTSMOUTH_POSTCODES = [
  { name: 'PO1', slug: 'po1', city: 'Portsmouth', type: 'postcode_district', latitude: 50.7930, longitude: -1.0970 },
  { name: 'PO2', slug: 'po2', city: 'Portsmouth', type: 'postcode_district', latitude: 50.8200, longitude: -1.0750 },
  { name: 'PO3', slug: 'po3', city: 'Portsmouth', type: 'postcode_district', latitude: 50.8100, longitude: -1.0500 },
  { name: 'PO4', slug: 'po4', city: 'Portsmouth', type: 'postcode_district', latitude: 50.7900, longitude: -1.0400 },
  { name: 'PO5', slug: 'po5', city: 'Portsmouth', type: 'postcode_district', latitude: 50.7850, longitude: -1.0750 },
  { name: 'PO6', slug: 'po6', city: 'Portsmouth', type: 'postcode_district', latitude: 50.8400, longitude: -1.0700 }
] as const

async function seedLocations() {
  console.log('🗺️  Starting locations seeding...')

  try {
    const locationsInserted = []

    // 1. Insert regions first
    console.log('📍 Creating UK regions...')
    const regionMap = new Map()

    for (const region of UK_REGIONS) {
      const { data: location, error } = await supabaseAdmin
        .from('locations')
        .insert({
          name: region.name,
          slug: region.slug,
          location_type: 'region',
          latitude: region.latitude,
          longitude: region.longitude,
          description: region.description,
          // Set approximate bounds (will be refined later)
          bounds_ne_lat: region.latitude + 2,
          bounds_ne_lng: region.longitude + 2,
          bounds_sw_lat: region.latitude - 2,
          bounds_sw_lng: region.longitude - 2
        })
        .select()
        .single()

      if (error) {
        console.error(`Error creating region ${region.name}:`, error)
      } else {
        regionMap.set(region.name, location.id)
        locationsInserted.push(location)
        console.log(`✅ Created region: ${region.name}`)
      }
    }

    // 2. Insert counties
    console.log('🏞️  Creating UK counties...')
    const countyMap = new Map()

    for (const county of UK_COUNTIES) {
      const parentId = regionMap.get(county.parent_region)

      const { data: location, error } = await supabaseAdmin
        .from('locations')
        .insert({
          name: county.name,
          slug: county.slug,
          location_type: 'county',
          parent_id: parentId,
          latitude: county.latitude,
          longitude: county.longitude,
          postcode_prefix: county.postcode_prefix,
          description: `${county.name} is a county in the ${county.parent_region} region offering diverse property options and excellent quality of life.`,
          bounds_ne_lat: county.latitude + 0.5,
          bounds_ne_lng: county.longitude + 0.5,
          bounds_sw_lat: county.latitude - 0.5,
          bounds_sw_lng: county.longitude - 0.5
        })
        .select()
        .single()

      if (error) {
        console.error(`Error creating county ${county.name}:`, error)
      } else {
        countyMap.set(county.name, location.id)
        locationsInserted.push(location)
        console.log(`✅ Created county: ${county.name}`)
      }
    }

    // 3. Insert major cities
    console.log('🏙️  Creating major UK cities...')
    const cityMap = new Map()

    for (const city of UK_CITIES) {
      const parentId = countyMap.get(city.county)

      const { data: location, error } = await supabaseAdmin
        .from('locations')
        .insert({
          name: city.name,
          slug: city.slug,
          location_type: city.name === 'London' ? 'city' : 'city',
          parent_id: parentId,
          latitude: city.latitude,
          longitude: city.longitude,
          population: city.population,
          description: city.description,
          bounds_ne_lat: city.latitude + 0.1,
          bounds_ne_lng: city.longitude + 0.1,
          bounds_sw_lat: city.latitude - 0.1,
          bounds_sw_lng: city.longitude - 0.1
        })
        .select()
        .single()

      if (error) {
        console.error(`Error creating city ${city.name}:`, error)
      } else {
        cityMap.set(city.name, location.id)
        locationsInserted.push(location)
        console.log(`✅ Created city: ${city.name}`)
      }
    }

    // 4. Insert Portsmouth neighbourhoods
    console.log('🏘️  Creating Portsmouth neighbourhoods...')
    const portsmouthId = cityMap.get('Portsmouth')

    for (const neighbourhood of PORTSMOUTH_NEIGHBOURHOODS) {
      const { data: location, error } = await supabaseAdmin
        .from('locations')
        .insert({
          name: neighbourhood.name,
          slug: neighbourhood.slug,
          location_type: 'neighbourhood',
          parent_id: portsmouthId,
          postcode_prefix: neighbourhood.postcode_prefix,
          latitude: neighbourhood.latitude,
          longitude: neighbourhood.longitude,
          description: neighbourhood.description,
          bounds_ne_lat: neighbourhood.latitude + 0.02,
          bounds_ne_lng: neighbourhood.longitude + 0.02,
          bounds_sw_lat: neighbourhood.latitude - 0.02,
          bounds_sw_lng: neighbourhood.longitude - 0.02
        })
        .select()
        .single()

      if (error) {
        console.error(`Error creating neighbourhood ${neighbourhood.name}:`, error)
      } else {
        locationsInserted.push(location)
        console.log(`✅ Created neighbourhood: ${neighbourhood.name}`)
      }
    }

    // 5. Insert Portsmouth postcode districts
    console.log('📮 Creating Portsmouth postcode districts...')
    for (const postcode of PORTSMOUTH_POSTCODES) {
      const { data: location, error } = await supabaseAdmin
        .from('locations')
        .insert({
          name: postcode.name,
          slug: postcode.slug,
          location_type: 'postcode_district',
          parent_id: portsmouthId,
          postcode_prefix: postcode.name,
          latitude: postcode.latitude,
          longitude: postcode.longitude,
          description: `${postcode.name} postcode area in Portsmouth with varied property options and amenities.`,
          bounds_ne_lat: postcode.latitude + 0.01,
          bounds_ne_lng: postcode.longitude + 0.01,
          bounds_sw_lat: postcode.latitude - 0.01,
          bounds_sw_lng: postcode.longitude - 0.01
        })
        .select()
        .single()

      if (error) {
        console.error(`Error creating postcode ${postcode.name}:`, error)
      } else {
        locationsInserted.push(location)
        console.log(`✅ Created postcode district: ${postcode.name}`)
      }
    }

    console.log(`🎉 Location seeding completed! Created ${locationsInserted.length} locations`)
    console.log(`📊 Breakdown: ${UK_REGIONS.length} regions, ${UK_COUNTIES.length} counties, ${UK_CITIES.length} cities, ${PORTSMOUTH_NEIGHBOURHOODS.length} neighbourhoods, ${PORTSMOUTH_POSTCODES.length} postcodes`)

  } catch (error) {
    console.error('❌ Error during location seeding:', error)
  }
}

// Run the seeder
if (require.main === module) {
  seedLocations()
    .then(() => {
      console.log('Location seeding finished')
      process.exit(0)
    })
    .catch(error => {
      console.error('Location seeding failed:', error)
      process.exit(1)
    })
}

export { seedLocations }