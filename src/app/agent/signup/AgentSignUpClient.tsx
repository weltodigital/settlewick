'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, User, Building2, Phone, MapPin } from 'lucide-react'

export default function AgentSignUpClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedPlan = searchParams.get('plan') || 'professional'

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    phone: '',
    location: '',
    licenseNumber: '',
    plan: selectedPlan
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'AGENT',
          metadata: {
            companyName: formData.companyName,
            phone: formData.phone,
            location: formData.location,
            licenseNumber: formData.licenseNumber,
            plan: formData.plan
          }
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        })

        if (result?.error) {
          setError('Account created but sign-in failed. Please try signing in manually.')
        } else {
          router.push('/agent/dashboard')
          router.refresh()
        }
      } else {
        setError(data.message || 'Failed to create account')
      }
    } catch (error) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const plans = {
    starter: { name: 'Starter', price: '£29', features: ['Up to 5 listings', 'Basic CRM', 'Standard support'] },
    professional: { name: 'Professional', price: '£79', features: ['Unlimited listings', 'Advanced CRM', 'Priority support'] },
    enterprise: { name: 'Enterprise', price: '£199', features: ['Multi-branch', 'Custom branding', 'Dedicated manager'] }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-accent/5 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/agent" className="inline-block mb-8">
            <h1 className="text-3xl font-bold text-primary">Settlewick</h1>
          </Link>
          <h2 className="text-3xl font-bold text-text-primary">Join as an Estate Agent</h2>
          <p className="mt-2 text-text-secondary">Start your 14-day free trial with the {plans[selectedPlan as keyof typeof plans]?.name} plan</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="card p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {/* Personal Information */}
                <div>
                  <h3 className="font-semibold text-text-primary mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
                        Full name *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-text-muted" />
                        </div>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          className="input-field pl-10 w-full"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                        Email address *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-text-muted" />
                        </div>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          className="input-field pl-10 w-full"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Company Information */}
                <div>
                  <h3 className="font-semibold text-text-primary mb-4">Company Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="companyName" className="block text-sm font-medium text-text-primary mb-2">
                        Company name *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Building2 className="h-5 w-5 text-text-muted" />
                        </div>
                        <input
                          id="companyName"
                          name="companyName"
                          type="text"
                          required
                          className="input-field pl-10 w-full"
                          placeholder="Your estate agency"
                          value={formData.companyName}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-text-primary mb-2">
                        Phone number *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-text-muted" />
                        </div>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          className="input-field pl-10 w-full"
                          placeholder="Your contact number"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-text-primary mb-2">
                        Location *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="h-5 w-5 text-text-muted" />
                        </div>
                        <input
                          id="location"
                          name="location"
                          type="text"
                          required
                          className="input-field pl-10 w-full"
                          placeholder="Portsmouth, Hampshire"
                          value={formData.location}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="licenseNumber" className="block text-sm font-medium text-text-primary mb-2">
                        License number
                      </label>
                      <input
                        id="licenseNumber"
                        name="licenseNumber"
                        type="text"
                        className="input-field w-full"
                        placeholder="Professional license no."
                        value={formData.licenseNumber}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <h3 className="font-semibold text-text-primary mb-4">Account Security</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
                        Password *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-text-muted" />
                        </div>
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          required
                          className="input-field pl-10 pr-10 w-full"
                          placeholder="Create a password"
                          value={formData.password}
                          onChange={handleChange}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-text-muted hover:text-text-secondary" />
                          ) : (
                            <Eye className="h-5 w-5 text-text-muted hover:text-text-secondary" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary mb-2">
                        Confirm password *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-text-muted" />
                        </div>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          className="input-field pl-10 pr-10 w-full"
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5 text-text-muted hover:text-text-secondary" />
                          ) : (
                            <Eye className="h-5 w-5 text-text-muted hover:text-text-secondary" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-accent w-full text-lg py-3"
                >
                  {isLoading ? 'Creating account...' : 'Start Free Trial'}
                </button>
              </form>

              {/* Sign In Link */}
              <div className="mt-6 text-center">
                <p className="text-text-secondary">
                  Already have an agent account?{' '}
                  <Link
                    href="/auth/signin"
                    className="text-accent hover:text-accent-dark font-medium transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Plan Summary */}
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                {plans[selectedPlan as keyof typeof plans]?.name} Plan
              </h3>
              <div className="text-3xl font-bold text-accent mb-2">
                {plans[selectedPlan as keyof typeof plans]?.price}
              </div>
              <div className="text-text-secondary text-sm mb-4">per month</div>

              <ul className="space-y-2">
                {plans[selectedPlan as keyof typeof plans]?.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-4 border-t border-border">
                <div className="text-sm text-text-muted">
                  14-day free trial included
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h4 className="font-semibold text-text-primary mb-3">What's included:</h4>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>• Professional property listings</li>
                <li>• Lead management system</li>
                <li>• Viewing scheduler</li>
                <li>• Performance analytics</li>
                <li>• Mobile app access</li>
                <li>• Email & phone support</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-text-muted mt-8">
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="text-accent hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-accent hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}