'use client'

import { useState } from 'react'
import { Calculator, Info, ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'
import Script from 'next/script'

// Stamp duty rates for England & Wales (2025/2026)
const STAMP_DUTY_RATES = {
  standard: [
    { min: 0, max: 125000, rate: 0 },
    { min: 125001, max: 250000, rate: 2 },
    { min: 250001, max: 925000, rate: 5 },
    { min: 925001, max: 1500000, rate: 10 },
    { min: 1500001, max: Infinity, rate: 12 }
  ],
  firstTimeBuyer: [
    { min: 0, max: 300000, rate: 0 },
    { min: 300001, max: 500000, rate: 5 }
  ],
  additionalPropertySurcharge: 5,
  nonUkResidentSurcharge: 2
}

type BuyerType = 'standard' | 'firstTimeBuyer' | 'additionalProperty' | 'nonUkResident'

interface CalculationResult {
  stampDuty: number
  effectiveRate: number
  breakdown: Array<{
    band: string
    amount: number
    rate: number
    stampDuty: number
  }>
}

export default function StampDutyCalculator() {
  const [propertyPrice, setPropertyPrice] = useState<string>('')
  const [buyerType, setBuyerType] = useState<BuyerType>('standard')
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [showBreakdown, setShowBreakdown] = useState(false)
  const [showRatesTable, setShowRatesTable] = useState(false)
  const [showFaq, setShowFaq] = useState(false)

  const calculateStampDuty = (price: number, type: BuyerType): CalculationResult => {
    let totalStampDuty = 0
    const breakdown: CalculationResult['breakdown'] = []

    // Determine which rates to use
    let rates = STAMP_DUTY_RATES.standard
    let additionalSurcharge = 0

    if (type === 'firstTimeBuyer' && price <= 500000) {
      rates = STAMP_DUTY_RATES.firstTimeBuyer
    } else if (type === 'additionalProperty') {
      additionalSurcharge += STAMP_DUTY_RATES.additionalPropertySurcharge
    } else if (type === 'nonUkResident') {
      additionalSurcharge += STAMP_DUTY_RATES.nonUkResidentSurcharge
    }

    // Calculate stamp duty for each band
    for (const band of rates) {
      if (price > band.min - 1) {
        const bandMin = Math.max(band.min, 0)
        const bandMax = Math.min(price, band.max)
        const bandAmount = bandMax - bandMin + 1

        if (bandAmount > 0) {
          const bandStampDuty = (bandAmount * (band.rate + additionalSurcharge)) / 100

          totalStampDuty += bandStampDuty

          breakdown.push({
            band: band.max === Infinity
              ? `£${band.min.toLocaleString()}+`
              : `£${band.min.toLocaleString()} - £${band.max.toLocaleString()}`,
            amount: bandAmount,
            rate: band.rate + additionalSurcharge,
            stampDuty: bandStampDuty
          })
        }

        if (price <= band.max) break
      }
    }

    const effectiveRate = (totalStampDuty / price) * 100

    return {
      stampDuty: totalStampDuty,
      effectiveRate,
      breakdown
    }
  }

  const handleCalculate = () => {
    const price = parseFloat(propertyPrice.replace(/,/g, ''))
    if (isNaN(price) || price <= 0) return

    const calculation = calculateStampDuty(price, buyerType)
    setResult(calculation)
    setShowBreakdown(true)
  }

  const handlePriceChange = (value: string) => {
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^\d.]/g, '')

    // Add commas for thousands
    const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

    setPropertyPrice(formattedValue)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Who pays stamp duty?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The buyer is responsible for paying stamp duty. It must be paid within 14 days of completion."
        }
      },
      {
        "@type": "Question",
        "name": "When do you need to pay stamp duty?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Stamp duty is typically paid by your solicitor as part of the conveyancing process, but you must ensure the payment is made within 14 days of completion."
        }
      },
      {
        "@type": "Question",
        "name": "Are there any stamp duty exemptions?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, properties under £125,000 are exempt from stamp duty for most buyers. First-time buyers get relief up to £300,000."
        }
      },
      {
        "@type": "Question",
        "name": "What are the current stamp duty rates for 2026?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "For England & Wales: 0% up to £125k, 2% on £125k-£250k, 5% on £250k-£925k, 10% on £925k-£1.5m, 12% over £1.5m. First-time buyers pay 0% up to £300k."
        }
      }
    ]
  }

  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema, null, 2)
        }}
      />
      <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-text-primary mb-4">
          Stamp Duty Calculator 2026
        </h1>
        <p className="text-xl text-text-secondary">
          Calculate how much stamp duty you'll pay on your property purchase in England & Wales
        </p>
      </div>

      {/* Calculator Card */}
      <div className="card p-8">
        <div className="flex items-center gap-3 mb-6">
          <Calculator className="w-6 h-6 text-accent" />
          <h2 className="text-2xl font-semibold text-text-primary">Stamp Duty Calculator</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Property Price */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Property Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted">£</span>
                <input
                  type="text"
                  value={propertyPrice}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  placeholder="400,000"
                  className="w-full pl-8 pr-4 py-3 text-lg border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                />
              </div>
            </div>

            {/* Buyer Type */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-3">
                Buyer Type
              </label>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { value: 'standard', label: 'Standard buyer', description: 'Regular rates apply' },
                  { value: 'firstTimeBuyer', label: 'First-time buyer', description: '0% up to £300,000' },
                  { value: 'additionalProperty', label: 'Additional property', description: '+5% surcharge' },
                  { value: 'nonUkResident', label: 'Non-UK resident', description: '+2% surcharge' }
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                      buyerType === option.value
                        ? 'border-accent bg-accent/5'
                        : 'border-border hover:border-accent/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="buyerType"
                      value={option.value}
                      checked={buyerType === option.value}
                      onChange={(e) => setBuyerType(e.target.value as BuyerType)}
                      className="mt-1 w-4 h-4 text-accent"
                    />
                    <div>
                      <div className="font-medium text-text-primary">{option.label}</div>
                      <div className="text-sm text-text-secondary">{option.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handleCalculate}
              disabled={!propertyPrice}
              className="btn-primary w-full py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Calculate Stamp Duty
            </button>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {result ? (
              <>
                {/* Main Result */}
                <div className="bg-accent/10 border border-accent/20 rounded-xl p-6 text-center">
                  <div className="text-sm font-medium text-text-secondary mb-2">Total Stamp Duty</div>
                  <div className="text-4xl font-bold text-text-primary mb-2">
                    {formatCurrency(result.stampDuty)}
                  </div>
                  <div className="text-sm text-text-secondary">
                    Effective rate: {result.effectiveRate.toFixed(2)}%
                  </div>
                </div>

                {/* Breakdown Toggle */}
                <button
                  onClick={() => setShowBreakdown(!showBreakdown)}
                  className="w-full flex items-center justify-between p-4 bg-surface border border-border rounded-lg hover:bg-accent/5 transition-colors"
                >
                  <span className="font-medium text-text-primary">View Breakdown</span>
                  {showBreakdown ? (
                    <ChevronUp className="w-5 h-5 text-text-secondary" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-text-secondary" />
                  )}
                </button>

                {/* Detailed Breakdown */}
                {showBreakdown && (
                  <div className="space-y-3">
                    <h3 className="font-medium text-text-primary">Calculation Breakdown</h3>
                    {result.breakdown.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-surface rounded-lg">
                        <div>
                          <div className="text-sm font-medium text-text-primary">{item.band}</div>
                          <div className="text-xs text-text-secondary">{item.rate}% on {formatCurrency(item.amount)}</div>
                        </div>
                        <div className="font-medium text-text-primary">
                          {formatCurrency(item.stampDuty)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="bg-surface border border-border rounded-xl p-8 text-center">
                <Calculator className="w-12 h-12 text-text-muted mx-auto mb-4" />
                <p className="text-text-secondary">Enter a property price to calculate stamp duty</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rates Table */}
      <div className="card p-6">
        <button
          onClick={() => setShowRatesTable(!showRatesTable)}
          className="w-full flex items-center justify-between mb-4"
        >
          <h2 className="text-xl font-semibold text-text-primary">Current Stamp Duty Rates (2025/2026)</h2>
          {showRatesTable ? (
            <ChevronUp className="w-5 h-5 text-text-secondary" />
          ) : (
            <ChevronDown className="w-5 h-5 text-text-secondary" />
          )}
        </button>

        {showRatesTable && (
          <div className="space-y-6">
            {/* Standard Rates */}
            <div>
              <h3 className="font-medium text-text-primary mb-3">Standard Rates</h3>
              <div className="overflow-x-auto">
                <table className="w-full border border-border rounded-lg">
                  <thead className="bg-surface">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">Property Value</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {STAMP_DUTY_RATES.standard.map((rate, index) => (
                      <tr key={index} className="border-t border-border">
                        <td className="px-4 py-3 text-sm text-text-primary">
                          {rate.max === Infinity
                            ? `Over £${rate.min.toLocaleString()}`
                            : `£${rate.min.toLocaleString()} - £${rate.max.toLocaleString()}`
                          }
                        </td>
                        <td className="px-4 py-3 text-sm text-text-primary">{rate.rate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* First-time Buyer Relief */}
            <div>
              <h3 className="font-medium text-text-primary mb-3">First-time Buyer Relief</h3>
              <ul className="text-sm text-text-secondary space-y-2">
                <li>• 0% on properties up to £300,000</li>
                <li>• 5% on the portion between £300,001 and £500,000</li>
                <li>• For properties over £500,000, standard rates apply to the entire purchase</li>
              </ul>
            </div>

            {/* Surcharges */}
            <div>
              <h3 className="font-medium text-text-primary mb-3">Additional Surcharges</h3>
              <ul className="text-sm text-text-secondary space-y-2">
                <li>• Additional property: +5% on top of standard rates</li>
                <li>• Non-UK resident: +2% on top of applicable rates</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* FAQ Section */}
      <div className="card p-6">
        <button
          onClick={() => setShowFaq(!showFaq)}
          className="w-full flex items-center justify-between mb-4"
        >
          <h2 className="text-xl font-semibold text-text-primary">What is Stamp Duty?</h2>
          {showFaq ? (
            <ChevronUp className="w-5 h-5 text-text-secondary" />
          ) : (
            <ChevronDown className="w-5 h-5 text-text-secondary" />
          )}
        </button>

        {showFaq && (
          <div className="space-y-6">
            <div className="prose prose-slate max-w-none">
              <p className="text-text-secondary">
                Stamp Duty Land Tax (SDLT) is a tax charged on property purchases in England and Wales.
                The amount you pay depends on the purchase price and your circumstances as a buyer.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-text-primary mb-2">Who pays stamp duty?</h4>
                <p className="text-text-secondary">
                  The buyer is responsible for paying stamp duty. It must be paid within 14 days of completion.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-text-primary mb-2">When do you need to pay?</h4>
                <p className="text-text-secondary">
                  Stamp duty is typically paid by your solicitor as part of the conveyancing process,
                  but you must ensure the payment is made within 14 days of completion.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-text-primary mb-2">Are there any exemptions?</h4>
                <p className="text-text-secondary">
                  Yes, properties under £125,000 are exempt from stamp duty for most buyers.
                  First-time buyers get relief up to £300,000.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-text-primary mb-2">What about Scotland and Northern Ireland?</h4>
                <p className="text-text-secondary">
                  Scotland has Land and Buildings Transaction Tax (LBTT) and Northern Ireland has
                  its own stamp duty rates. This calculator is for England and Wales only.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Related Tools */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Related Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/mortgage-calculator"
            className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-accent hover:bg-accent/5 transition-colors"
          >
            <Calculator className="w-6 h-6 text-accent" />
            <div>
              <div className="font-medium text-text-primary">Mortgage Calculator</div>
              <div className="text-sm text-text-secondary">Calculate monthly payments and affordability</div>
            </div>
          </Link>
          <Link
            href="/for-sale"
            className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-accent hover:bg-accent/5 transition-colors"
          >
            <Info className="w-6 h-6 text-accent" />
            <div>
              <div className="font-medium text-text-primary">Property Search</div>
              <div className="text-sm text-text-secondary">Find properties for sale across the UK</div>
            </div>
          </Link>
        </div>
      </div>
      </div>
    </>
  )
}