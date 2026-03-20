import MortgageCalculator from '@/components/mortgage/MortgageCalculator'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'
import { Metadata } from 'next'
import { generateMetadata } from '@/lib/seo'

export const metadata: Metadata = generateMetadata({
  title: 'Mortgage Calculator | UK Affordability & Monthly Payments | Settlewick',
  description: 'Calculate UK mortgage payments, affordability and total costs. Free calculator with deposit requirements, interest rates, stamp duty and ongoing costs.',
  keywords: [
    'mortgage calculator UK',
    'mortgage affordability calculator',
    'monthly mortgage payment calculator',
    'UK home loan calculator',
    'mortgage rate calculator',
    'house affordability calculator',
    'mortgage repayment calculator',
    'property finance calculator'
  ],
  url: '/mortgage-calculator'
})

export default function MortgageCalculatorPage() {
  const breadcrumbItems = [
    { name: 'Home', url: 'https://www.settlewick.co.uk' },
    { name: 'Mortgage Calculator', url: 'https://www.settlewick.co.uk/mortgage-calculator' }
  ]

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-8xl mx-auto px-4">
          <MortgageCalculator />
        </div>
      </div>
    </>
  )
}