import MortgageCalculator from '@/components/mortgage/MortgageCalculator'
import { Metadata } from 'next'
import { generateMetadata } from '@/lib/seo'

export const metadata: Metadata = generateMetadata({
  title: 'Mortgage Calculator - Calculate Payments & Affordability',
  description: 'Free mortgage calculator to estimate monthly payments, affordability, and total costs. Includes stamp duty calculator and affordability assessment.',
  keywords: [
    'mortgage calculator',
    'mortgage affordability calculator',
    'stamp duty calculator',
    'monthly mortgage payments',
    'home loan calculator',
    'mortgage affordability UK',
    'house purchase calculator'
  ],
  url: '/mortgage-calculator'
})

export default function MortgageCalculatorPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-8xl mx-auto px-4">
        <MortgageCalculator />
      </div>
    </div>
  )
}