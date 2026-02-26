import Image from 'next/image'
import Link from 'next/link'
import { Heart, X, Bed, Bath, Maximize, MapPin, Calendar, Scale } from 'lucide-react'
import { formatPrice, formatBedBath, formatArea, formatDaysOnMarket, formatShortAddress } from '@/lib/format'
import { usePropertyComparison } from '@/hooks/usePropertyComparison'
import ShareButton from './ShareButton'
import EnquiryButton from './EnquiryButton'
import type { PropertyWithDetails } from '@/types/property'

interface PropertyCardProps {
  property: PropertyWithDetails
  onToggleSave?: (propertyId: string) => void
  onHide?: () => void
  isSaved?: boolean
  isViewed?: boolean
  viewMode?: 'grid' | 'list'
}

export default function PropertyCard({
  property,
  onToggleSave,
  onHide,
  isSaved = false,
  isViewed = false,
  viewMode = 'grid'
}: PropertyCardProps) {
  const primaryImage = property.images.find(img => img.isPrimary) || property.images[0]
  const hasReduction = property.originalPrice && property.originalPrice > property.price
  const { toggleComparison, isInComparison } = usePropertyComparison()

  return (
    <div className={`card hover:shadow-lg transition-all duration-300 ${isViewed ? 'opacity-75' : ''} ${viewMode === 'list' ? 'sm:flex sm:overflow-hidden' : ''}`}>
      {/* Image */}
      <div className={`relative overflow-hidden ${viewMode === 'list' ? 'sm:w-80 sm:flex-shrink-0 aspect-[4/3] sm:rounded-l-xl sm:rounded-tr-none' : 'aspect-[4/3] rounded-t-xl'}`}>
        <Link href={`/property/${property.slug}`} className="block h-full">
          {primaryImage ? (
            <Image
              src={primaryImage.imageUrl}
              alt={property.summary || 'Property image'}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-secondary flex items-center justify-center">
              <span className="text-text-muted">No image available</span>
            </div>
          )}
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {hasReduction && (
            <div className="bg-accent text-white px-2 py-1 rounded text-xs font-medium">
              Price Reduced
            </div>
          )}
          {property.chainFree && (
            <div className="bg-success text-white px-2 py-1 rounded text-xs font-medium">
              Chain Free
            </div>
          )}
          {property.newBuild && (
            <div className="bg-primary text-white px-2 py-1 rounded text-xs font-medium">
              New Build
            </div>
          )}
        </div>

        {/* Actions - Enhanced touch targets for mobile */}
        <div className="absolute top-3 right-3 flex gap-2">
          <ShareButton
            url={`https://settlewick.com/property/${property.slug}`}
            title={`${property.addressLine1} - ${formatPrice(property.price, property.listingType)}`}
          />
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleComparison(property.id)
            }}
            className={`w-10 h-10 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
              isInComparison(property.id)
                ? 'bg-primary text-white shadow-md'
                : 'bg-white/90 hover:bg-primary hover:text-white text-text-muted backdrop-blur-sm'
            }`}
            title={isInComparison(property.id) ? 'Remove from comparison' : 'Add to comparison'}
          >
            <Scale className="w-4 h-4" />
          </button>
          {onToggleSave && (
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onToggleSave(property.id)
              }}
              className={`w-10 h-10 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                isSaved
                  ? 'bg-accent text-white shadow-md'
                  : 'bg-white/90 hover:bg-accent hover:text-white text-text-muted backdrop-blur-sm'
              }`}
              title={isSaved ? 'Remove from saved' : 'Save property'}
            >
              <Heart className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
            </button>
          )}
          {onHide && (
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onHide()
              }}
              className="w-10 h-10 sm:w-8 sm:h-8 rounded-full bg-white/90 hover:bg-error hover:text-white text-text-muted flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
              title="Hide this property"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Days on market */}
        <div className="absolute bottom-3 left-3">
          <div className="bg-black/60 text-white px-2 py-1 rounded text-xs">
            {formatDaysOnMarket(property.listedDate)}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={`${viewMode === 'list' ? 'sm:flex-1 sm:flex sm:flex-col' : ''} p-4`}>
        <Link href={`/property/${property.slug}`} className="block flex-1">
          {/* Price */}
          <div className="mb-2">
            <div className={`font-bold text-text-primary ${viewMode === 'list' ? 'text-xl sm:text-2xl' : 'text-xl sm:text-2xl'}`}>
              {formatPrice(property.price, property.listingType)}
            </div>
            {hasReduction && (
              <div className="text-sm text-text-muted line-through">
                was {formatPrice(property.originalPrice!, property.listingType)}
              </div>
            )}
          </div>

          {/* Property Details */}
          <div className="flex items-center gap-3 sm:gap-4 text-sm text-text-secondary mb-2 flex-wrap">
            {property.bedrooms && (
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4" />
                <span>{property.bedrooms}</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                <span>{property.bathrooms}</span>
              </div>
            )}
            {property.floorAreaSqft && (
              <div className="flex items-center gap-1">
                <Maximize className="w-4 h-4" />
                <span>{formatArea(property.floorAreaSqft)}</span>
              </div>
            )}
          </div>

          {/* Address */}
          <div className="flex items-start gap-1 text-text-secondary mb-2">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span className="text-sm leading-relaxed">
              {formatShortAddress(
                property.addressLine1,
                property.addressTown,
                property.addressPostcode
              )}
            </span>
          </div>

          {/* Summary */}
          {property.summary && (
            <p className={`text-sm text-text-muted ${viewMode === 'list' ? 'line-clamp-3 sm:line-clamp-2' : 'line-clamp-2'} leading-relaxed`}>
              {property.summary}
            </p>
          )}
        </Link>

        {/* Action Buttons - Quick actions for user engagement */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex gap-2 mb-3">
            <EnquiryButton property={property} variant="primary" className="flex-1" />
            <Link
              href={`/property/${property.slug}`}
              className="flex-1 btn-secondary text-center flex items-center justify-center gap-2"
            >
              View Details
            </Link>
          </div>

          {/* Agent Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {property.agent?.logoUrl ? (
                <Image
                  src={property.agent.logoUrl}
                  alt={property.agent.name}
                  width={24}
                  height={24}
                  className="rounded flex-shrink-0"
                />
              ) : (
                <div className="w-6 h-6 bg-secondary rounded flex items-center justify-center text-xs flex-shrink-0">
                  {property.agent?.name?.charAt(0) || 'A'}
                </div>
              )}
              <span className="text-sm text-text-secondary truncate">
                {property.agent?.name || 'Estate Agent'}
              </span>
            </div>

            {property.status !== 'AVAILABLE' && (
              <div className="text-xs px-2 py-1 bg-warning/10 text-warning rounded flex-shrink-0 ml-2">
                {property.status.replace('_', ' ')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}