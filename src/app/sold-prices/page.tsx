import SoldPricesSearch from '@/components/sold-prices/SoldPricesSearch'
import { Metadata } from 'next'
import { generateMetadata } from '@/lib/seo'

export const metadata: Metadata = generateMetadata({
  title: 'Sold House Prices - Property History & Market Analysis',
  description: 'Search sold house prices in Portsmouth. View property history, market trends and price analysis. Free access to sold property data and market insights.',
  keywords: [
    'sold house prices Portsmouth',
    'property history Portsmouth',
    'sold prices search',
    'Portsmouth market analysis',
    'house price trends',
    'property market data',
    'sold property prices'
  ],
  url: '/sold-prices'
})

export default function SoldPricesPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-8xl mx-auto px-4">
        <SoldPricesSearch />
      </div>
    </div>
  )
}