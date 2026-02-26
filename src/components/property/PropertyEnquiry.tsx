'use client'

import { useState } from 'react'
import { Mail, Phone, MessageSquare, Send, Check, X, User, Calendar, Clock } from 'lucide-react'
import type { PropertyWithDetails } from '@/types/property'

interface PropertyEnquiryProps {
  property: PropertyWithDetails
  isOpen: boolean
  onClose: () => void
}

interface EnquiryFormData {
  name: string
  email: string
  phone: string
  enquiryType: 'viewing' | 'information' | 'valuation' | 'other'
  message: string
  preferredContact: 'email' | 'phone' | 'either'
  availableTimes: string[]
  marketingConsent: boolean
}

export default function PropertyEnquiry({ property, isOpen, onClose }: PropertyEnquiryProps) {
  const [formData, setFormData] = useState<EnquiryFormData>({
    name: '',
    email: '',
    phone: '',
    enquiryType: 'viewing',
    message: '',
    preferredContact: 'either',
    availableTimes: [],
    marketingConsent: false
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  if (!isOpen) return null

  const enquiryTypes = [
    { value: 'viewing', label: 'Book a Viewing', icon: Calendar },
    { value: 'information', label: 'Request Information', icon: MessageSquare },
    { value: 'valuation', label: 'Property Valuation', icon: Phone },
    { value: 'other', label: 'Other Enquiry', icon: Mail }
  ]

  const timeSlots = [
    'Morning (9am - 12pm)',
    'Afternoon (12pm - 5pm)',
    'Evening (5pm - 8pm)',
    'Weekend'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Here you would normally submit to your API
    console.log('Enquiry submitted:', {
      ...formData,
      property: {
        id: property.id,
        address: `${property.addressLine1}, ${property.addressTown}`,
        price: property.price,
        listingType: property.listingType
      }
    })

    setIsSubmitting(false)
    setIsSubmitted(true)

    // Auto-close after success
    setTimeout(() => {
      onClose()
      setIsSubmitted(false)
    }, 2000)
  }

  const handleTimeSlotToggle = (timeSlot: string) => {
    setFormData(prev => ({
      ...prev,
      availableTimes: prev.availableTimes.includes(timeSlot)
        ? prev.availableTimes.filter(t => t !== timeSlot)
        : [...prev.availableTimes, timeSlot]
    }))
  }

  const getEnquiryTypeMessage = (type: string) => {
    switch (type) {
      case 'viewing':
        return `I would like to book a viewing for the property at ${property.addressLine1}, ${property.addressTown}.`
      case 'information':
        return `I would like more information about the property at ${property.addressLine1}, ${property.addressTown}.`
      case 'valuation':
        return `I would like a valuation for a similar property in the area.`
      default:
        return `I have an enquiry about the property at ${property.addressLine1}, ${property.addressTown}.`
    }
  }

  // Update message when enquiry type changes
  const handleEnquiryTypeChange = (type: EnquiryFormData['enquiryType']) => {
    setFormData(prev => ({
      ...prev,
      enquiryType: type,
      message: prev.message || getEnquiryTypeMessage(type)
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="min-h-screen py-4 px-4 flex items-center justify-center">
        <div className="bg-surface rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-surface rounded-t-2xl border-b border-border p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-text-primary">Property Enquiry</h3>
                  <p className="text-sm text-text-muted">Get in touch about this property</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-secondary hover:bg-error hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Property Info */}
          <div className="p-6 border-b border-border">
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                {property.images?.[0] ? (
                  <img
                    src={property.images[0].imageUrl}
                    alt="Property"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Mail className="w-8 h-8 text-text-muted" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-text-primary">
                  {property.bedrooms} bed {property.propertyType?.toLowerCase().replace('_', ' ')} in {property.addressTown}
                </h4>
                <p className="text-primary font-semibold text-lg mt-1">
                  £{property.price.toLocaleString()}{property.listingType === 'RENT' ? ' pcm' : ''}
                </p>
                <p className="text-sm text-text-muted mt-1">
                  {property.addressLine1}, {property.addressTown}, {property.addressPostcode}
                </p>
              </div>
            </div>
          </div>

          {isSubmitted ? (
            /* Success State */
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">Enquiry Sent Successfully!</h3>
              <p className="text-text-secondary mb-4">
                Thank you for your enquiry. {property.agent?.name || 'The estate agent'} will be in touch within 24 hours.
              </p>
              <div className="text-sm text-text-muted">
                Closing automatically...
              </div>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} className="p-6">
              {/* Enquiry Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-text-primary mb-3">
                  What can we help you with?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {enquiryTypes.map((type) => {
                    const IconComponent = type.icon
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleEnquiryTypeChange(type.value as any)}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          formData.enquiryType === type.value
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border hover:border-primary/30 text-text-secondary'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-4 h-4" />
                          <span className="font-medium text-sm">{type.label}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Contact Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="Your full name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Your phone number"
                  />
                </div>
              </div>

              {/* Available Times (for viewings) */}
              {formData.enquiryType === 'viewing' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-text-primary mb-3">
                    When are you available? (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((timeSlot) => (
                      <label
                        key={timeSlot}
                        className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                          formData.availableTimes.includes(timeSlot)
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border hover:border-primary/30'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.availableTimes.includes(timeSlot)}
                          onChange={() => handleTimeSlotToggle(timeSlot)}
                          className="sr-only"
                        />
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">{timeSlot}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Message */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Message *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                  placeholder="Please provide any additional details..."
                />
              </div>

              {/* Preferred Contact Method */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-text-primary mb-3">
                  Preferred Contact Method
                </label>
                <div className="flex gap-4">
                  {[
                    { value: 'email', label: 'Email', icon: Mail },
                    { value: 'phone', label: 'Phone', icon: Phone },
                    { value: 'either', label: 'Either', icon: MessageSquare }
                  ].map((method) => {
                    const IconComponent = method.icon
                    return (
                      <label
                        key={method.value}
                        className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer flex-1 transition-colors ${
                          formData.preferredContact === method.value
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border hover:border-primary/30'
                        }`}
                      >
                        <input
                          type="radio"
                          name="preferredContact"
                          value={method.value}
                          checked={formData.preferredContact === method.value}
                          onChange={(e) => setFormData(prev => ({ ...prev, preferredContact: e.target.value as any }))}
                          className="sr-only"
                        />
                        <IconComponent className="w-4 h-4" />
                        <span className="text-sm font-medium">{method.label}</span>
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* Marketing Consent */}
              <div className="mb-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.marketingConsent}
                    onChange={(e) => setFormData(prev => ({ ...prev, marketingConsent: e.target.checked }))}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2 mt-1"
                  />
                  <div className="text-sm text-text-secondary">
                    I would like to receive updates about similar properties and market news from{' '}
                    <span className="font-medium">{property.agent?.name || 'this agent'}</span>.
                  </div>
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 btn-secondary"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Enquiry
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}