import AreaGuidesOverview from '@/components/area-guides/AreaGuidesOverview'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { Metadata } from 'next'

export const metadata: Metadata = generateSEOMetadata({
  title: 'UK Area Guides | Local Insights & Neighborhood Information | Settlewick',
  description: 'Discover the best neighborhoods across the UK with detailed area guides covering lifestyle, transport, schools, safety, and property market trends.',
  keywords: [
    'UK area guides',
    'neighborhood guides UK',
    'local area information',
    'UK property market guides',
    'city guides UK',
    'town guides UK',
    'area information UK',
    'local insights UK'
  ],
  url: '/area-guides',
  type: 'website'
})

export default function AreaGuidesPage() {
  const breadcrumbItems = [
    { name: 'Home', url: 'https://www.settlewick.co.uk' },
    { name: 'Area Guides', url: 'https://www.settlewick.co.uk/area-guides' }
  ]

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-8xl mx-auto px-4">
          <AreaGuidesOverview />
        </div>
      </div>
    </>
  )
}