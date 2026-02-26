import type { Metadata } from 'next'

interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  url?: string
  image?: string
  type?: string
  noIndex?: boolean
}

export function generateMetadata({
  title,
  description,
  keywords = [],
  url,
  image = '/images/og-image.jpg',
  type = 'website',
  noIndex = false
}: SEOConfig): Metadata {
  const fullTitle = title.includes('Settlewick') ? title : `${title} | Settlewick`
  const fullUrl = url ? `https://settlewick.com${url}` : 'https://settlewick.com'
  const fullImage = image.startsWith('http') ? image : `https://settlewick.com${image}`

  const defaultKeywords = [
    'Portsmouth property',
    'houses for sale Portsmouth',
    'flats to rent Portsmouth',
    'estate agents Portsmouth',
    'Southsea property',
    'Hampshire property search'
  ]

  const allKeywords = [...defaultKeywords, ...keywords].join(', ')

  return {
    title: fullTitle,
    description,
    keywords: allKeywords,
    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      siteName: 'Settlewick',
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_GB',
      type: type as any,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [fullImage],
    },
    alternates: {
      canonical: fullUrl,
    },
    robots: noIndex ? {
      index: false,
      follow: false,
    } : {
      index: true,
      follow: true,
    },
  }
}

export function generatePropertyMetadata(property: {
  addressLine1: string
  addressTown: string
  addressPostcode: string
  bedrooms?: number
  bathrooms?: number
  propertyType: string
  listingType: string
  price: number
  description?: string
  slug: string
  images: Array<{ imageUrl: string; isPrimary?: boolean }>
}): Metadata {
  const propertyTypeFormatted = property.propertyType
    .toLowerCase()
    .replace('_', ' ')
    .replace(/^\w/, c => c.toUpperCase())

  const priceFormatted = property.listingType === 'SALE'
    ? `£${(property.price / 100).toLocaleString()}`
    : `£${(property.price / 100).toLocaleString()} pcm`

  const title = `${property.bedrooms ? property.bedrooms + ' bed ' : ''}${propertyTypeFormatted} ${property.listingType === 'SALE' ? 'for sale' : 'to rent'} in ${property.addressTown} - ${priceFormatted}`

  const description = property.description
    ? property.description.substring(0, 155) + (property.description.length > 155 ? '...' : '')
    : `${property.bedrooms ? property.bedrooms + ' bedroom ' : ''}${propertyTypeFormatted.toLowerCase()} ${property.listingType === 'SALE' ? 'for sale' : 'to rent'} in ${property.addressTown}, ${property.addressPostcode}. ${priceFormatted}. View details, photos and arrange a viewing on Settlewick.`

  const keywords = [
    `${property.bedrooms} bed ${propertyTypeFormatted.toLowerCase()}`,
    `${property.addressTown} property`,
    `${property.addressPostcode}`,
    `${propertyTypeFormatted} ${property.listingType === 'SALE' ? 'for sale' : 'to rent'}`,
    `${property.addressTown} ${propertyTypeFormatted.toLowerCase()}`
  ]

  const primaryImage = property.images.find(img => img.isPrimary) || property.images[0]
  const image = primaryImage?.imageUrl || '/images/og-image.jpg'

  return generateMetadata({
    title,
    description,
    keywords,
    url: `/property/${property.slug}`,
    image,
    type: 'article'
  })
}

export function generateSearchMetadata(params: {
  location?: string
  listingType: 'SALE' | 'RENT'
  filters?: Record<string, any>
}): Metadata {
  const { location, listingType, filters } = params

  const actionText = listingType === 'SALE' ? 'for sale' : 'to rent'
  const locationText = location
    ? ` in ${location.charAt(0).toUpperCase() + location.slice(1).replace('-', ' ')}`
    : ' in Portsmouth'

  let title = `Properties ${actionText}${locationText}`
  let description = `Find properties ${actionText}${locationText}. Search with detailed filters, view photos, and contact agents directly.`

  // Add filter-specific information
  if (filters) {
    const filterDescriptions = []

    if (filters.bedrooms) {
      filterDescriptions.push(`${filters.bedrooms}+ bedrooms`)
    }
    if (filters.propertyType) {
      filterDescriptions.push(filters.propertyType.toLowerCase().replace('_', ' '))
    }
    if (filters.minPrice || filters.maxPrice) {
      const priceRange = []
      if (filters.minPrice) priceRange.push(`from £${(filters.minPrice / 100).toLocaleString()}`)
      if (filters.maxPrice) priceRange.push(`up to £${(filters.maxPrice / 100).toLocaleString()}`)
      filterDescriptions.push(priceRange.join(' '))
    }

    if (filterDescriptions.length > 0) {
      title += ` - ${filterDescriptions.join(', ')}`
      description = `Find ${filterDescriptions.join(', ')} properties ${actionText}${locationText}. ${description}`
    }
  }

  const keywords = [
    `properties ${actionText}`,
    `${location || 'Portsmouth'} property`,
    `houses ${actionText}`,
    `flats ${actionText}`,
    `estate agents ${location || 'Portsmouth'}`
  ]

  return generateMetadata({
    title,
    description,
    keywords,
    url: listingType === 'SALE' ? `/for-sale${location ? `/${location}` : ''}` : `/to-rent${location ? `/${location}` : ''}`
  })
}