export function formatPrice(priceInPence: number, listingType: 'SALE' | 'RENT'): string {
  const pounds = Math.round(priceInPence / 100)

  if (listingType === 'RENT') {
    return `£${pounds.toLocaleString()} pcm`
  }

  if (pounds >= 1000000) {
    const millions = (pounds / 1000000).toFixed(1)
    return `£${millions}m`
  }

  if (pounds >= 1000) {
    const thousands = Math.round(pounds / 1000)
    return `£${thousands}k`
  }

  return `£${pounds.toLocaleString()}`
}

export function formatAddress(
  addressLine1: string,
  addressLine2: string | null,
  addressTown: string,
  addressPostcode: string
): string {
  const parts = [addressLine1, addressLine2, addressTown, addressPostcode].filter(Boolean)
  return parts.join(', ')
}

export function formatShortAddress(
  addressLine1: string,
  addressTown: string,
  addressPostcode: string
): string {
  return `${addressLine1}, ${addressTown} ${addressPostcode}`
}

export function formatPropertyType(propertyType: string): string {
  return propertyType
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

export function formatBedBath(bedrooms?: number | null, bathrooms?: number | null): string {
  const parts: string[] = []

  if (bedrooms && bedrooms > 0) {
    parts.push(`${bedrooms} bed`)
  }

  if (bathrooms && bathrooms > 0) {
    parts.push(`${bathrooms} bath`)
  }

  return parts.join(', ')
}

export function formatArea(areaSqft?: number | null): string {
  if (!areaSqft) return ''
  return `${areaSqft.toLocaleString()} sq ft`
}

export function formatDaysOnMarket(listedDate: Date): string {
  const days = Math.floor((Date.now() - listedDate.getTime()) / (1000 * 60 * 60 * 24))

  if (days === 0) return 'Listed today'
  if (days === 1) return '1 day on market'
  return `${days} days on market`
}

export function formatPriceReduction(originalPrice: number, currentPrice: number): string {
  const reduction = originalPrice - currentPrice
  const percentage = Math.round((reduction / originalPrice) * 100)
  const reductionFormatted = formatPrice(reduction, 'SALE')

  return `Reduced by ${reductionFormatted} (${percentage}%)`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}