'use client'

import { useState, useEffect } from 'react'
import { Calculator, Home, PoundSterling, Calendar, TrendingUp, Info, AlertCircle } from 'lucide-react'

interface MortgageInputs {
  propertyPrice: number
  deposit: number
  interestRate: number
  termYears: number
  annualIncome: number
  monthlyOutgoings: number
  existingDebt: number
  dependents: number
}

interface MortgageResults {
  loanAmount: number
  monthlyPayment: number
  totalInterest: number
  totalAmount: number
  depositPercentage: number
  loanToValue: number
  affordabilityRating: 'excellent' | 'good' | 'fair' | 'poor'
  maxBorrowAmount: number
  monthlyAffordability: {
    payment: number
    income: number
    outgoings: number
    remaining: number
    ratio: number
  }
  stampDuty: number
  solicitorFees: number
  surveyFees: number
  totalUpfrontCosts: number
}

interface AffordabilityBand {
  rating: 'excellent' | 'good' | 'fair' | 'poor'
  label: string
  color: string
  description: string
}

export default function MortgageCalculator() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'affordability' | 'costs'>('calculator')
  const [inputs, setInputs] = useState<MortgageInputs>({
    propertyPrice: 300000,
    deposit: 60000,
    interestRate: 4.5,
    termYears: 25,
    annualIncome: 50000,
    monthlyOutgoings: 1500,
    existingDebt: 0,
    dependents: 0
  })
  const [results, setResults] = useState<MortgageResults | null>(null)

  const affordabilityBands: AffordabilityBand[] = [
    {
      rating: 'excellent',
      label: 'Excellent',
      color: 'success',
      description: 'Very affordable - payments are well within your means'
    },
    {
      rating: 'good',
      label: 'Good',
      color: 'info',
      description: 'Affordable - payments are manageable with your income'
    },
    {
      rating: 'fair',
      label: 'Fair',
      color: 'warning',
      description: 'Tight - payments may stretch your budget'
    },
    {
      rating: 'poor',
      label: 'Poor',
      color: 'error',
      description: 'May be unaffordable - consider reducing the loan amount'
    }
  ]

  useEffect(() => {
    calculateMortgage()
  }, [inputs])

  const calculateMortgage = () => {
    const {
      propertyPrice,
      deposit,
      interestRate,
      termYears,
      annualIncome,
      monthlyOutgoings,
      existingDebt,
      dependents
    } = inputs

    // Basic mortgage calculations
    const loanAmount = propertyPrice - deposit
    const monthlyRate = interestRate / 100 / 12
    const numberOfPayments = termYears * 12

    const monthlyPayment = loanAmount *
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)

    const totalAmount = monthlyPayment * numberOfPayments
    const totalInterest = totalAmount - loanAmount

    // Affordability calculations
    const monthlyIncome = annualIncome / 12
    const availableIncome = monthlyIncome - monthlyOutgoings - (existingDebt / 12)
    const paymentToIncomeRatio = monthlyPayment / monthlyIncome

    // Maximum borrowing (typically 4.5x annual income)
    const maxBorrowAmount = (annualIncome - (existingDebt * 12)) * 4.5

    // Affordability rating
    let affordabilityRating: 'excellent' | 'good' | 'fair' | 'poor'
    if (paymentToIncomeRatio <= 0.25) affordabilityRating = 'excellent'
    else if (paymentToIncomeRatio <= 0.35) affordabilityRating = 'good'
    else if (paymentToIncomeRatio <= 0.45) affordabilityRating = 'fair'
    else affordabilityRating = 'poor'

    // Additional costs
    const stampDuty = calculateStampDuty(propertyPrice)
    const solicitorFees = Math.max(800, propertyPrice * 0.001)
    const surveyFees = propertyPrice < 250000 ? 400 : propertyPrice < 500000 ? 600 : 800
    const totalUpfrontCosts = deposit + stampDuty + solicitorFees + surveyFees + 1000 // +1000 for misc fees

    const calculatedResults: MortgageResults = {
      loanAmount,
      monthlyPayment: Math.round(monthlyPayment),
      totalInterest: Math.round(totalInterest),
      totalAmount: Math.round(totalAmount),
      depositPercentage: Math.round((deposit / propertyPrice) * 100),
      loanToValue: Math.round((loanAmount / propertyPrice) * 100),
      affordabilityRating,
      maxBorrowAmount: Math.round(maxBorrowAmount),
      monthlyAffordability: {
        payment: Math.round(monthlyPayment),
        income: Math.round(monthlyIncome),
        outgoings: monthlyOutgoings,
        remaining: Math.round(availableIncome - monthlyPayment),
        ratio: Math.round(paymentToIncomeRatio * 100)
      },
      stampDuty: Math.round(stampDuty),
      solicitorFees: Math.round(solicitorFees),
      surveyFees,
      totalUpfrontCosts: Math.round(totalUpfrontCosts)
    }

    setResults(calculatedResults)
  }

  const calculateStampDuty = (price: number): number => {
    // UK Stamp Duty Land Tax bands (2024)
    if (price <= 250000) return 0
    if (price <= 925000) return (price - 250000) * 0.05
    if (price <= 1500000) return 33750 + (price - 925000) * 0.1
    return 91250 + (price - 1500000) * 0.12
  }

  const handleInputChange = (field: keyof MortgageInputs, value: number) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const getAffordabilityColor = (rating: string) => {
    switch (rating) {
      case 'excellent': return 'text-success'
      case 'good': return 'text-info'
      case 'fair': return 'text-warning'
      case 'poor': return 'text-error'
      default: return 'text-text-muted'
    }
  }

  const getAffordabilityBg = (rating: string) => {
    switch (rating) {
      case 'excellent': return 'bg-success/10 border-success/20'
      case 'good': return 'bg-info/10 border-info/20'
      case 'fair': return 'bg-warning/10 border-warning/20'
      case 'poor': return 'bg-error/10 border-error/20'
      default: return 'bg-text-muted/10 border-text-muted/20'
    }
  }

  const tabs = [
    { id: 'calculator', label: 'Calculator', icon: Calculator },
    { id: 'affordability', label: 'Affordability', icon: TrendingUp },
    { id: 'costs', label: 'Additional Costs', icon: PoundSterling }
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-accent/10 rounded-lg">
            <Calculator className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary">Mortgage Calculator</h1>
        </div>
        <p className="text-text-secondary text-lg">
          Calculate your monthly mortgage payments and affordability
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Inputs */}
        <div className="xl:col-span-1">
          <div className="card p-6 sticky top-6">
            <h2 className="text-xl font-semibold text-text-primary mb-6">Your Details</h2>

            <div className="space-y-6">
              {/* Property Details */}
              <div>
                <h3 className="font-medium text-text-primary mb-4">Property Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Property Price
                    </label>
                    <div className="relative">
                      <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <input
                        type="number"
                        value={inputs.propertyPrice}
                        onChange={(e) => handleInputChange('propertyPrice', Number(e.target.value))}
                        className="input-field pl-10 w-full"
                        step="1000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Deposit
                    </label>
                    <div className="relative">
                      <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <input
                        type="number"
                        value={inputs.deposit}
                        onChange={(e) => handleInputChange('deposit', Number(e.target.value))}
                        className="input-field pl-10 w-full"
                        step="1000"
                      />
                    </div>
                    {results && (
                      <div className="text-xs text-text-muted mt-1">
                        {results.depositPercentage}% of property price
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Mortgage Details */}
              <div>
                <h3 className="font-medium text-text-primary mb-4">Mortgage Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Interest Rate (%)
                    </label>
                    <input
                      type="number"
                      value={inputs.interestRate}
                      onChange={(e) => handleInputChange('interestRate', Number(e.target.value))}
                      className="input-field w-full"
                      step="0.1"
                      min="0"
                      max="15"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Mortgage Term (years)
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <input
                        type="number"
                        value={inputs.termYears}
                        onChange={(e) => handleInputChange('termYears', Number(e.target.value))}
                        className="input-field pl-10 w-full"
                        min="5"
                        max="40"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Income Details */}
              <div>
                <h3 className="font-medium text-text-primary mb-4">Financial Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Annual Income
                    </label>
                    <div className="relative">
                      <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <input
                        type="number"
                        value={inputs.annualIncome}
                        onChange={(e) => handleInputChange('annualIncome', Number(e.target.value))}
                        className="input-field pl-10 w-full"
                        step="1000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Monthly Outgoings
                    </label>
                    <div className="relative">
                      <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <input
                        type="number"
                        value={inputs.monthlyOutgoings}
                        onChange={(e) => handleInputChange('monthlyOutgoings', Number(e.target.value))}
                        className="input-field pl-10 w-full"
                        step="100"
                      />
                    </div>
                    <div className="text-xs text-text-muted mt-1">
                      Bills, food, transport, etc.
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Existing Debt (annual)
                    </label>
                    <div className="relative">
                      <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <input
                        type="number"
                        value={inputs.existingDebt}
                        onChange={(e) => handleInputChange('existingDebt', Number(e.target.value))}
                        className="input-field pl-10 w-full"
                        step="1000"
                      />
                    </div>
                    <div className="text-xs text-text-muted mt-1">
                      Credit cards, loans, etc.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="xl:col-span-2">
          {/* Navigation Tabs */}
          <div className="border-b border-border mb-8">
            <div className="flex space-x-8 overflow-x-auto">
              {tabs.map(tab => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-4 border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-accent text-accent'
                        : 'border-transparent text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {results && (
            <>
              {/* Calculator Results */}
              {activeTab === 'calculator' && (
                <div className="space-y-6">
                  {/* Main Results */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card p-6 text-center bg-gradient-to-br from-accent/10 to-primary/10">
                      <div className="text-3xl font-bold text-accent mb-2">
                        {formatCurrency(results.monthlyPayment)}
                      </div>
                      <div className="text-text-secondary">Monthly Payment</div>
                    </div>

                    <div className="card p-6 text-center">
                      <div className="text-3xl font-bold text-primary mb-2">
                        {formatCurrency(results.loanAmount)}
                      </div>
                      <div className="text-text-secondary">Loan Amount</div>
                    </div>
                  </div>

                  {/* Additional Calculations */}
                  <div className="card p-6">
                    <h3 className="text-xl font-semibold text-text-primary mb-6">Mortgage Breakdown</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <div className="text-lg font-bold text-text-primary">
                          {formatCurrency(results.totalInterest)}
                        </div>
                        <div className="text-text-secondary text-sm">Total Interest</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-text-primary">
                          {formatCurrency(results.totalAmount)}
                        </div>
                        <div className="text-text-secondary text-sm">Total Amount</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-text-primary">
                          {results.loanToValue}%
                        </div>
                        <div className="text-text-secondary text-sm">Loan to Value</div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Schedule Preview */}
                  <div className="card p-6">
                    <h3 className="text-xl font-semibold text-text-primary mb-4">Payment Timeline</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div className="p-4 bg-secondary rounded-lg">
                        <div className="font-bold text-text-primary">Year 1</div>
                        <div className="text-text-secondary text-sm">
                          {formatCurrency(results.monthlyPayment * 12)}
                        </div>
                      </div>
                      <div className="p-4 bg-secondary rounded-lg">
                        <div className="font-bold text-text-primary">Year 5</div>
                        <div className="text-text-secondary text-sm">
                          {formatCurrency(results.monthlyPayment * 12 * 5)}
                        </div>
                      </div>
                      <div className="p-4 bg-secondary rounded-lg">
                        <div className="font-bold text-text-primary">Final</div>
                        <div className="text-text-secondary text-sm">
                          {formatCurrency(results.totalAmount)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Affordability Results */}
              {activeTab === 'affordability' && (
                <div className="space-y-6">
                  {/* Affordability Rating */}
                  <div className={`card p-6 border-2 ${getAffordabilityBg(results.affordabilityRating)}`}>
                    <div className="text-center">
                      <div className={`text-2xl font-bold mb-2 ${getAffordabilityColor(results.affordabilityRating)}`}>
                        {affordabilityBands.find(b => b.rating === results.affordabilityRating)?.label} Affordability
                      </div>
                      <div className="text-text-secondary mb-4">
                        {affordabilityBands.find(b => b.rating === results.affordabilityRating)?.description}
                      </div>
                      <div className="text-lg font-medium text-text-primary">
                        Payment is {results.monthlyAffordability.ratio}% of monthly income
                      </div>
                    </div>
                  </div>

                  {/* Monthly Breakdown */}
                  <div className="card p-6">
                    <h3 className="text-xl font-semibold text-text-primary mb-6">Monthly Budget Breakdown</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-text-secondary">Monthly Income</span>
                        <span className="font-bold text-success">
                          +{formatCurrency(results.monthlyAffordability.income)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-text-secondary">Current Outgoings</span>
                        <span className="font-bold text-error">
                          -{formatCurrency(results.monthlyAffordability.outgoings)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-text-secondary">Mortgage Payment</span>
                        <span className="font-bold text-error">
                          -{formatCurrency(results.monthlyAffordability.payment)}
                        </span>
                      </div>
                      <hr className="border-border" />
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-text-primary">Remaining</span>
                        <span className={`font-bold text-xl ${
                          results.monthlyAffordability.remaining > 0 ? 'text-success' : 'text-error'
                        }`}>
                          {formatCurrency(results.monthlyAffordability.remaining)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Borrowing Capacity */}
                  <div className="card p-6">
                    <h3 className="text-xl font-semibold text-text-primary mb-4">Borrowing Capacity</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-text-secondary">Maximum you could borrow</span>
                        <span className="font-bold text-text-primary">
                          {formatCurrency(results.maxBorrowAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-text-secondary">You want to borrow</span>
                        <span className="font-bold text-accent">
                          {formatCurrency(results.loanAmount)}
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-3">
                        <div
                          className="bg-accent h-3 rounded-full transition-all"
                          style={{
                            width: `${Math.min((results.loanAmount / results.maxBorrowAmount) * 100, 100)}%`
                          }}
                        />
                      </div>
                      <div className="text-sm text-text-muted">
                        {Math.round((results.loanAmount / results.maxBorrowAmount) * 100)}% of maximum capacity
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="card p-6">
                    <h3 className="text-xl font-semibold text-text-primary mb-4">Recommendations</h3>
                    <div className="space-y-3">
                      {results.affordabilityRating === 'poor' && (
                        <div className="flex items-start gap-3 p-4 bg-error/10 border border-error/20 rounded-lg">
                          <AlertCircle className="w-5 h-5 text-error mt-0.5 flex-shrink-0" />
                          <div className="text-sm">
                            <div className="font-medium text-error mb-1">Consider reducing your borrowing</div>
                            <div className="text-error/80">
                              Your mortgage payments would be {results.monthlyAffordability.ratio}% of your income,
                              which may be difficult to sustain.
                            </div>
                          </div>
                        </div>
                      )}

                      {results.depositPercentage < 20 && (
                        <div className="flex items-start gap-3 p-4 bg-warning/10 border border-warning/20 rounded-lg">
                          <Info className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
                          <div className="text-sm">
                            <div className="font-medium text-warning mb-1">Consider a larger deposit</div>
                            <div className="text-warning/80">
                              A 20%+ deposit typically gets you better interest rates and avoids mortgage insurance.
                            </div>
                          </div>
                        </div>
                      )}

                      {results.affordabilityRating === 'excellent' && (
                        <div className="flex items-start gap-3 p-4 bg-success/10 border border-success/20 rounded-lg">
                          <TrendingUp className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                          <div className="text-sm">
                            <div className="font-medium text-success mb-1">Great affordability!</div>
                            <div className="text-success/80">
                              You have excellent affordability with room for unexpected expenses or rate increases.
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Costs */}
              {activeTab === 'costs' && (
                <div className="space-y-6">
                  {/* Total Upfront Costs */}
                  <div className="card p-6 text-center bg-gradient-to-br from-primary/10 to-accent/10">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {formatCurrency(results.totalUpfrontCosts)}
                    </div>
                    <div className="text-text-secondary">Total Upfront Costs</div>
                  </div>

                  {/* Cost Breakdown */}
                  <div className="card p-6">
                    <h3 className="text-xl font-semibold text-text-primary mb-6">Cost Breakdown</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 border-b border-border">
                        <div>
                          <div className="font-medium text-text-primary">Deposit</div>
                          <div className="text-sm text-text-muted">
                            {results.depositPercentage}% of property price
                          </div>
                        </div>
                        <div className="font-bold text-text-primary">
                          {formatCurrency(inputs.deposit)}
                        </div>
                      </div>

                      <div className="flex justify-between items-center py-3 border-b border-border">
                        <div>
                          <div className="font-medium text-text-primary">Stamp Duty</div>
                          <div className="text-sm text-text-muted">
                            {inputs.propertyPrice <= 250000 ? 'No stamp duty on first £250k' : 'SDLT on purchase'}
                          </div>
                        </div>
                        <div className="font-bold text-text-primary">
                          {formatCurrency(results.stampDuty)}
                        </div>
                      </div>

                      <div className="flex justify-between items-center py-3 border-b border-border">
                        <div>
                          <div className="font-medium text-text-primary">Solicitor Fees</div>
                          <div className="text-sm text-text-muted">Legal costs and searches</div>
                        </div>
                        <div className="font-bold text-text-primary">
                          {formatCurrency(results.solicitorFees)}
                        </div>
                      </div>

                      <div className="flex justify-between items-center py-3 border-b border-border">
                        <div>
                          <div className="font-medium text-text-primary">Survey Fees</div>
                          <div className="text-sm text-text-muted">Property survey and valuation</div>
                        </div>
                        <div className="font-bold text-text-primary">
                          {formatCurrency(results.surveyFees)}
                        </div>
                      </div>

                      <div className="flex justify-between items-center py-3">
                        <div>
                          <div className="font-medium text-text-primary">Other Costs</div>
                          <div className="text-sm text-text-muted">
                            Mortgage arrangement, insurance, etc.
                          </div>
                        </div>
                        <div className="font-bold text-text-primary">
                          £1,000
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Monthly Costs */}
                  <div className="card p-6">
                    <h3 className="text-xl font-semibold text-text-primary mb-6">Ongoing Monthly Costs</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-text-secondary">Mortgage Payment</span>
                        <span className="font-bold text-accent">
                          {formatCurrency(results.monthlyPayment)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-text-secondary">Council Tax (est.)</span>
                        <span className="font-bold text-text-primary">£120 - £200</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-text-secondary">Home Insurance (est.)</span>
                        <span className="font-bold text-text-primary">£25 - £50</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-text-secondary">Utilities (est.)</span>
                        <span className="font-bold text-text-primary">£150 - £300</span>
                      </div>
                      <hr className="border-border" />
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-text-primary">Total Monthly (est.)</span>
                        <span className="font-bold text-xl text-primary">
                          {formatCurrency(results.monthlyPayment + 350)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}