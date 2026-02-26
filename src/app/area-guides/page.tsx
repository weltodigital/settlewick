import AreaGuidesOverview from '@/components/area-guides/AreaGuidesOverview'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portsmouth Area Guides | Local Insights & Neighborhood Information | Settlewick',
  description: 'Discover the best neighborhoods in Portsmouth with detailed area guides covering lifestyle, transport, schools, safety, and property market trends.',
  openGraph: {
    title: 'Portsmouth Area Guides | Settlewick',
    description: 'Comprehensive neighborhood guides for Portsmouth areas including Southsea, Old Portsmouth, Fratton and more.',
    type: 'website',
  },
}

export default function AreaGuidesPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-8xl mx-auto px-4">
        <AreaGuidesOverview />
      </div>
    </div>
  )
}