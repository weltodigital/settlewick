import SoldPricesSearch from '@/components/sold-prices/SoldPricesSearch'
import { Metadata } from 'next'
import { generateMetadata } from '@/lib/seo'

export const metadata: Metadata = generateMetadata({
  title: 'Sold House Prices UK | Property History & Market Analysis | Settlewick',
  description: 'Search sold house prices across the UK. View property history, market trends and price analysis. Free access to sold property data and market insights.',
  keywords: [
    'sold house prices UK',
    'property history UK',
    'sold prices search',
    'UK market analysis',
    'house price trends',
    'property market data',
    'sold property prices',
    'land registry prices'
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