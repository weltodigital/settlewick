import Script from 'next/script'

export default function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "Settlewick",
    "description": "Premier property portal for Portsmouth and surrounding areas. Find properties for sale and to rent with comprehensive search filters and local insights.",
    "url": "https://settlewick.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://settlewick.com/images/logo.png",
      "width": "200",
      "height": "60"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+44-23-9000-0000",
      "contactType": "customer service",
      "availableLanguage": ["English"],
      "areaServed": "Portsmouth, UK"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Portsmouth",
      "addressRegion": "Hampshire",
      "addressCountry": "GB"
    },
    "sameAs": [
      "https://facebook.com/settlewick",
      "https://twitter.com/settlewick",
      "https://linkedin.com/company/settlewick"
    ],
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 50.8198,
        "longitude": -1.0880
      },
      "geoRadius": "50000"
    },
    "serviceType": [
      "Property Search",
      "Property Listings",
      "Property Valuation",
      "Mortgage Advice",
      "Area Information"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Property Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Property Search",
            "description": "Search for properties for sale and rent in Portsmouth"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Property Valuation",
            "description": "Get instant property valuations and market insights"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Mortgage Calculator",
            "description": "Calculate mortgage payments and stamp duty"
          }
        }
      ]
    }
  }

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 2)
      }}
    />
  )
}