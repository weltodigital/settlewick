import AreaGuide from '@/components/area-guides/AreaGuide'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'

// Valid area slugs
const validAreas = [
  'southsea',
  'old-portsmouth',
  'fratton',
  'cosham',
  'gunwharf-quays',
  'milton'
]

// Area names for metadata
const areaNames: Record<string, string> = {
  'southsea': 'Southsea',
  'old-portsmouth': 'Old Portsmouth',
  'fratton': 'Fratton',
  'cosham': 'Cosham',
  'gunwharf-quays': 'Gunwharf Quays',
  'milton': 'Milton'
}

interface Props {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  return validAreas.map((slug) => ({
    slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params

  if (!validAreas.includes(slug)) {
    return {
      title: 'Area Not Found | Settlewick'
    }
  }

  const areaName = areaNames[slug]

  return generateSEOMetadata({
    title: `${areaName} Area Guide - Portsmouth Neighborhood Information`,
    description: `Complete guide to ${areaName}, Portsmouth. Local insights on lifestyle, transport, schools, safety, amenities and property market trends.`,
    keywords: [
      `${areaName} area guide`,
      `${areaName} Portsmouth`,
      `living in ${areaName}`,
      `${areaName} property prices`,
      `${areaName} schools`,
      `${areaName} transport`,
      `Portsmouth neighborhoods`
    ],
    url: `/area-guides/${slug}`,
    type: 'article'
  })
}

export default function AreaGuidePage({ params }: Props) {
  const { slug } = params

  // Check if the area exists
  if (!validAreas.includes(slug)) {
    notFound()
  }

  const areaName = areaNames[slug]

  const breadcrumbItems = [
    { name: 'Home', url: 'https://settlewick.com' },
    { name: 'Area Guides', url: 'https://settlewick.com/area-guides' },
    { name: areaName, url: `https://settlewick.com/area-guides/${slug}` }
  ]

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-8xl mx-auto px-4">
          <AreaGuide areaSlug={slug} />
        </div>
      </div>
    </>
  )
}