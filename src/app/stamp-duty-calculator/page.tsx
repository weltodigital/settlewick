import StampDutyCalculator from '@/components/calculators/StampDutyCalculator'
import { Metadata } from 'next'
import { generateMetadata } from '@/lib/seo'

export const metadata: Metadata = generateMetadata({
  title: 'Stamp Duty Calculator 2026 — How Much Will You Pay? | Settlewick',
  description: 'Calculate stamp duty on your property purchase. Free stamp duty calculator for England & Wales with first-time buyer, additional property and non-UK resident rates.',
  keywords: [
    'stamp duty calculator',
    'stamp duty calculator 2026',
    'how much is stamp duty',
    'stamp duty rates',
    'stamp duty first time buyer',
    'stamp duty additional property',
    'stamp duty non-UK resident',
    'property tax calculator',
    'house purchase costs',
    'stamp duty land tax'
  ],
  url: '/stamp-duty-calculator'
})

export default function StampDutyCalculatorPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-8xl mx-auto px-4">
        <StampDutyCalculator />
      </div>
    </div>
  )
}