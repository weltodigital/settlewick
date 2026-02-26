import Script from 'next/script'
import type { PropertyWithDetails } from '@/types/property'

interface PropertySchemaProps {
  property: PropertyWithDetails
}

export default function PropertySchema({ property }: PropertySchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Accommodation",
    "name": `${property.bedrooms} bed ${property.propertyType.toLowerCase().replace('_', ' ')} for ${property.listingType.toLowerCase()} in ${property.addressTown}`,
    "description": property.description || property.summary,
    "url": `https://settlewick.com/property/${property.slug}`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": property.addressLine1,
      "addressLocality": property.addressTown,
      "addressRegion": property.addressCounty,
      "postalCode": property.addressPostcode,
      "addressCountry": "GB"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": property.latitude,
      "longitude": property.longitude
    },
    "numberOfRooms": property.bedrooms,
    "numberOfBathroomsTotal": property.bathrooms,
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": property.floorAreaSqft,
      "unitCode": "FTK"
    },
    "petsAllowed": property.petsAllowed || false,
    "smokingAllowed": false,
    "amenityFeature": [
      ...(property.doubleGlazing ? [{ "@type": "LocationFeatureSpecification", "name": "Double Glazing" }] : []),
      ...(property.enSuite ? [{ "@type": "LocationFeatureSpecification", "name": "En-suite Bathroom" }] : []),
      ...(property.conservatory ? [{ "@type": "LocationFeatureSpecification", "name": "Conservatory" }] : []),
      ...(property.patio ? [{ "@type": "LocationFeatureSpecification", "name": "Patio" }] : []),
      ...(property.openPlanKitchen ? [{ "@type": "LocationFeatureSpecification", "name": "Open Plan Kitchen" }] : [])
    ],
    "offers": {
      "@type": "Offer",
      "price": property.price / 100, // Convert pence to pounds
      "priceCurrency": "GBP",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": property.price / 100,
        "priceCurrency": "GBP",
        "unitText": property.listingType === 'SALE' ? 'total' : 'monthly'
      },
      "availability": property.status === 'AVAILABLE' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "validFrom": property.listedDate.toISOString(),
      "seller": {
        "@type": "RealEstateAgent",
        "name": property.agent.name,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": property.agent.addressLine1,
          "addressLocality": property.agent.addressTown,
          "postalCode": property.agent.addressPostcode,
          "addressCountry": "GB"
        },
        "telephone": property.agent.phone,
        "email": property.agent.email,
        "url": property.agent.websiteUrl
      }
    },
    "image": property.images.filter(img => !img.isFloorplan).map(img => ({
      "@type": "ImageObject",
      "url": img.imageUrl,
      "caption": img.caption,
      "width": "1200",
      "height": "800"
    })),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://settlewick.com/property/${property.slug}`
    },
    "datePosted": property.listedDate.toISOString(),
    "dateModified": property.updatedAt.toISOString()
  }

  return (
    <Script
      id="property-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 2)
      }}
    />
  )
}