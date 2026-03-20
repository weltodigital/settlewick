import Script from 'next/script'

export default function OrganizationSchema() {
  const schemas = [
    // Organization Schema
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Settlewick",
      "description": "UK property search portal with comprehensive filters and tools. Find properties for sale and to rent across the UK with detailed information and local insights.",
      "url": "https://www.settlewick.co.uk",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.settlewick.co.uk/images/logo.png",
        "width": "200",
        "height": "60"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "availableLanguage": ["English"],
        "areaServed": "United Kingdom"
      },
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "GB"
      },
      "sameAs": [
        "https://facebook.com/settlewick",
        "https://twitter.com/settlewick",
        "https://linkedin.com/company/settlewick"
      ],
      "areaServed": {
        "@type": "Country",
        "name": "United Kingdom"
      },
      "serviceType": [
        "Property Search",
        "Property Listings",
        "Stamp Duty Calculator",
        "Mortgage Calculator",
        "Area Guides",
        "Sold Price Data"
      ]
    },
    // WebSite Schema with SearchAction
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Settlewick",
      "url": "https://www.settlewick.co.uk",
      "description": "UK property search with every filter you need. Find properties for sale and to rent with comprehensive data and tools.",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://www.settlewick.co.uk/for-sale/{search_term_string}"
        },
        "query-input": "required name=search_term_string"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Settlewick"
      }
    }
  ]

  return (
    <>
      {schemas.map((schema, index) => (
        <Script
          key={index}
          id={`structured-data-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 2)
          }}
        />
      ))}
    </>
  )
}