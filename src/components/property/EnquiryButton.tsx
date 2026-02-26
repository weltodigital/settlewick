'use client'

import { useState } from 'react'
import { Mail, Calendar } from 'lucide-react'
import PropertyEnquiry from './PropertyEnquiry'
import type { PropertyWithDetails } from '@/types/property'

interface EnquiryButtonProps {
  property: PropertyWithDetails
  variant?: 'icon' | 'button' | 'primary'
  className?: string
}

export default function EnquiryButton({
  property,
  variant = 'button',
  className = ''
}: EnquiryButtonProps) {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false)

  if (variant === 'icon') {
    return (
      <>
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setIsEnquiryOpen(true)
          }}
          className={`w-10 h-10 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200 bg-white/90 hover:bg-primary hover:text-white text-text-muted backdrop-blur-sm ${className}`}
          title="Make an enquiry"
        >
          <Mail className="w-4 h-4" />
        </button>

        <PropertyEnquiry
          property={property}
          isOpen={isEnquiryOpen}
          onClose={() => setIsEnquiryOpen(false)}
        />
      </>
    )
  }

  if (variant === 'primary') {
    return (
      <>
        <button
          onClick={() => setIsEnquiryOpen(true)}
          className={`btn-primary flex items-center justify-center gap-2 ${className}`}
        >
          <Calendar className="w-4 h-4" />
          Book Viewing
        </button>

        <PropertyEnquiry
          property={property}
          isOpen={isEnquiryOpen}
          onClose={() => setIsEnquiryOpen(false)}
        />
      </>
    )
  }

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsEnquiryOpen(true)
        }}
        className={`flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-primary hover:text-white text-text-primary rounded-lg transition-colors ${className}`}
      >
        <Mail className="w-4 h-4" />
        Enquire
      </button>

      <PropertyEnquiry
        property={property}
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
      />
    </>
  )
}